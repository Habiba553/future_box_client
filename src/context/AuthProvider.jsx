// src/context/AuthProvider.jsx
import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // will hold { uid, email, accessToken, ...firebaseUserProps }
  const [loading, setLoading] = useState(true);

  // --- Firebase wrapper functions ---
  const createUserWithEmailAndPasswordFunc = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateProfileFunc = (displayName, photoURL) => {
    if (!auth.currentUser) return Promise.reject(new Error("No authenticated user"));
    return updateProfile(auth.currentUser, { displayName, photoURL });
  };

  const sendEmailVerificationFunc = () => {
    if (!auth.currentUser) return Promise.reject(new Error("No authenticated user"));
    setLoading(true);
    return sendEmailVerification(auth.currentUser);
  };

  const signInWithEmailAndPasswordFunc = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogleFunc = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const signInWithGithubFunc = () => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider);
  };

  const signoutUserFunc = () => {
    setLoading(true);
    return signOut(auth);
  };

  const sendPassResetEmailFunc = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  // Higher-level signOut that ensures state cleared
  const signOutUser = async () => {
    setLoading(true);
    try {
      await signoutUserFunc();
      setUser(null);
    } catch (e) {
      console.error("signOutUser error", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // --- Aliases for existing codebase compatibility ---
  // Many components in your project call different names; expose common aliases:
  const createUser = createUserWithEmailAndPasswordFunc;
  const updateUserProfile = updateProfileFunc;
  const signInUser = signInWithEmailAndPasswordFunc;
  const signInWithGoogle = signInWithGoogleFunc;

  // --- Keep auth state synced and attach accessToken ---
  useEffect(() => {
    // onAuthStateChanged returns unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      try {
        if (currUser) {
          // get ID token (access token) for server calls
          const token = await currUser.getIdToken(/* forceRefresh */ false);
          // Create a small sanitized user object used through your app
          const minimalUser = {
            uid: currUser.uid,
            email: currUser.email,
            displayName: currUser.displayName || null,
            photoURL: currUser.photoURL || null,
            accessToken: token,
            // keep the raw firebase user as well (optional)
            // firebaseUser: currUser,
          };
          setUser(minimalUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("onAuthStateChanged handler error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,

    // firebase-flavored functions
    createUserWithEmailAndPasswordFunc,
    updateProfileFunc,
    sendEmailVerificationFunc,
    signInWithEmailAndPasswordFunc,
    signInWithGoogleFunc,
    signInWithGithubFunc,
    signoutUserFunc,
    sendPassResetEmailFunc,

    // convenience / legacy aliases (so existing components keep working)
    createUser,
    updateUserProfile,
    signInUser,
    signInWithGoogle,
    signOutUser, // the higher-level sign out that clears state
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
