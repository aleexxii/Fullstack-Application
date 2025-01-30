import { useEffect } from "react";
import Layout from "./Layout";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/adminSlice";

const UserList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEdit = (id: string) => {
    console.log(`Editing user ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Deleting user ID: ${id}`);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
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
            <tr key={user._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-3">{user.name}</td>
              <td className="border border-gray-300 p-3">{user.email}</td>
              <td className="border border-gray-300 p-3 flex gap-4">
                <button
                  onClick={() => handleEdit(user._id)}
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
