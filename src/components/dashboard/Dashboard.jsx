import React from "react";
import app from "../../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
const auth = getAuth(app);
export const Dashboard = () => {
  return <div>{auth.currentUser.email}</div>;
};
