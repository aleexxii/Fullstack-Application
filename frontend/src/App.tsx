import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/client/Home";
import Profile from "./pages/client/Profile";
import { PrivateRoutes } from "./components/PrivateRoutes";
import { useEffect } from "react";
import { checkAuth } from "./redux/slices/authSlice";

function App() {
  useEffect(() => {
    store.dispatch(checkAuth());
  }, []);
  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoutes roles={["user"]}>
                  <Home />
                </PrivateRoutes>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoutes roles={["user"]}>
                  <Profile />
                </PrivateRoutes>
              }
            />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}

export default App;
