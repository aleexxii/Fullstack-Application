import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/client/Home";
import Profile from "./pages/client/Profile";
import { PersistGate } from "redux-persist/integration/react";
import { PublicRoute, UserRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
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
              
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
          </Router>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
