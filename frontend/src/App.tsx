import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/client/Home";
import Profile from "./pages/client/Profile";
import Dashboard from "./pages/admin/Dashboard";
import UserList from "./pages/admin/UserList";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import { Provider } from "react-redux";
import { store } from "./redux/store";


function App() {
  return (
    <>
    <Provider store={store}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            duration: 2000,
          },
          error: {
            duration: 3000,
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-list" element={<UserList />} />
          </Route>
        </Routes>
      </Router>
      </Provider>
      </>
  );
}

export default App;
