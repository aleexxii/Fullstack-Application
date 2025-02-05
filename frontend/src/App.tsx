import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/client/Home";
import Profile from "./pages/client/Profile";
import {
  AdminRoute,
  PublicRoute,
  UserRoute,
} from "./components/ProtectedRoute";
import Dashboard from "./pages/admin/Dashboard";
import UserList from "./pages/admin/UserList";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Provider store={store}>
      <Toaster position="top-center"  toastOptions={
        {
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              duration: 2000,
            },
            error: {
              duration: 3000,
            },
          }
        }
      />
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<UserRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-list" element={<UserList />} />
          </Route>
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
