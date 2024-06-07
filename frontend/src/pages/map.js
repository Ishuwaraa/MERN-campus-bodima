import Navbar from "../components/Navbar";
import MapCard from "../components/MapCard";
import Footer from "../components/Footer";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Loading from "../components/Loading";

const Map = () => {
  const [ads, setAds] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [errMessage, setErrMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const infoWindowRef = useRef(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/ads/');        
        setAds(response.data.ads);
        setImageUrls(response.data.imageUrls);
      }catch(err) {
        if(err.response) {
          console.log(err.response.data);
          setErrMessage(err.response.data.msg);
        } else if(err.request) {
          console.log(err.request);
        } else {
          console.log(err.message);
        }
      }
    };

    fetchAds();
  }, []);

  const loadGoogleMapsScript = useCallback((callback) => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDdr0Aijr7M2pIqpX43Hsk2erMP4mYtoxc`;
      script.async = true;
      script.defer = true;
      script.onload = callback;
      document.body.appendChild(script);
    } else {
      callback();
    }
  }, []);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 6.9271, lng: 79.8612 },
        zoom: 10,
      });
      infoWindowRef.current = new window.google.maps.InfoWindow();
    });
  }, [loadGoogleMapsScript]);

  useEffect(() => {
    if (googleMapRef.current) {
      markers.forEach(marker => marker.setMap(null));  // Clear existing markers
      const newMarkers = ads.map(ad => {
        const marker = new window.google.maps.Marker({
          position: { lat: parseFloat(ad.latitude), lng: parseFloat(ad.longitude) },
          map: googleMapRef.current,
          title: ad.title,
        });

        // Add click event listener for each marker
        marker.addListener('click', () => {
          infoWindowRef.current.setContent(`<div><strong>${ad.title}</strong></div>`);
          infoWindowRef.current.open(googleMapRef.current, marker);
        });

        return marker;
      });
      setMarkers(newMarkers);
    }
  }, [ads]);

  const smoothZoom = (map, max, cnt) => {
    if (cnt >= max) {
      return;
    } else {
      const z = window.google.maps.event.addListener(map, 'zoom_changed', () => {
        window.google.maps.event.removeListener(z);
        smoothZoom(map, max, cnt + 1);
      });
      setTimeout(() => { map.setZoom(cnt) }, 80);
    }
  };

  const zoomInOnLocation = (latitude, longitude) => {
    const latLng = new window.google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
    googleMapRef.current.panTo(latLng);
    smoothZoom(googleMapRef.current, 15, googleMapRef.current.getZoom());
  };

  return (
    <div>
      <Navbar/>

      <div className="page">

        {errMessage? (
          <div className=" flex justify-center">
            <p className=" text-cusGray text-lg">{errMessage}</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-5">
              <p className=" text-sm text-red-400">Click on the card to zoom in on the location.</p>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-10">
              <div className="flex flex-row md:flex-col border border-red-500 rounded-lg px-5 py-8 md:px-2 min-w-64 h-56 md:h-110 md:overflow-y-scroll overflow-x-scroll md:overflow-x-hidden">
                <div className="flex flex-row md:flex-col">
                  {ads.map((ad, index) => {
                    const image = imageUrls[index % imageUrls.length];
                    return (
                      <MapCard
                        key={ad._id}
                        image={image}
                        title={ad.title}
                        gender={ad.gender}
                        bed={ad.bed}
                        price={ad.price}
                        onClick={() => zoomInOnLocation(ad.latitude, ad.longitude)}
                        viewClick={ad._id}
                      />
                    )
                  })}
                </div>
              </div>

              <div className="h-110 md:col-span-2 lg:col-span-3 border border-cusGray rounded-lg">
                <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
              </div>
            </div>
          </>
        )}
        
      </div>

      <Footer/>
    </div>
  );
};

export default Map;
