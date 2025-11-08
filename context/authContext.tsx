import { auth, fireStore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || null,
        });
        updateUserData(firebaseUser.uid);
        // console.log('====================================');
        // console.log("Data of the User", firebaseUser);
        // console.log('====================================');
        router.replace("/(tabs)");
      } else {
        setUser(null);
        router.replace("/(auth)/welcome");
      }
    });
    return () => unSubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      console.log("Error Msg", msg);
      if (msg.includes("(auth/invalid-credential)")) msg = "Wrong Credentials";
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid Email";
      return { success: false, msg };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      let response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(fireStore, "users", response?.user?.uid), {
        email: email,
        name: name,
        uid: response?.user?.uid,
      });
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      console.log("Error Msg", msg);
      if (msg.includes("(auth/email-already-in-use)")) msg = "The Email is already in use";
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid Email";
      return { success: false, msg };
    }
  };
  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(fireStore, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // setUser( as string);
        const data = docSnap.data();
        const userData: UserType = {
          uid: data.uid,
          email: data.email || null,
          name: data.name || null,
          image: data.image || null,
        };
        setUser({ ...userData });
      }
    } catch (error: any) {
      const msg = error?.message;
      console.log("Error", msg);
      //   return { success: false, msg };
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be wrapped inside provider");
  }
  return context;
};
