import { useState, useEffect } from "react";
import api from "../api";
import SortVisualizer from "./SortVisualizer";
import MainNavbar from "./MainNavbar";
import "../styles/Home.css";

function Home() {
  return (
    <>
        <MainNavbar />
      <div>
        <SortVisualizer />
      </div>
    </>
  );
}

export default Home;
