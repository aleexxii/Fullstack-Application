import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { clearUserError, fetchUser, updateUser } from "../../redux/slices/userSlice";
import toast from "react-hot-toast";
import { logoutUser } from "../../redux/slices/authSlice";

const Profile = () => {
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const { user: authuser } = useAppSelector((state) => state.auth);
  const { userInfo, loading, error } = useAppSelector((state) => state.user);

  const [username, setUsername] = useState(authuser?.username || "");
  const [email, setEmail] = useState(authuser?.email || "");
  const [imagePreview, setImagePreview] = useState<string | null>(authuser?.profilePicture || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (authuser?._id) {
      dispatch(fetchUser(authuser._id));
    }
  }, [dispatch, authuser?._id]);

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file?.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!username.trim() || !email.trim()){
      toast.error('Invalid format')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Invalid email format');
      return;
    }

    if (authuser?._id) {
      const updateData = { username, email };

      dispatch(
        updateUser({
          userId: authuser._id,
          userData: updateData,
          file: selectedFile || undefined,
        })
      );
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserError());
    }
  }, [error, dispatch]);

  if (!authuser) return <div>Loading...</div>;

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <>
      <Navbar />
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
          <input
            type="file"
            name="profilePicture"
            ref={profilePictureRef}
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />

          <img
            src={imagePreview || userInfo?.profilePicture}
            onClick={() => profilePictureRef.current?.click()}
            alt={`${import.meta.env.VITE_API_BASE_URL}${
              userInfo?.profilePicture
            }`}
            className="mt-2 h-24 w-24 self-center cursor-pointer rounded-full object-cover border-2 border-white"
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="bg-slate-100 rounded-lg object-contain p-3"
          />
          <input
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email"
            className="bg-slate-100 rounded-lg object-contain p-3"
          />
          {/* <input
            type="password"
            id="password"
            placeholder="password"
            className="bg-slate-100 rounded-lg object-contain p-3"
          /> */}
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
        <div className="flex justify-center mt-4">
          {/* <span className="text-red-700 cursor-pointer">Delete Account</span> */}
            <span className="text-red-700 cursor-pointer rounded-full px-4 py-2 bg-red-100 hover:bg-red-200 transition duration-300 ease-in-out transform hover:scale-105" onClick={handleLogout}>Sign Out</span>
        </div>
      </div>
    </>
  );
};

export default Profile;
