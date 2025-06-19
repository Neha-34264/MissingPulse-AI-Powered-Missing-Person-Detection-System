import React from 'react';
import "./Home.css";
import heroImage from './heroimagefinal.png'; // Adjust path if needed

const Home = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-image">
          <img src={heroImage} alt="Missing Poster" />
        </div>
        <div className="hero-text">
          <p className="tagline">LET'S FIND YOUR CLOSE ONE'S WITH OUR RECOGNITION SYSTEMS</p>
          <h1>MissingPulse</h1>
          <p className="description">
            AI-Powered Missing People 
Detection System .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
