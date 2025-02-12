import axios from "axios";

const API_URL = "http://localhost:7000/user";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const fetchUserInfo = async (userId: string) => {
  return api.get(`/profile/${userId}`);
};

export const updateUserInfo = async (
  userId: string,
  userData: { username?: string; email?: string },
  file?: File
) => {
  const formData = new FormData();
  if (file) {
    formData.append("profilePicture", file);
  }
  formData.append("data", JSON.stringify(userData));
  return api.put(`/update-profile/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
