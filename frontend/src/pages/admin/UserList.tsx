import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import {
  updateUser,
  createUser,
  fetchUsers,
  deleteUser,
} from "../../redux/slices/adminSlice";
import { Button, Modal, Box } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const UserList = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [selectedUser, setSelectedUser] = useState<{
    _id: string;
    name: string;
    email: string;
  } | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { users, error, loading } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleOpen = (
    user: { _id: string; name: string; email: string } | null
  ) => {
    setSelectedUser(user);
    setUserData(
      user
        ? { name: user.name, email: user.email, password: "" }
        : { name: "", email: "", password: "" }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUser) {
      dispatch(
        updateUser({
          id: selectedUser._id,
          email: userData?.email,
          name: userData.name,
        })
      );
    } else {
      dispatch(
        createUser({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        })
      );
    }
    handleClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleDelete = (id: string) => {
    dispatch(deleteUser(id));
  };

  return (
    <Layout>
      <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-0">
          User Management
        </h1>

        <Button onClick={() => handleOpen(null)}> Add User </Button>
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Create User
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={userData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                {!selectedUser && (
                  <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition duration-300 ease-in-out"
                >
                  {selectedUser ? "Update User" : "Create User"}
                </button>
              </form>
            </div>
          </div>
        </Box>
      </Modal>

      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-3">Name</th>
            <th className="border border-gray-300 p-3">Email</th>
            <th className="border border-gray-300 p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-3">{user.name}</td>
              <td className="border border-gray-300 p-3">{user.email}</td>
              <td className="border border-gray-300 p-3 flex gap-4">
                <button
                  onClick={() => handleOpen(user)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default UserList;
