import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const BASE_URL = import.meta.env.VITE_BASE_URL;

const AllBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/ab/cd/all_businesses`);
        setBusinesses(res.data);
      } catch (error) {
        console.error("Error fetching businesses", error);
      }
    };
    fetchBusinesses();
  }, []);

  return (
    <div className="useallbusiness-background">
      <h1 className="useallbusiness-heading">Discover Businesses</h1>
      <div className="useallbusiness-container">
        {businesses.map((biz, index) => (
          <div key={index} className="useallbusiness-card">
            <h2 className="useallbusiness-name">{biz.Businessname}</h2>
            <Link to={`/people/${biz.Businessname}`}>
              <button className="useallbusiness-button">Shop Now</button>
            </Link>
          </div>
        ))}
      </div>
    </div>

  );
};

export default AllBusinesses;
