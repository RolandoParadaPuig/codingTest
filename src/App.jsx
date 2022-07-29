import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthBody } from "./components/auth/authBody/AuthBody";
import { Dashboard } from "./components/dashboard/Dashboard";
import { PrivateRoute } from "./components/privateRoute/PrivateRoute";
import "../src/css/App.css";
import { UserInfo } from "./components/auth/userInfo/UserInfo";
import { useState } from "react";
function App() {
  const [newUserEmail, setNewUserEmail] = useState("");
  return (
    <>
      {/* secure Routes to ensure the app works properly */}
      <Router>
        <Routes>
          <Route
            path="/login/*"
            element={<AuthBody setNewUserEmail={setNewUserEmail} />}
          />
          <Route
            path="/login/userInfo/*"
            element={<UserInfo newUserEmail={newUserEmail} />}
          />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
