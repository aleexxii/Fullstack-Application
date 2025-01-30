import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import {
  fetchProfileData,
  updateProfile,
} from "../../redux/slices/profileSlice";
import { updateUser } from "../../redux/slices/authSlice";

const Profile = () => {
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);
  const { profileData, loading, error } = useSelector(
    (state: RootState) => state.profile
  );

  const [imagePreview, setImagePreview] = useState(user?.profilePicture || null)

  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePicture, setProfilePicture] = useState<File | null>(null)

  useEffect(() => {
    if (user) {
      dispatch(fetchProfileData());
    }
  }, [ dispatch, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePicture(file);
      setImagePreview(URL.createObjectURL(file))
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    // const updatedData = { name, email, profilePicture };
    const updatedData = new FormData()
    updatedData.append('name' , name)
    updatedData.append('email' , email)
    if (profilePicture) {
      updatedData.append('profilePicture', profilePicture);
    }
    
    try {
      const result = await dispatch(updateProfile(updatedData));
      
      if (updateProfile.fulfilled.match(result)) {
        dispatch(updateUser(result.payload));
        dispatch(fetchProfileData());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };  


  useEffect(() => {
    // Cleanup function to revoke object URL
    return () => {
      if (imagePreview && imagePreview !== user?.profilePicture) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, user?.profilePicture]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const displayData = profileData || user;
  console.log(" Display data ", displayData);

  return (
    <>
      <Navbar />
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
          <input type="file" name="profilePicture" ref={profilePictureRef} accept="image/*" hidden onChange={handleImageChange}/>
          <img
            src={ imagePreview || user?.profilePicture}
            onClick={() => profilePictureRef.current?.click()}
            alt="profile"
            className="mt-2 h-24 w-24 self-center cursor-pointer rounded-full object-cover border-2 border-white"
          />
          <input
            value={name}
            type="text"
            name="name"
            placeholder="Username"
            className="bg-slate-100 rounded-lg object-contain p-3"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            defaultValue={email}
            type="email"
            name="email"
            placeholder="email"
            className="bg-slate-100 rounded-lg object-contain p-3"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="password"
            placeholder="password"
            className="bg-slate-100 rounded-lg object-contain p-3"
          />
          <button
            disabled={isUpdating}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>
        </form>
        <div className="flex justify-between mt-4">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer">Sign Out</span>
        </div>
      </div>
    </>
  );
};

export default Profile;
