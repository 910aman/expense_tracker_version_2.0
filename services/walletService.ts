import { ResponseType, WalletType } from "@/types";
import { uploadFileToCloudinary } from "./ImageServices";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { fireStore } from "@/config/firebase";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };
    if (walletData.image) {
      const imageUploadRes = await uploadFileToCloudinary(
        walletData.image,
        "wallets"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload wallet icon",
        };
      }
      walletToSave.image = imageUploadRes.data;
    }
    if (!walletData?.id) {
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpense = 0;
      walletToSave.created = new Date();
    }
    const walletRef = walletData?.id
      ? doc(fireStore, "wallets", walletData?.id)
      : doc(collection(fireStore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true });
    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    console.log("Error updating error: ", error);
    return { success: false, msg: error?.message };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(fireStore, "wallets", walletId);
    await deleteDoc(walletRef);

    deleteTransactionByWalletId(walletId);
    
    return { success: true, msg: "Wallet deleted successfully" };
  } catch (error: any) {
    console.log("error deleting wallet", error);
    return { success: false };
  }
};

export const deleteTransactionByWalletId = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransactions = true;
    while (hasMoreTransactions) {
      const transactionQuery = query(
        collection(fireStore, "transactions"),
        where("walletId", "==", walletId)
      );
      const transactionSnapshot = await getDocs(transactionQuery);
      if (transactionSnapshot.size === 0) {
        hasMoreTransactions = false;
        break;
      }

      const batch = writeBatch(fireStore);

      transactionSnapshot.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref);
      });

      await batch.commit();
    }
    return { success: true, msg: "All Transactions deleted successfully" };
  } catch (error: any) {
    console.log("error deleting wallet", error);
    return { success: false };
  }
};
