import { fireStore } from "@/config/firebase";
import { TransactionType, WalletType } from "@/types";
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./ImageServices";
import { createOrUpdateWallet } from "./walletService";

export const createOrUpdateTransaction = async (
  transationData: Partial<TransactionType>
) => {
  try {
    const { id, type, walletId, amount, image } = transationData;
    if (!type || !walletId || !amount || amount <= 0) {
      return { success: false, msg: "Invalid transaction data!" };
    }
    if (id) {
      //todo: update existing trnasaction
      const oldTransactionSnapshot = await getDoc(
        doc(fireStore, "transactions", id)
      );
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOriginal =
        oldTransaction.type !== type ||
        oldTransaction.amount !== amount ||
        oldTransaction.walletId !== walletId;
      if (shouldRevertOriginal) {
        let res = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!res.success) return res;
      }
    } else {
      // update wallet
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      );
      if (!res.success) return res;
    }

    if (image) {
      const imageUploadRes = await uploadFileToCloudinary(image, "users");
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload image",
        };
      }
      transationData.image = imageUploadRes.data;
    }

    const transactionRef = id
      ? doc(fireStore, "transactions", id)
      : doc(collection(fireStore, "transactions"));
    await setDoc(transactionRef, transationData, { merge: true });

    return {
      success: true,
      data: { ...transationData, id: transactionRef.id },
    };
  } catch (err: any) {
    console.log("error creating or updating transaction", err);
    return { success: true, msg: err.message };
  }
};

const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
) => {
  try {
    const originalWalletSnapshot = await getDoc(
      doc(fireStore, "wallets", oldTransaction.walletId)
    );
    // const walletSnapshot = if (!walletSnapshot.exists()) {
    const originalWallet = originalWalletSnapshot.data() as WalletType;
    let newWalletSnapshot = await getDoc(
      doc(fireStore, "wallets", newWalletId)
    );

    let newWallet = newWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction.type === "income" ? "totalIncome" : "totalExpense";

    const revertIncomeExpense: number =
      oldTransaction.type === "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense;

    const revertedIncomeExpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount);

    if (newTransactionType === "expense") {
      // convert from income to expense
      if (
        oldTransaction.walletId === newWalletId &&
        revertWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet don't have enough balance",
        };
      }

      // if user tries to add expense from a new wallet but the wallet don't have enough balance
      if (newWallet?.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: "The selected wallet don't have enough balance",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    //  Revert Completed
    //////////////////////////////////////////////////////////////

    // refetch the newWallet because we may have just updated it
    newWalletSnapshot = await getDoc(doc(fireStore, "wallets", newWalletId));
    newWallet = newWalletSnapshot.data() as WalletType;

    const updateType =
      newTransactionType === "income" ? "totalIncome" : "totalExpense";

    const updatedTransactionAmount: number =
      newTransactionType === "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

    const newIncomeExpenseAmount = Number(
      newWallet[updateType]! + Number(newTransactionAmount)
    );

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    return { success: true };
  } catch (error: any) {
    return { success: true, msg: error.message };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(fireStore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);
    if (!walletSnapshot.exists()) {
      console.log("Error updating wallet for new transaction: ");
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    if (type === "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Selected wallet don't have enough balance",
      };
    }
    const updateType = type === "income" ? "totalIncome" : "totalExpense";
    const updatedWalletAmount =
      type === "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updatedTotals =
      type === "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals,
    });

    return { success: true };
  } catch (error: any) {
    return { success: true, msg: error.message };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId: string
) => {
  try {
    const transactionRef = doc(fireStore, "transactions", transactionId)
    const transactionSnapshot = await getDoc(transactionRef);

    if (!transactionSnapshot.exists()) {
      return { success: false, msg: "Transaction not found" };
    }

    const transactionData = transactionSnapshot.data() as TransactionType;

    const TransactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;
    // fetch wallet to update amount, totalIncome or totalExpenses
    const walletSnapshot = await getDoc(doc(fireStore, "wallets", walletId));
    const walletData = walletSnapshot.data() as WalletType;

    const updateType =
      TransactionType === "income" ? "totalIncome" : "totalExpense";

    const newWalletAmount =
      walletData?.amount! -
      (TransactionType === "income" ? transactionAmount : -transactionAmount);

    const newIncomeExpenseAmount = walletData[updateType]! - transactionAmount;

    if (TransactionType === "expense" && newWalletAmount < 0) {
      return { success: false, msg: "You cannot delete this transaction" };
    }

    await createOrUpdateWallet({
      id:walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount
    })

    await deleteDoc(transactionRef);

    return { success: true };
  } catch (error: any) {
    console.log("Error updating wallet for new transaction", error);
    return { success: false, msg: error.message };
  }
};
