import React from "react";
import app from "../../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
const auth = getAuth(app);
export const TestComponent = () => {
  return <div>Test {auth.currentUser.email}</div>;
};
