import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Snackbar from "./components/Snackbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import "./App.css";

function App() {
    return (
        <Router>
            <Snackbar />
            <Header />

            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <Account />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/statistics"
                    element={<Statistics />}
                />
                <Route
                    path="/settings"
                    element={<Settings />}
                />
            </Routes>
        </Router>
    );
}

export default App;
