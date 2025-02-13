import { useEffect, useState } from "react";
import Layout from "./Layout";
import { Button, Modal, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  create_user,
  delete_user,
  fetchAllUsers,
  update_user,
} from "../../redux/slices/adminSlice";
import toast from "react-hot-toast";

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
  const [userData, setUserData] = useState({ username: "", email: "", password: "", confirmPassword : '', role: "" });
  const [selectedUser, setSelectedUser] = useState<{ _id: string; username: string; email: string; role: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const filterdUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpen = (
    user: { _id: string; username: string; email: string; role: string } | null
  ) => {
    setSelectedUser(user);
    setUserData(
      user
        ? {
            username: user.username,
            email: user.email,
            password: "",
            confirmPassword : '',
            role: user.role,
          }
        : { username: "", email: "", password: "", confirmPassword : '', role: "" }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.username.trim()) {
      toast.error("Username is required");
      return;
    }
  
    if (!userData.email.trim()) {
      toast.error("Email is required");
      return;
    }
  
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      toast.error("Invalid email format");
      return;
    }
  
    if (!selectedUser) {
      if (!userData.password.trim()) {
        toast.error("Password is required");
        return;
      }
  
      if (userData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
  
      if (userData.password !== userData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
  
      if (!userData.role.trim()) {
        toast.error("Role is required");
        return;
      }
    }
    try {
      if (selectedUser) {
        await dispatch(
          update_user({
            userId: selectedUser._id,
            userData: {
              username: userData.username,
              email: userData.email,
            },
          })
        );
        toast.success("User updated successfully");
      } else {

        const res = await dispatch(
          create_user({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            role: userData.role,
          })
        );
        console.log('res from create' , res);
        if(res.payload.message == 'Rejected'){
          return toast.error(res.payload);
        }
        toast.success(res.payload)
      }
      dispatch(fetchAllUsers());
      handleClose();
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message || "Operation failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (userId: string) => {
    try {
      dispatch(delete_user(userId)).unwrap();
      toast.success("User deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete user");
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-0">
          User Management
        </h1>
        <Button onClick={() => handleOpen(null)}> Add User </Button>
      </div>

      <div className="p-3">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg"
          value={searchQuery}
          placeholder="search users"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
                    htmlFor="username"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="username"
                    value={userData.username}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
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
                  />
                </div>

                {!selectedUser && (
                  <div>
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
                        placeholder="Password"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="password"
                        className="block text-gray-700 font-bold mb-2"
                      >
                        Confirm password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Confirm Password"
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="password"
                        className="block text-gray-700 font-bold mb-2"
                      >
                        Role
                      </label>
                      <input
                        type="text"
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Role"
                      />
                    </div>
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
            <th className="border border-gray-300 p-3">username</th>
            <th className="border border-gray-300 p-3">Email</th>
            <th className="border border-gray-300 p-3">Role</th>
            <th className="border border-gray-300 p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterdUsers.length == 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No users found.
              </td>
            </tr>
          ) : (
            filterdUsers.map((user) => (
              <tr key={user.email} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-3">{user.username}</td>
                <td className="border border-gray-300 p-3">{user.email}</td>
                <td className="border border-gray-300 p-3">{user.role}</td>
                <td className="border border-gray-300 p-3 flex gap-4">
                  <button
                    onClick={() => handleOpen(user)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id!)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Layout>
  );
};

export default UserList;
