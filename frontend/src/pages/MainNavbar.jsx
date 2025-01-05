import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../styles/MainNavbar.css";
import { Link } from 'react-router-dom';


function MainNavbar() {
  return (
  <>
    <div class="topnav">
      <a class="active" href="#home">
        Home
      </a>
      <Link to="/sort-visualizer">News</Link>
      <a href="#contact">Contact</a>
      <a href="#about">About</a>
    </div>
    </>
  );
}

export default MainNavbar;
