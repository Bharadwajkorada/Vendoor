import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Start and Grow Your Business Online, Effortlessly.</h1>
        <p className="hero-subtext">
          A simple platform for small-scale businesses to manage inventory, track sales, and reach more customers.
        </p>
        <div className="hero-buttons">
          <Link to="/signup" className="hero-btn get-started">Get Started</Link>
          <Link to="/explore" className="hero-btn explore">Explore Marketplace</Link>
        </div>
      </div>
      <div className="hero-image">
        <img src="/image.png" alt="Business Dashboard Preview" />
      </div>
    </section>
  );
};

export default Hero;
