import { Navigate } from "react-router-dom";
import { AuthLoader } from "../AuthLoader";
import { useState } from "react";
import app from "../../firebase/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth(app);

export const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  onAuthStateChanged(auth, (fireBaseUser) => {
    if (fireBaseUser) {
      const uid = fireBaseUser.uid;
      setLoading(false);
    } else {
      setLoading(false);
    }
  });
  if (loading) {
    return <AuthLoader />;
  }
  return auth.currentUser ? children : <Navigate to="/login" />;
};
