import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/Authentication/LoginPage";
import SignupPage from "./components/Authentication/SignupPage";
import Missingcard from "./components/find_loc/Missingcard";
import MissingList from "./components/find_loc/MissingList";
import Home from "./components/Home/Home";
import Formmissing from "./components/missing form/Formmissing";
import Navbar from "./components/navbar/Navbar";
import PersonCard from "./components/missing_list/PersonCard";
import Missing_persons from "./components/missing_list/Missing_persons";
import Hero from "./components/Hero/Hero";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/Formmissing"
            element={
              <ProtectedRoute>
                <Formmissing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Missingpeople"
            element={
              <ProtectedRoute>
                <Missing_persons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/locations"
            element={
              <ProtectedRoute>
                <MissingList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
