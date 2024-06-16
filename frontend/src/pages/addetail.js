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
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import noReviews from '../assets/noReviews.png';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import card from '../assets/card.png';
import { Bounce, toast } from 'react-toastify';
import useAuth from "../hooks/useAuth";

const Addetail = () => {
  const { auth } = useAuth();

  const { register, handleSubmit, watch, formState: { errors }, getValues, setValue } = useForm();
  const review = watch("review");

  const [roomRate, setRoomRate] = useState('');
  const [locationRate, setLocationRate] = useState('');
  const [bathroomRate, setBathroomRate] = useState('');
  const [anonUser, setAnonUser] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [ascSort, setAscSort] = useState([]);
  const [dscSort, setDscSort] = useState([]);

  const [adDetails, setAdDetails] = useState([]);
  const [adReviews, setAdReviews] = useState([]);
  const [adRating, setAdRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adDate, setAdDate] = useState('');
  const [errMessage, setErrMessage] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const [roomHover, setRoomHover] = useState(null);
  const [locationHover, setLocationHover] = useState(null);
  const [bathroomHover, setBathroomHover] = useState(null);

  //ad share
  // const link = encodeURI(window.location.href);
  // useEffect(() => {
  //   const fb = document.getElementById('fb');
  //   const share = document.getElementById('share');

  //   fb && (fb.href = `https://www.facebook.com/share.php?u=${link}`);

  //   if(share) {
  //     if(navigator.share) {
  //       share.addEventListener('click', async (e) => {
  //         e.preventDefault();
  //         try{
  //           await navigator.share({
  //             title: 'title',
  //             text: 'text',
  //             url: window.location.href,
  //           });
  //         } catch(err) {
  //           console.log(err);
  //         }
  //       })
  //     }
  //   }
  // })

  //image slider
  const [currentIndex, setcurrentIndex] = useState(0);

  const nextSlide = () => setcurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  const prevSlide = () => setcurrentIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
  const goToSlide = (index) => setcurrentIndex(index);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const adId = searchParams.get('id');

  //map
  const position = (lat === null || long === null) ? {lat: 6.884504262718018, lng: 79.91861383804526} : {lat: lat, lng: long};

  const fetchData = async () => {
    try{
      if(adId === '') return navigate('/');

      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/ads/${adId}`);
      const reviews = await axios.get(`http://localhost:4000/api/review/${adId}`);
      setAdDetails(response.data.ad);
      setImageUrls(response.data.imageUrls);
      setAdRating(response.data.ad.rating);
      setLat(response.data.ad.latitude);
      setLong(response.data.ad.longitude);
      setAdReviews(reviews.data);
      setErrMessage(null);      
      setLoading(false);
      // console.log(response.data.ad)
      // console.log(reviews.data);
      const date = response.data.ad.createdAt;
      const formatted = new Date(date);
      setAdDate(formatted.toLocaleDateString())
    }catch(err) {
      if(err.response) {
        setLoading(false);
        console.log(err.response.data);
        setErrMessage(err.response.data.msg);
      } else if(err.request) {
        console.log(err.request);
      } else {
        console.log(err.message);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const sortByAsc = () => {
    if(adReviews.length !== 0){
      const ascOrder = [...adReviews].sort((a, b) => {
        const date1 = new Date(a.createAt);
        const date2 = new Date(b.createdAt);

        return date1 - date2
      });
      setAscSort(ascOrder);
    }
  }
  const sortByDsc = () => {
    if(adReviews.length !== 0){
      const dscOrder = [...adReviews].sort((a, b) => {
        const date1 = new Date(a.createdAt);
        const date2 = new Date(b.createdAt);

        return date2 - date1;
      });
      setDscSort(dscOrder);
    }
  }
  const dropdownOnChange = (e) => {
    setSortBy(e.target.value);
    sortByAsc();
    sortByDsc();
  }

  const notify = () => toast.success('Review added successfully!', {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  });
  const errorNotify = (msg) => toast.error(msg, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  });
  const onSubmit = async () => {
    if(!auth?.accessToken){
      // navigate('/login', { state: { from: location.pathname + location.search } });
      navigate('/login');
      return 
    }

    if(roomRate === '' || locationRate === '' || bathroomRate === ''){
      // alert('Please add a rating for all the fields');
      const msg = 'Please add a rating for all the fields'
      errorNotify(msg);
      return
    }

    const formData = {
      userId: anonUser? 'Anonymous user' : '123',
      roomRate,
      locationRate,
      bathroomRate,
      review
    }

    try{
      const response = await axios.post(`http://localhost:4000/api/review/${adId}`, formData);
      // console.log(response);
      fetchData();
      notify();
      setValue('review', '');
    }catch(err) {
      if(err.response) {
        // alert(err.response.data.msg);
        const msg = err.response.data.msg;
        errorNotify(msg);
      } else if(err.request) {
        console.log(err.request);
      } else {
        console.log(err.message);
      }
    }
  }

  return (
    <div>
      <Navbar />

      <div className="page">
        {loading? (
          <Loading /> 
        ) : errMessage? (
          <div className=" flex justify-center">
            <p className=" text-cusGray text-lg">{errMessage}</p>
          </div>
        ) :
        <>      
          <div className=" ">
            <div className=" border border-primary rounded-lg md:w-full overflow-hidden relative  ">
              <div className="absolute inset-0 bg-cover bg-center filter blur-md z-0" style={{ backgroundImage: `url(${imageUrls[currentIndex]})` }}></div>
              <div className=" relative z-10 ">
                <img src={imageUrls[currentIndex]} alt="ad title" className="w-full h-72 md:h-96 object-contain transition-transform duration-500 ease-in-out"/>
              </div>
              
              <button onClick={prevSlide} className="z-20 absolute top-1/2 md:left-5 left-0 transform -translate-y-1/2 p-4 md:bg-gray-700 text-4xl md:text-lg text-primary md:text-white rounded-full md:h-11 md:w-11 flex items-center justify-center">
                <span>&#10094;</span>
              </button>
              <button onClick={nextSlide} className=" z-20 absolute top-1/2 md:right-5 right-0 transform -translate-y-1/2 p-4 md:bg-gray-700 text-4xl md:text-lg text-primary md:text-white rounded-full md:h-11 md:w-11 flex items-center justify-center">
                <span>&#10095;</span>
              </button>

              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {imageUrls.map((_, index) => (
                  <div key={index} className={`w-3 h-3 rounded-full ${ index === currentIndex ? "bg-gray-700" : "bg-gray-400"} cursor-pointer`}onClick={() => goToSlide(index)}/>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-10 my-10 ">
              <div className="col-span-2  md:col-span-3">
                <p className=" text-2xl md:text-4xl font-bold mb-1">{adDetails.title}</p>
                <p className="md:text-2xl text-gray-600">{adDetails.location}</p>
                <p className="md:text-lg text-gray-600">{adDetails.university}</p>
                <p className="text-lg md:text-3xl font-bold text-secondary">Rs. {adDetails.price}/mo</p>
              </div>

              <div className="flex flex-col space-y-5">
                <div className="flex items-center justify-end space-x-3">
                  <p className="text-xl md:text-3xl font-semibold text-gray-600 pt-1">{adRating}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="md:size-10 size-6 text-primary">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex items-center justify-end space-x-3 cursor-pointer">
                  <p className=" text-cusGray text-lg">{adDate}</p>
                  {/* <a href="#" id="fb" target="_blank" className=" border border-black p-1 rounded-lg"><Facebook className=" text-gray-700" size={20}/></a>
                  <a href="#" id="share" className=" border border-black p-1 rounded-lg"><Share2 className=" text-gray-700" size={20}/></a> */}
                </div>
              </div>
            </div>
          </div>

          <div className=" grid grid-cols-2 md:grid-cols-4 gap-5">
            <Detail name={adDetails.gender} image={gender} />

            <Detail name={adDetails.bed} image={Bed} />

            <Detail name={adDetails.bathroom} image={shower} />
            
            <Detail name={`0${adDetails.contact}`} image={Phone} />
          </div>

          <div className="mt-10 mb-20 md:text-xl text-lg text-justify ">
            <p>{adDetails.description}</p>
          </div>

          <p className="mb-8 text-2xl md:text-4xl text-primary font-bold">What others say about this property</p>
          <div className=" flex flex-col md:grid md:grid-cols-2 gap-10 mt-10">
            {/* left col */}
            <div className="flex flex-col justify-center border border-primary rounded-lg">
              {adReviews.length > 0 && 
                <div className=" flex justify-between mt-5 px-5 items-center mb-1">
                  <p className=" text-cusGray">{adReviews.length} reviews</p>
                  <select name="sort" value={sortBy} onChange={(e) => dropdownOnChange(e)} className="h-8 p-1 border border-cusGray rounded-lg">
                      <option value="" className=" text-gray-500">Sort by</option>
                      <option value="new" >Date added (Newest)</option>
                      <option value="old" >Date added (Oldest)</option>
                  </select>
                </div>                          
              }
              <div className="max-h-96 overflow-y-auto p-5 md:py-8">
                {/* Wrapper for all review cards */}
                <div className=" space-y-14 ">
                  {adReviews.length === 0 ? (
                    <div className=" flex flex-col justify-center items-center">
                      <img src={noReviews} alt="no reviews" className=" w-40" />
                      <p className=" text-cusGray md:-ml-8">No reviews yet...</p>
                    </div> 
                    ) : (sortBy === 'new') ? (
                      dscSort.map((review, index) => {
                        const date = review.createdAt;
                        const formatted = new Date(date);

                        return (
                          <ReviewCard
                            name={review.userId}
                            date={formatted.toLocaleDateString()}
                            review={review.review}
                            room={review.room}
                            location={review.location}
                            bathroom={review.bathroom}
                            key={index}
                          />
                        )
                      })
                    ) : (sortBy === 'old')? (
                      ascSort.map((review, index) => {
                        const date = review.createdAt;
                        const formatted = new Date(date);

                        return (
                          <ReviewCard
                            name={review.userId}
                            date={formatted.toLocaleDateString()}
                            review={review.review}
                            room={review.room}
                            location={review.location}
                            bathroom={review.bathroom}
                            key={index}
                          />
                        )
                      })
                    ) : (
                      adReviews.map((review, index) => {
                        const date = review.createdAt;
                        const formatted = new Date(date);

                        return (
                          <ReviewCard
                            name={review.userId}
                            date={formatted.toLocaleDateString()}
                            review={review.review}
                            room={review.room}
                            location={review.location}
                            bathroom={review.bathroom}
                            key={index}
                          />
                        )
                      })
                    )                  
                  }
                </div>
              </div>
            </div>

            {/* right col */}
            <div className=" border border-primary md:py-8 p-5 rounded-lg">
              <form onSubmit={handleSubmit(onSubmit)}>
              <div className=" w-52">
                <div className=" flex justify-between items-center text-lg">
                  <p>Room</p>
                  <div className="flex ">
                    {[...Array(3)].map((star, index) => {
                      const currentRating = index + 1;

                      return (
                        <label key={index}>
                          <input type="radio" value={currentRating} style={{display: "none"}} onChange={() => setRoomRate(currentRating)}/>                        
                          <svg style={{ color: currentRating <= (roomHover || roomRate) ? "#FF7A00" : "#555453"}} className="size-5 border-primary cursor-pointer mr-1"
                            onMouseEnter={() => setRoomHover(currentRating)} onMouseLeave={() => setRoomHover(null)}
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                          </svg>
                        </label>
                      );
                    })}
                  </div>
                </div>
                
                <div className=" flex justify-between items-center text-lg">
                  <p>Location</p>
                  <div className="flex">
                    {[...Array(3)].map((star, index) => {
                      const currentRating = index + 1;

                      return (
                        <label key={index}>
                          <input type="radio" value={currentRating} style={{display: "none"}} onChange={() => setLocationRate(currentRating)}/>                        
                          <svg style={{ color: currentRating <= (locationHover || locationRate) ? "#FF7A00" : "#555453"}} className="size-5 border-primary cursor-pointer mr-1"
                            onMouseEnter={() => setLocationHover(currentRating)} onMouseLeave={() => setLocationHover(null)}
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                          </svg>
                        </label>
                      );
                    })} 
                  </div>
                  
                </div>
                <div className=" flex justify-between items-center text-lg">
                  <p>Bathroom</p>
                  <div className="flex">
                    {[...Array(3)].map((star, index) => {
                      const currentRating = index + 1;

                      return (
                        <label key={index}>
                          <input type="radio" value={currentRating} style={{display: "none"}} onChange={() => setBathroomRate(currentRating)}/>                        
                          <svg style={{ color: currentRating <= (bathroomHover || bathroomRate) ? "#FF7A00" : "#555453"}} className="size-5 border-primary cursor-pointer mr-1"
                            onMouseEnter={() => setBathroomHover(currentRating)} onMouseLeave={() => setBathroomHover(null)}
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                          </svg>
                        </label>
                      );
                    })} 
                  </div>
                </div>
              </div>

              <textarea name="description" rows="4" required placeholder="tell us what you think about this place..." style={{resize: "none"}} className=" mt-10 p-2 w-full border border-cusGray rounded-lg"
              {...register("review", { maxLength: 300, pattern: /^[a-zA-Z0-9\s\.,_&@'"?!\-]+$/i })}/>
              {errors.review && errors.review.type === "maxLength" ? (
                <span className=" text-sm text-red-600">
                  max character limit is 300
                </span>
              ) : (
                errors.review && (
                  <span className=" text-sm text-red-600">
                    review must contain only letters, numbers, and characters(@ & ' " _ - , . !)
                  </span>
                )
              )}

              <span className=" text-sm text-red-600">note: You need to be logged in to add a review</span>
              <div className="mt-3 flex items-center">
                <input type="checkbox" id="anonUser" className=' w-4 h-4 ' onChange={(e) => setAnonUser(e.target.checked)}/>
                <label htmlFor="anonUser" className=' ml-2 text-cusGray  cursor-pointer text-center'>stay anonymous</label>
              </div>

              <div className="flex justify-end mt-10  ">
                <button className=" btn bg-primary">Add review</button>
              </div>
              </form>
            </div>

          </div>
          
          <div className=" w-full h-96 border border-cusGray rounded-lg my-20 overflow-hidden">
            <APIProvider apiKey={process.env.REACT_APP_MAP_KEY}>
              <Map defaultCenter={position} defaultZoom={12} mapId={'bf51a910020fa25a'}>
                <AdvancedMarker position={position} />
              </Map>
            </APIProvider>
          </div> 
        </>
        }
      </div>
      <Footer />
    </div>
  );
};

export default Addetail;
