import Navbar from "../components/Navbar";
import AdDetail from "../components/AdDetail";
import card from "../assets/card.png";
import heropic from "../assets/home/heropic.png";
import sticker from "../assets/home/Designe3.png";
import sticker1 from "../assets/home/Designe2.png";
import about from "../assets/home/about.jpg";
import { Search } from "lucide-react";

const Home = () => {
  return (
    <div>
      <Navbar />

      <div className="flex justify-center mx-8 md:mx-10 my-8">
  <div className="grid md:grid-cols-2 md:gap-5 md:mx-20 md:mt-20 border border-primary rounded-lg md:w-full mt-10 px-10 py-10 ">
    <div className="flex flex-col  items-center justify-center md:items-start md:ml-10 order-1 md:order-1">
      <h1 className="font-roboto text-4xl md:text-7xl font-semibold text-primary leading-tight text-center md:text-left">
        Your Premier <br /> Student <span className="text-secondary">Housing</span> <br /> Solution
      </h1>
      <div className="box-border border-2 border-secondary mt-10 md:mt-20 rounded-lg flex items-center w-full md:w-auto px-4">
        <input
          type="text"
          placeholder="Search by university..."
          className="bg-transparent border-none outline-none h-11 flex-grow p-3"
        />
        <div className="text-secondary ml-4">
          <Search />
        </div>
      </div>
    </div>
    <div className="flex justify-center md:justify-end mb-10 md:mb-0 -order-2 md:order-1">
      <img src={heropic} alt="hero" className="w-56 md:w-96" />
    </div>
  </div>
</div>


   <div className="">
   <div className="flex justify-left md:mx-72 md:mt-40">
  <div className="flex flex-col md:flex-row items-center md:items-start">
    <div className="md:flex-1 flex flex-col items-center md:items-start">
      <h1 className="font-roboto text-3xl md:text-5xl text-primary font-medium text-center ">
        Find Your University
      </h1>
      <p className="mt-10 md:mt-20 mx-5 md:mx-0 md:text-3xl text-lg text-center md:text-left">
        We’ve collected dorm reviews from over<br />
        2000 Sri Lankan dorms. Search for your<br />
        university to get started.
      </p>
    </div>
    <div className="md:w-96 w-40 mt-10 md:mt-96 md:absolute md:top-96 md:right-40 mx-32 md:mx-20">
      <img src={sticker} alt="sticker" />
    </div>
  </div>
</div>


<div className="flex justify-center md:justify-end mt-20  md:mr-64 md:mt-72">
  <div className="flex flex-col md:flex-row items-center  md:items-start ">
    <div className="md:flex-1 flex flex-col items-center  md:items-start ">
      <h1 className="font-roboto text-3xl md:mt-28 md:text-5xl text-primary font-medium text-center md:text-left">
        Add reviews, Share with<br />others
      </h1>
      <p className="mt-10 md:mt-20 text-lg md:text-3xl text-center md:text-left">
        Share your experience at your Bodima <br /> by writing a review.
        Help your friend by <br /> sharing an Ad.
      </p>
      <div className="md:w-80 w-40 mt-10 -md:mt-96  md:absolute  -md:top-96 -md:bottom-10  md:left-96 -mx-20 md:mr-56">
      <img src={sticker1} alt="sticker1" className="" />
    </div>
    </div>
    
  </div>
</div>
 
 </div>

        <div className=" md:x-8 md:mx-20  my-8">
       <div className=" md:mt-80 mt-20 font-roboto md:text-5xl mx-10 font-semibold text-primary md:text-left text-center text-3xl">
        <h1 className="md:top-40">Top Ads</h1>
      </div>
      <div className=" md:flex">
        <div className=" md:mx-24 md:mt-20 my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-10 mx-11 mt-20">
          <AdDetail
            image={card}
            title="NSBM Hostel Lodge"
            location="76, Vihara rd, Homagama"
            price="4500"
            rating="3.5"
          />
        </div>
        <div className=" md:mx-24 md:mt-20 my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-10 mx-11 mt-20">
          <AdDetail
            image={card}
            title="NSBM Hostel Lodge"
            location="76, Vihara rd, Homagama"
            price="4500"
            rating="3.5"
          />
        </div>
        <div className=" md:mx-24 md:mt-20 my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-10 mx-11 mt-20">
          <AdDetail
            image={card}
            title="NSBM Hostel Lodge"
            location="76, Vihara rd, Homagama"
            price="4500"
            rating="3.5"
          />
        </div>
      </div>

      <div>
        <div className="mx-10 font-roboto mt-40">
          <h1 className="md:text-5xl font-semibold text-primary md:text-left text-center text-3xl ">
            About Us
          </h1>
          <p className=" text-balance mt-20 md:text-3xl md:mx-10 md:text-left text-center">
            Lorem ipsum dolor sit amet consectetur Tortor tincidunt netus <br />{" "}
            egestas scelerisque . Consectetur risus interdum integer <br />{" "}
            ullamcorper duis. Et quis amet at viverra vitae.
            <br />
            Consectetur risus interdum integer ullamcorper duis.
            <br />
            Et quis amet at viverra vitae.{" "}
          </p>
        </div>

        <div className="md:w-100 md:absolute md:top-125 md:right-10 mx-10 md:mt-125 mt-10">
          <br />
          <img src={about} alt="about" />
        </div>
        </div> 

        </div>

        

      
    </div>
  );
};

export default Home;
