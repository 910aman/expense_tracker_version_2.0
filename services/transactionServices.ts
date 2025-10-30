import { fireStore } from "@/config/firebase";
import { TransactionType, WalletType } from "@/types";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./ImageServices";

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
