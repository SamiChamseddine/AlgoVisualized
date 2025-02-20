import { useState } from "react";
import SortVisualizer from "./SortVisualizer";
import CurveFitVisualization from "./CurveFitVisualization";
import MainPage from "./MainPage";
import Navbar from "./Navbar"

const Home = () => {
  const [selectedVisualizer, setSelectedVisualizer] = useState("home");

  const handleSelect = (visualizer) => {
    setSelectedVisualizer(visualizer);
  };

  return (
    <div>
      <Navbar onSelect={handleSelect} />
      <div  className="bg-black">
        {selectedVisualizer === "home" && <MainPage/>}
        {selectedVisualizer === "sort" && <SortVisualizer />}
        {selectedVisualizer === "curve" && <CurveFitVisualization />}
      </div>
    </div>
  );
};

export default Home;
