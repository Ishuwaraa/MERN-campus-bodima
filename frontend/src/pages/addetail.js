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

const Addetail = () => {
  const { register, handleSubmit, watch, formState: { errors }, getValues, setValue } = useForm();
  const review = watch("review");
  const [roomRate, setRoomRate] = useState('');
  const [locationRate, setLocationRate] = useState('');
  const [bathroomRate, setBathroomRate] = useState('');
  const [adDetails, setAdDetails] = useState([]);
  const [adReviews, setAdReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [firstImageClick, setFirstImageClick] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);
  const [adDate, setAdDate] = useState('');
  const [adRate, setAdRate] = useState(0);
  const [errMessage, setErrMessage] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

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

  //some abracadabara stuff cuz image loading takes a while -_-
  // const nextSlide = () => {
  //   setImageLoading(true);
  //   if(!firstImageClick){
  //     if(timeoutId){
  //       clearTimeout(timeoutId);
  //       setTimeoutId(null);
  //     }
  //     setImageLoading(false);
  //     setcurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  //   }
  //   const newTimeoutId = setTimeout(() => {
  //     setcurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  //     setImageLoading(false);
  //     setFirstImageClick(false);
  //   }, 2000); 
    
  //   setTimeoutId(newTimeoutId);
  // };
  // const prevSlide = () => {
  //   setImageLoading(true);
  //   setTimeout(() => {
  //     setcurrentIndex((prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
  //     setImageLoading(false);
  //   }, 1000); 
  // };
  // const goToSlide = (index) => {    
  //   setImageLoading(true);
  //   setTimeout(() => {
  //     setcurrentIndex(index);
  //     setImageLoading(false);
  //   }, 1000); 
  // };

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const adId = searchParams.get('id');

  const fetchData = async () => {
    try{
      if(adId === '') return navigate('/');

      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/ads/${adId}`);
      setAdDetails(response.data.ad);
      setAdReviews(response.data.ad.reviews);
      setImageUrls(response.data.imageUrls);      
      setLoading(false);
      const date = response.data.ad.createdAt;
      const formatted = new Date(date);
      setAdDate(formatted.toLocaleDateString())

      //calculating rating
      if(response.data.ad.reviews.length !== 0) {
        const reviewRatings = response.data.ad.reviews;
        // console.log(reviewRatings);
        let wholeRate = 0;

        reviewRatings.forEach((rate) => {
          const individualRate = rate.bathroom + rate.location + rate.room;
          wholeRate += individualRate;
          // console.log(individualRate, rate.user, response.data.ad.reviews.length)          
        })
        const finalRate = wholeRate / (response.data.ad.reviews.length * 3);
        // console.log(finalRate.toFixed(2));
        setAdRate(finalRate.toFixed(1));
      }
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
  }, [])

  const onSubmit = async () => {
    if(roomRate === '' || locationRate === '' || bathroomRate === ''){
      alert('Please add a rating for all the fields');
      return
    }

    const formData = {
      username: 'Anonymous user',
      roomRate,
      locationRate,
      bathroomRate,
      review
    }

    try{
      const response = await axios.post(`http://localhost:4000/api/ads/review/${adId}`, formData);
      // console.log(response);
      fetchData();
      setValue('review', '');
    }catch(err) {
      if(err.response) {
        console.log(err.response.data);
        alert(err.response.data.msg);
      } else if(err) {
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
              <div className="">
                {/* {imageLoading? (
                  <div className=" w-full h-72 md:h-96 flex justify-center items-center"> loading</div>
                ) : (
                  <img src={imageUrls[currentIndex]} alt="ad title" className="w-full h-72 md:h-96 object-cover transition-transform duration-500 ease-in-out "/>
                )} */}
                <img src={imageUrls[currentIndex]} alt="ad title" className="w-full h-72 md:h-96 object-contain transition-transform duration-500 ease-in-out "/>
              </div>
              
              <button onClick={prevSlide} className="absolute top-1/2 md:left-5 left-0 transform -translate-y-1/2 p-4 md:bg-gray-700 text-4xl md:text-lg text-primary md:text-white rounded-full md:h-11 md:w-11 flex items-center justify-center">
                <span>&#10094;</span>
              </button>
              <button onClick={nextSlide} className=" absolute top-1/2 md:right-5 right-0 transform -translate-y-1/2 p-4 md:bg-gray-700 text-4xl md:text-lg text-primary md:text-white rounded-full md:h-11 md:w-11 flex items-center justify-center">
                <span>&#10095;</span>
              </button>

              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
                  <p className="text-xl md:text-3xl font-semibold text-gray-600 pt-1">{adRate}</p>
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
              <div className="max-h-96 overflow-y-auto p-5 md:py-8">
                {/* Wrapper for all review cards */}
                <div className=" space-y-14 ">
                  {adReviews.length === 0 ? 
                    <div className=" flex flex-col justify-center items-center">
                      <img src={noReviews} alt="no reviews" className=" w-40" />
                      <p className=" text-cusGray md:-ml-8">No reviews yet...</p>
                    </div> :
                    adReviews.map((review, index) => {
                      const date = review.createdAt;
                      const formatted = new Date(date);

                      return (
                        <ReviewCard
                          name={review.user}
                          date={formatted.toLocaleDateString()}
                          review={review.review}
                          room={review.room}
                          location={review.location}
                          bathroom={review.bathroom}
                          key={index}
                        />
                      )
                    })
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

              <textarea
                name="description"
                rows="4"
                required
                placeholder="tell us what you think about this place..."
                style={{resize: "none"}}            
                className=" mt-10 p-2 w-full border border-cusGray rounded-lg"
                {...register("review", {
                  maxLength: 300,
                  pattern: /^[a-zA-Z0-9\s\.,_&@'"?!\-]+$/i,
                })}
              />
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
              <div className="flex justify-end mt-10  ">
                <button className=" btn bg-primary">Add review</button>
              </div>
              </form>
            </div>

          </div>
          
          {/* <div className=" w-full h-115 border border-cusGray rounded-lg my-20 overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder=""
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.229678747617!2d80.03966!3d6.82092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae247f82e67f285%3A0x446d8a7e211d7b77!2sNSBM%20Green%20University!5e0!3m2!1sen!2slk!4v1621357486734!5m2!1sen!2slk"
              allowFullScreen
            ></iframe>
          </div> */}
        </>
        }
      </div>
      <Footer />
    </div>
  );
};

export default Addetail;
