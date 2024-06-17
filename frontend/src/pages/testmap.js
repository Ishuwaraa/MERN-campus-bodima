import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Detail from "../components/Detail";
import { Facebook, Share2 } from "lucide-react";
import gender from '../assets/ad/gender.png';
import Bed from "../assets/ad/bed.png";
import shower from '../assets/ad/shower.png'
import Phone from "../assets/ad/phone.png";
import ReviewCard from "../components/ReviewCard";
import Footer from "../components/Footer";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import noReviews from '../assets/noReviews.png';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const Addetail = () => {
  
 
  const [roomRate, setRoomRate] = useState('');
  const [locationRate, setLocationRate] = useState('');
  const [bathroomRate, setBathroomRate] = useState('');
  
  const [adReviews, setAdReviews] = useState([]);
  const [adRating, setAdRating] = useState(null);
  
  const [adDetails, setAdDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const adId = searchParams.get('id');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDdr0Aijr7M2pIqpX43Hsk2erMP4mYtoxc", // Replace with your actual API key
  });

  const fetchData = async () => {
    try {
      if (adId === '') return navigate('/');
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/ads/${adId}`);
      setAdDetails(response.data.ad);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching ad details:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!adDetails) {
    return <div>Error loading ad details</div>;
  }

  const mapStyles = {
    height: "100vh",
    width: "100%"
  };

  const defaultCenter = {
    lat: adDetails.latitude,
    lng: adDetails.longitude
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps</div>;
  }

  return (
    <div>
      <div className="page">
        <div className="w-full h-96 my-10">
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={15}
            center={defaultCenter}
            onLoad={() => console.log("GoogleMap Loaded")}
            onUnmount={() => console.log("GoogleMap Unmounted")}
          >
            <Marker
              position={defaultCenter}
              onLoad={() => console.log("Marker Loaded")}
            />
          </GoogleMap>
        </div>
        {/* Display the latitude and longitude for debugging */}
        <div>
          <p>Latitude: {adDetails.latitude}</p>
          <p>Longitude: {adDetails.longitude}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Addetail;
