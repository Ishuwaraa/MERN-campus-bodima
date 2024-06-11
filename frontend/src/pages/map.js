import Navbar from "../components/Navbar";
import MapCard from "../components/MapCard";
import Footer from "../components/Footer";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from "../components/Loading";
import { APIProvider, Map, InfoWindow, AdvancedMarker, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

const MapPage = () => {
  const [ads, setAds] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [errMessage, setErrMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  //map 
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  
  //map default positon
  const defPosition = {lat: 6.884504262718018, lng: 79.91861383804526};

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

  // const smoothZoom = (map, max, cnt) => {
  //   if (cnt >= max) {
  //     return;
  //   } else {
  //     const z = window.google.maps.event.addListener(map, 'zoom_changed', () => {
  //       window.google.maps.event.removeListener(z);
  //       smoothZoom(map, max, cnt + 1);
  //     });
  //     setTimeout(() => { map.setZoom(cnt) }, 80);
  //   }
  // };

  // const zoomInOnLocation = (latitude, longitude) => {
  //   const latLng = new window.google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
  //   googleMapRef.current.panTo(latLng);
  //   smoothZoom(googleMapRef.current, 15, googleMapRef.current.getZoom());
  // };

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
              <div className="flex flex-row md:flex-col border border-red-500 rounded-lg px-5 py-8 md:px-2 min-w-64 h-64 md:h-110 md:overflow-y-scroll overflow-x-scroll md:overflow-x-hidden">
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
                        onClick={() => null}
                        viewClick={ad._id}
                      />
                    )
                  })}
                </div>
              </div>

              <div className="h-110 md:col-span-2 lg:col-span-3 border border-cusGray rounded-lg">
                <APIProvider apiKey={process.env.REACT_APP_MAP_KEY}>
                  <Map defaultCenter={defPosition} defaultZoom={10} mapId={'bf51a910020fa25a'}>
                    {ads.map((ad, index) => {
                      const position = { lat: ad.latitude, lng: ad.longitude };

                      return (
                        <AdvancedMarker position={position} key={index} title={ad.title} />
                        // <AdvancedMarker 
                        //   ref={markerRef}
                        //   onClick={() => setInfowindowOpen(true)}
                        //   position={position}
                        //   title='Click to view ad details'
                        //   key={index}
                        // >
                        //   {infowindowOpen && (
                        //     <InfoWindow
                        //       anchor={marker}
                        //       maxWidth={200}
                        //       onCloseClick={() => setInfowindowOpen(false)}                              
                        //     >
                        //       info window
                        //     </InfoWindow>
                        //   )}
                        // </AdvancedMarker>
                      )
                    })}
                  </Map>
                </APIProvider>
              </div>
            </div>
          </>
        )}
        
      </div>

      <Footer/>
    </div>
  );
};

export default MapPage;
