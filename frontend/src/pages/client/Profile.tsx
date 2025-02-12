import { useRef } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


const Profile = () => {
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const { user } = useSelector((state:RootState) => state.auth);

console.log(user);

  const handleImageChange = () => {
    
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    }
    
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
            value={'name'}
            type="text"
            name="name"
            placeholder="Username"
            className="bg-slate-100 rounded-lg object-contain p-3"
          />
          <input
            defaultValue={'email'}
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
            { "Updating..."}
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
