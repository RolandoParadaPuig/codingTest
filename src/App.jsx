import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthBody } from "./components/auth/authBody/AuthBody";
import { Dashboard } from "./components/dashboard/Dashboard";
import { PrivateRoute } from "./components/privateRoute/PrivateRoute";
import "../src/css/App.css";
import { TestComponent } from "./components/testComponent/TestComponent";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login/*" element={<AuthBody />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/test/*"
            element={
              <PrivateRoute>
                <TestComponent />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
