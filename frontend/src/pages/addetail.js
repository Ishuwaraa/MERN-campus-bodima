import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Detail from "../components/Detail";
import { Facebook, Share2 } from "lucide-react";
import gender from '../assets/ad/gender.png';
import Bed from "../assets/ad/bed.png";
import shower from '../assets/ad/shower.png'
import Phone from "../assets/ad/phone.png";
import addimage from "../assets/ad/adimage.jpeg";
import addimage2 from "../assets/ad/adimage2.jpg";
import addimage3 from "../assets/ad/adimage3.jpg";
import ReviewCard from "../components/ReviewCard";
import Footer from "../components/Footer";
import { useForm } from "react-hook-form";

const Addetail = () => {
  const { register, handleSubmit, watch, formState: { errors }, getValues, setValue } = useForm();
  const review = watch("review");
  const [roomRate, setRoomRate] = useState('');
  const [locationRate, setLocationRate] = useState('');
  const [bathroomRate, setBathroomRate] = useState('');

  const [roomHover, setRoomHover] = useState(null);
  const [locationHover, setLocationHover] = useState(null);
  const [bathroomHover, setBathroomHover] = useState(null);

  //ad share
  const link = encodeURI(window.location.href);
  useEffect(() => {
    const fb = document.getElementById('fb');
    const share = document.getElementById('share');

    fb && (fb.href = `https://www.facebook.com/share.php?u=${link}`);

    if(share) {
      if(navigator.share) {
        share.addEventListener('click', async (e) => {
          e.preventDefault();
          try{
            await navigator.share({
              title: 'title',
              text: 'text',
              url: window.location.href,
            });
          } catch(err) {
            console.log(err);
          }
        })
      }
    }
  })

  const images = [addimage, addimage2, addimage3];

  const [currentIndex, setcurrentIndex] = useState(0);

  const nextSlide = () => {
    setcurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setcurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToSlide = (index) => {
    setcurrentIndex(index);
  };

  const onSubmit = () => {
    console.log (review);
  }

  return (
    <div>
      <Navbar />

      <div className="page">
        <div className=" ">
          <div className=" border border-primary rounded-lg md:w-full overflow-hidden relative  ">
            <div className=" ">
              <img src={images[currentIndex]} alt="ad title" className="w-full h-72 md:h-96 object-cover transition-transform duration-500 ease-in-out "/>
            </div>
            
            <button onClick={prevSlide} className="absolute top-1/2 md:left-5 left-0 transform -translate-y-1/2 p-4 md:bg-gray-700 text-4xl md:text-lg text-primary md:text-white rounded-full md:h-11 md:w-11 flex items-center justify-center">
              <span>&#10094;</span>
            </button>
            <button onClick={nextSlide} className=" absolute top-1/2 md:right-5 right-0 transform -translate-y-1/2 p-4 md:bg-gray-700 text-4xl md:text-lg text-primary md:text-white rounded-full md:h-11 md:w-11 flex items-center justify-center">
              <span>&#10095;</span>
            </button>

            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <div key={index} className={`w-3 h-3 rounded-full ${ index === currentIndex ? "bg-gray-700" : "bg-gray-400"} cursor-pointer`}onClick={() => goToSlide(index)}/>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-10 my-10 ">
            <div className="col-span-2  md:col-span-3">
              <p className=" text-2xl md:text-4xl font-bold">NSBM Hostel Lodge</p>
              <p className="md:text-2xl text-gray-600">70, vihara Rd, Homagama</p>
              <p className="text-lg md:text-3xl font-bold text-secondary">Rs. 3500/mo</p>
            </div>

            <div className="flex flex-col space-y-5">
              <div className="flex items-center justify-end space-x-3">
                <p className="text-xl md:text-3xl font-semibold text-gray-600 pt-1">2.7</p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="md:size-10 size-6 text-primary">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex items-center justify-end space-x-3 cursor-pointer">
                <a href="#" id="fb" target="_blank" className=" border border-black p-1 rounded-lg"><Facebook className=" text-gray-700" size={20}/></a>
                <a href="#" id="share" className=" border border-black p-1 rounded-lg"><Share2 className=" text-gray-700" size={20}/></a>
              </div>
            </div>
          </div>
        </div>

        <div className=" grid grid-cols-2 md:grid-cols-4 gap-5">
          <Detail name="Female" image={gender} />

          <Detail name="3 Bedrooms" image={Bed} />

          <Detail name="2 Bathrooms" image={shower} />

          <Detail name="0112948154" image={Phone} />
        </div>

        <div className="mt-10 mb-20 md:text-xl text-lg text-justify ">
          <p>
            Lorem ipsum dolor sit amet consectetur. Tortor tincidunt netus
            egestas scelerisque dignissim. Consectetur risus interdum integer
            ullamcorper duis. Et quis amet at viverra vitae. Consectetur risus
            interdum integer ullamcorper duis. Et quis amet at viverra vitae. .
            ullamcorper duis. Et quis amet at viverra vitae. Consectetur risus
            interdum integer ullamcorper duis. Et quis amet at viverra vitae.
            ullamcorper duis. Et quis amet at viverra vitae. Consectetur risus
            interdum integer ullamcorper duis. Et quis amet at viverra vitae.
          </p>
        </div>

        <p className="mb-8 text-2xl md:text-4xl text-primary font-bold">What others say about this property</p>
        <div className=" flex flex-col md:grid md:grid-cols-2 gap-10 mt-10">
          {/* left col */}
          <div className="flex flex-col justify-center border border-primary rounded-lg">
            <div className="max-h-96 overflow-y-auto p-5 md:py-8">
              {/* Wrapper for all review cards */}
              <div className=" space-y-14 ">
                <ReviewCard
                  name="Ishuwara"
                  date="2024/05/28"
                  review="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum, aperiam."
                  room={3}
                  location={2}
                  bathroom={1}
                />
                <ReviewCard
                  name="Missaka"
                  date="2024/06/23"
                  review=" Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum, aperiam. "
                  room={1}
                  location={3}
                  bathroom={2}
                />
                <ReviewCard
                  name="Fisal"
                  date="2024/06/23"
                  review=" Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum, aperiam. "
                  room={2}
                  location={2}
                  bathroom={1}
                />
                <ReviewCard
                  name="Jana"
                  date="2024/06/23"
                  review=" Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum, aperiam. "
                  room={1}
                  location={3}
                  bathroom={1}
                />
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
        
        <div className=" w-full h-115 border border-cusGray rounded-lg my-20 overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            frameBorder=""
            style={{ border: 0 }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.229678747617!2d80.03966!3d6.82092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae247f82e67f285%3A0x446d8a7e211d7b77!2sNSBM%20Green%20University!5e0!3m2!1sen!2slk!4v1621357486734!5m2!1sen!2slk"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Addetail;
