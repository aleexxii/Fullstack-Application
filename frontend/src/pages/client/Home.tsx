import Navbar from "../../components/Navbar";
import Lottie from "lottie-react";
import car_anim from "../../assets/car-animation.json";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchUser } from "../../redux/slices/authSlice";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const user = async () => {
      return await dispatch(fetchUser());
    };
    user();
  }, [dispatch]);

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <header className="z-10">
        <Navbar />
      </header>
      <main className="flex-1 flex justify-center items-center">
        <Lottie
          animationData={car_anim}
          className="w-full h-screen bg-black overflow-hidden"
        />
      </main>
    </div>
  );
};

export default Home;
