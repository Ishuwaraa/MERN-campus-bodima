import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Detail from "../components/Detail";
import { Star } from "lucide-react";
import Female from "../assets/unis/female.png";
import Bed from "../assets/adds/bed.png";
import Toilet from "../assets/adds/bathroom.png";
import Phone from "../assets/adds/phone.png";
import addimage from "../assets/adds/addimage.jpeg";
import addimage2 from "../assets/adds/addimage2.jpg";
import addimage3 from "../assets/adds/addimage3.jpg";
import ReviewCard from "../components/ReviewCard";
import Footer from "../components/Footer";
import { useForm } from "react-hook-form";

const Addetail = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();

  const review = watch("review");

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
          <div className="grid md:grid-cols-2 md:gap-5 border border-primary rounded-lg md:w-full mt-10 overflow-hidden relative  ">
            <div className="flex col-span-8 ">
              <img
                src={images[currentIndex]}
                alt="add"
                className="w-full h-72 md:h-110 object-cover transition-transform duration-500 ease-in-out "
              />
            </div>
            <button
              onClick={prevSlide}
              className=" absolute top-1/2 md:left-5 left-0 transform -translate-y-1/2 p-4 md:bg-gray-700 md:text-white md:text-lg text-primary text-4xl rounded-full md:h-16 md:w-16 "
            >
              &#10094;
            </button>
            <button
              onClick={nextSlide}
              className=" absolute top-1/2 md:right-5 right-0 transform -translate-y-1/2 p-4 md:bg-gray-700 md:text-white md:text-lg  text-primary text-4xl rounded-full md:h-16 md:w-16  "
            >
              &#10095;
            </button>

            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentIndex ? "bg-gray-700" : "bg-gray-400"
                  } cursor-pointer`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10 md:mt-20 mt-10 ">
            <div className="col-span-2  ">
              <p className="md:text-5xl">NSBM Hostel Lodge</p>
              <p className="md:text-3xl mt-5 text-gray-600">
                70, vihara Rd, Homagama
              </p>
              <p className="md:text-5xl mt-10 text-secondary">Rs. 3500/mo</p>
            </div>
            <div className="flex justify-end  md:gap-5 gap-2">
              <p className="md:text-4xl">2.7</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="md:size-10 size-6 text-primary"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 grid-rows-2 grid-flow-col lg:grid-flow-row gap-4 lg:gap-10 lg:mt-40 mt-10 rounded-5">
          <Detail name="Female" image={Female} />

          <Detail name="3 Bedrooms" image={Bed} />

          <Detail name="2 Bathrooms" image={Toilet} />

          <Detail name="0112948154" image={Phone} />
        </div>

        <div className=" font-roboto md:text-2xl mt-20 text-lg text-justify ">
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

        <div className=" font-roboto font-semibold md:text-5xl mt-28 text-primary text-2xl">
          <p>What others say about this property</p>
        </div>

        <div className=" flex flex-col md:grid md:grid-cols-2 gap-28 mt-20">
          {/* left col */}
          <div className="flex flex-col justify-center border border-primary rounded-2xl">
            <div className="max-h-96 overflow-y-auto p-5 md:p-10">
              {/* Wrapper for all review cards */}
              <div className="space-y-20 ">
                <ReviewCard
                  name="Ishuwara"
                  date="2024/05/28"
                  review="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum, aperiam."
                />
                <ReviewCard
                  name="Missaka"
                  date="2024/06/23"
                  review=" Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum, aperiam. "
                />
                <ReviewCard
                  name="Fisal"
                  date="2024/06/23"
                  review=" Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum, aperiam. "
                />
                <ReviewCard
                  name="Jana"
                  date="2024/06/23"
                  review=" Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum, aperiam. "
                />
              </div>
            </div>
          </div>

          {/* right col */}
          <div className=" h-90 border border-primary md:p-10 p-5  rounded-2xl">
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" w-52  mt-5  ">
              <div className=" flex justify-between items-center text-2xl">
                <p>Room</p>
                <div className="flex ">
                  <Star
                    size={20}
                    className="hover:text-primary text-gray-600 transition-colors duration-300"
                  />
                  <Star
                    size={20}
                    className=" hover:text-primary text-gray-600 transition-colors duration-300"
                  />
                  <Star
                    size={20}
                    className="hover:text-primary text-gray-600 transition-colors duration-300"
                  />
                </div>
              </div>
              
              <div className=" flex justify-between items-center text-2xl">
                <p>Location</p>
                <div className="flex">
                  <Star
                    size={20}
                    className="hover:text-primary text-gray-600 transition-colors duration-300"
                  />
                  <Star
                    size={20}
                    className="hover:text-primary text-gray-600 transition-colors duration-300"
                  />
                  <Star
                    size={20}
                    className="hover:text-primary text-gray-600 transition-colors duration-300"
                  />
                </div>
                
              </div>
              <div className=" flex justify-between items-center text-2xl">
                <p>Bathrooms</p>
                <div className="flex">
                  <Star
                    size={20}
                    className="hover:text-primary text-gray-600 transition-colors duration-300"
                  />
                  <Star
                    size={20}
                    className="hover:text-primary text-gray-600 transition-colors duration-300"
                  />
                  <Star
                    size={20}
                    className="hover:text-primary text-gray-600 transition-colors duration-300"
                  />
                </div>
              </div>
            </div>

            <textarea
              name="description"
              rows="4"
              required
              className=" mt-10 p-2 w-full border border-cusGray rounded-lg"
              {...register("review", {
                maxLength: 300,
                pattern: /^[a-zA-Z0-9\s\.,_&@'"\-]+$/i,
              })}
            />
            {errors.review && errors.review.type === "maxLength" ? (
              <span className=" text-sm text-red-600">
                max character limit is 300
              </span>
            ) : (
              errors.review && (
                <span className=" text-sm text-red-600">
                  Password must contain only letters, numbers, @, _, and -'
                </span>
              )
            )}
            <div className="flex justify-end mt-10  ">
              <button className=" text-2xl btn bg-primary">add review</button>
            </div>
            </form>
          </div>

        </div>
        
        <div className=" w-full h-115 border border-cusGray rounded-lg mb-40 mt-40 overflow-hidden">
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
