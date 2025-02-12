import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchUser, updateUser } from "../../redux/slices/userSlice";



const Profile = () => {
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const { user : authuser } = useAppSelector((state) => state.auth);
  const { userInfo, loading, error } = useAppSelector((state) => state.user);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (authuser?.id) {
      dispatch(fetchUser(authuser.id));
    }
  }, [dispatch, authuser?.id]);

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const handleImageChange = () => {
    
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if(authuser?.id){
      const updateData = {
        username,
        email,
      }
      dispatch(updateUser({userId: authuser.id, userData: updateData}));
    }

    }

    if (!authuser) return <div>Loading...</div>;
    
  return (
    <>
      <Navbar />
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
          <input type="file" name="profilePicture" ref={profilePictureRef} accept="image/*" hidden onChange={handleImageChange}/>
          <img
            // src={ imagePreview || user?.profilePicture}
            src={''}
            onClick={() => profilePictureRef.current?.click()}
            alt="profile"
            className="mt-2 h-24 w-24 self-center cursor-pointer rounded-full object-cover border-2 border-white"
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            name="name"
            placeholder="Username"
            className="bg-slate-100 rounded-lg object-contain p-3"
          />
          <input
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            placeholder="email"
            className="bg-slate-100 rounded-lg object-contain p-3"
          />
          <input
            type="password"
            id="password"
            placeholder="password"
            className="bg-slate-100 rounded-lg object-contain p-3"
          />
          <button
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update"}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
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
