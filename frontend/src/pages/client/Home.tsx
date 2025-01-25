import Navbar from "../../components/Navbar";
import Lottie from "lottie-react";
import car_anim from "../../assets/car-animation.json";

const Home: React.FC = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col">
    {/* Navbar */}
    <header className="z-10">
      <Navbar />
    </header>

    {/* Lottie Animation */}
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
