import { useEffect, useState } from "react";
import { User } from "../../types/auth";
import Layout from "./Layout";

const UserList = () => {
  // const users: User[] = [
  //   { _id: "1", name: "John Doe", email: "john@example.com", profilePicture : '', role : 'user' },
  //   { _id: "2", name: "Jane Smith", email: "jane@example.com", profilePicture : '', role : 'user' },
  //   { _id: "3", name: "Alice Johnson", email: "alice@example.com", profilePicture : '', role : 'user' },
  // ];

  const [users, setUsers] = useState<User []>([])


  useEffect(() => {
    const response = async () =>{
      const data = await fetch('http://localhost:7000/admin/users-list',{
        method : 'GET',
        headers :{
          'Content-Type' : 'application/json'
        },
        credentials : 'include'
      })
      setUsers(await data.json())
    }
    response()
  },[users])
  
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
}

export default UserList