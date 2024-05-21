import Navbar from "../components/Navbar";
import AdDetail from "../components/AdDetail";
import card from "../assets/card.png";
import heropic from "../assets/home/heropic.png";
import sticker from "../assets/home/Designe3.png";
import sticker1 from "../assets/home/Designe2.png";
import about from "../assets/home/about.jpg";
import { Search } from "lucide-react";
import Footer from "../components/Footer";
const Home = () => {
  return (
    <div>
      <Navbar />

      <div className="box-border md:w-128 p-4 border-2 mt-28 mx-10 md:h-128 border-primary rounded-lg w-128 h-115 ">
        <div className=" md:w-1/3 md:absolute md:top-16 md:right-20 w-56 mx-10 mt-10">
          <img src={heropic} alt="hero" />
        </div>
        <div className="font-roboto md:text-7xl font-semibold md:mx-10 md:mt-5 text-primary leading-tight text-4xl mt-5 ">
          <h1 className="text-center md:text-left">
            Your Premier <br /> Student{" "}
            <span className="text-secondary">Housing</span> <br /> Solution
          </h1>
        </div>
        <div className="box-border border-2 border-secondary md:w-100 h-14 md:mx-10 md:mt-20 rounded-lg relative w-46  mx-10 mt-10">
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

      <div className="md:mt-72 mt-64 ">
        <div className="md:mx-40 font-roboto">
          <h1 className=" md:text-5xl text-primary font-medium md:text-left text-3xl text-center">
            Find Your university
          </h1>
          <p className="mt-20 mx-20 md:text-3xl md:text-left  text-lg text-center ">
            We’ve collected dorm reviews from over
            <br />
            2000 Sri lankan dorms. Searh for your
            <br /> university to get started.
          </p>
        </div>
        <div className=" md:w-96 md:absolute md:top-120 md:right-10 w-40 mx-32 mt-10 ">
          <img src={sticker} alt="sticker" />
        </div>
      </div>

      <div className="md:mt-120 ">
        <div className=" md:absolute md:top-110 md:mt-120 md:right-56 font-roboto ">
          <h1 className="md:text-5xl text-primary font-medium md:text-left text-center mt-40 text-3xl">
            Add reviews, Share with
            <br /> others
          </h1>
          <p className="mt-20 md:mx-20 md:text-3xl md:text-left text-center text-lg">
            Share your experience at your Bodima <br /> by writing a review.
            Help your friend by <br /> sharing an Ad.
          </p>
        </div>
        <div className="md:w-80 md:absolute md:top-125 md:left-0 w-40 mx-36 mt-10 ">
          <img src={sticker1} alt="sticker1" />
        </div>
      </div>

      <div className="mt-20 font-roboto md:text-5xl mx-10 font-semibold text-primary md:text-left text-center text-3xl">
        <h1>Top Ads</h1>
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
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <Footer />
    </div>
  );
};

export default Home;
