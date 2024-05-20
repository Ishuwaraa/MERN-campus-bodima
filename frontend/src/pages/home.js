import Navbar from "../components/Navbar";
import AdDetail from "../components/AdDetail";
import card from '../assets/card.png';
import heropic from "../assets/home/heropic.png";
import sticker from "../assets/home/Designe3.png";
import sticker1 from "../assets/home/Designe2.png";
import { Search } from "lucide-react";
const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="box-border w-128 p-4 border-2 mt-28 mx-10 h-128 border-primary rounded-lg ">
        <div className=" w-1/3 absolute top-20 right-20">
          <img src={heropic} alt="hero" />
        </div>
        <div className="font-roboto text-7xl font-semibold mx-10 mt-5 text-primary leading-tight ">
          <h1>
            Your Premier <br /> Student{" "}
            <span className="text-secondary">Housing</span> <br /> Solution
          </h1>
        </div>
        <div className="box-border border-2 border-secondary w-100 h-14 mx-10 mt-20 rounded-lg relative">
          <div className="absolute top-0 right-0 mt-4 mr-5 text-secondary">
            <Search className="" />
          </div>
          <input
            type="text"
            placeholder="Search by university..."
            className="w-96 bg-transparent border-none outline-none h-11 p-3"
          />
        </div>
      </div>

      <div className="mt-72">
        <div className="mx-40 font-roboto">
            <h1 className=" text-5xl text-primary font-medium ">Find Your university</h1>
            <p className="mt-20 mx-20 text-3xl ">We’ve collected dorm reviews from over<br/>2000 Sri lankan dorms. Searh for your<br/> university to get started.</p>
        </div>
        <div className=" w-110 absolute top-120 right-36 ">
            <img src={sticker} alt="sticker"/>
        </div>
      </div>

      <div className="mt-120">
        <div className=" absolute top-115 right-56 mt-120 font-roboto">
          <h1 className="text-5xl text-primary font-medium ">Add reviews, Share with others</h1>
          <p className="mt-20 mx-20 text-3xl">Share your experience at your Bodima <br/> by writing a review. Help your friend by <br/> sharing an Ad.</p>
        </div>
        <div className="w-96 absolute top-125 left-40">
          <img src={sticker1} alt="sticker1"/>
        </div>

      </div>

        cards
      <div className=" mx-5 my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AdDetail 
            image={card} 
            title='NSBM Hostel Lodge' 
            location='76, Vihara rd, Homagama'
            price='4500'
            rating='3.5' 
        />            
      </div>


    </div>
  );
};

export default Home;
