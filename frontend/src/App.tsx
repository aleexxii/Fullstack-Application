import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/client/Home";
import Profile from "./pages/client/Profile";

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}

export default App;
