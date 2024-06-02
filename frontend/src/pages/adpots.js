import React, { useState } from 'react';
import axios from 'axios';

const Adpost = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [title, setTitle] = useState('');
  const [gender, setGender] = useState('');
  const [bed, setBed] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAd = {
      image: "/path/to/image1.jpg",  // Replace with actual image path or add an input for image URL
      title,
      gender,
      bed,
      price,
      latitude,
      longitude
    };

    try {
      await axios.post('http://localhost:3000/map', newAd);
      alert('Ad posted successfully!');
    } catch (error) {
      console.error('Error posting ad:', error);
    }
  };

  return (
    <div>
      <div className="page">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="flex flex-col justify-center mx-5 md:mx-20 lg:mx-40 mt-3 mb-10">
            <div className="lg:px-20 mb-3">
              <p className="mt-3 mb-1 w-full text-secondary font-semibold text-xl">Title</p>
              <input
                type="text"
                name="title"
                required
                className="input"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="lg:px-20 mb-3">
              <p className="mt-3 mb-1 w-full text-secondary font-semibold text-xl">Gender</p>
              <input
                type="text"
                name="gender"
                required
                className="input"
                placeholder="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>
            <div className="lg:px-20 mb-3">
              <p className="mt-3 mb-1 w-full text-secondary font-semibold text-xl">Bed</p>
              <input
                type="text"
                name="bed"
                required
                className="input"
                placeholder="Beds"
                value={bed}
                onChange={(e) => setBed(e.target.value)}
              />
            </div>
            <div className="lg:px-20 mb-3">
              <p className="mt-3 mb-1 w-full text-secondary font-semibold text-xl">Price</p>
              <input
                type="text"
                name="price"
                required
                className="input"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="lg:px-20 mb-3">
              <p className="mt-3 mb-1 w-full text-secondary font-semibold text-xl">Latitude</p>
              <input
                type="text"
                name="latitude"
                required
                className="input"
                placeholder="6.9271"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div className="lg:px-20 mb-3">
              <p className="mt-3 mb-1 w-full text-secondary font-semibold text-xl">Longitude</p>
              <input
                type="text"
                name="longitude"
                required
                className="input"
                placeholder="79.8612"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
            <button type="submit" className="btn">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Adpost;
