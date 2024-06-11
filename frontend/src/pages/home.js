import Navbar from "../components/Navbar";
import AdDetail from "../components/AdDetail";
import heropic from "../assets/home/heropic.png";
import sticker from "../assets/home/Designe3.png";
import sticker1 from "../assets/home/Designe2.png";
import about from "../assets/home/about.jpg";
import { Search } from "lucide-react";
import Footer from "../components/Footer";
import data from '../data/uniNames.json';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import card from '../assets/card.png'

const Home = () => {
  const [uniInput, setUniInput] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [topAds, setTopAds] = useState([]);
  // const [imageUrls, setImageUrls] = useState([]);

  // const fileInputRefs = useRef([]);
  // const handleIconClick = (index) => {
  //     fileInputRefs.current[index].click();   //referencing to the input field
  // };

  //uni name input filter
  const filterData = data.filter((item) => {
    const searchItem = uniInput.toLowerCase();
    const fullName = item.title.toLowerCase();

    return(
      //input field not empty, uni title starts with the input value, ensuring title is not exactly the search term(helps with suggesting)
      //creating a new array that pass these conditions
      searchItem && fullName.startsWith(searchItem) && searchItem !== fullName
    )
  });

  //removing uni input field data if not in the list onBlur
  const removeData = () => {
    //checking if any element in the array matches the uniinput
    if (!data.some(item => item.title === uniInput)) {
        setUniInput('');
    }
  }

  const onSearchIconClick = (e) => {
    e.preventDefault();
    if(uniInput !== '') window.location.href = `/search?uni=${uniInput}`
  }

  useEffect(() => {
    const fetchTopAds = async () => {
      try{
        const response = await axios.get('http://localhost:4000/api/ads/');

        const adsWithImages = response.data.ads.map((ad, index) => ({
          ...ad,
          imageUrl: response.data.imageUrls[index]
        }));

        const sortedAds = [...adsWithImages].sort((a, b) => b.rating - a.rating);
        setTopAds(sortedAds);
        // setImageUrls(response.data.imageUrls);
      }catch(err) {
        console.log(err.message);
      }
    }

    fetchTopAds();
  }, [])

  return (
    <div>
      <Navbar />

      <div className="page">

        <div className="border border-primary px-10 py-6 md:py-0 rounded-lg">
          <div className="flex flex-col md:grid md:grid-cols-2 ">
            <div className=" flex flex-col justify-center order-2 md:order-1 mb-3 md:mb-0">
              <div>
                <p className=" text-primary text-2xl md:text-4xl lg:text-6xl font-bold">Your Premier Student <br /> <span className=" text-secondary">Housing</span> Solution</p>
              </div>

              <form action="" autoComplete="off">
                {/* <div className=" mt-5 p-1 grid grid-cols-5 items-center border border-cusGray rounded-lg"> */}
                <div className="relative mt-5 p-1 grid grid-cols-5 items-center border border-cusGray rounded-lg">
                  <div className=" col-span-4 md:-mr-10 lg:-mr-16">
                    <input type="text" name="university" required className=' w-full h-8 p-2' value={uniInput} placeholder="Search ads related to your university"
                        onChange={(e) => setUniInput(e.target.value)}
                        onFocus={() => setDropdownVisible(true)}
                        //timeout added to ensures that the click event on the dropdown items is registered before it is hidden.
                        onBlur={() => { setTimeout(() => { removeData(); setDropdownVisible(false); }, 200); }}
                    />
                  </div>
                  <div className=" flex justify-center md:justify-end ml-1 md:ml-0">
                    <Search className=" text-secondary hover:cursor-pointer" onClick={(e) => onSearchIconClick(e)}/>
                  </div>

                  {dropdownVisible && (
                    <div className=" absolute top-full mt-1 w-full bg-gray-200 rounded-lg z-10">
                        {
                          //if filterd array not empty showing results otherwise showing full list
                          filterData.length > 0 ? (
                            <div className=" flex flex-col bg-gray-200 hover:cursor-pointer px-3 rounded-lg max-h-40 overflow-y-scroll"> {
                                filterData.map((item) => (
                                    <span onMouseDown={() => { setUniInput(item.title); setDropdownVisible(false) }} key={item.title}
                                    className="text-gray-500 hover:text-black">
                                        {item.title}
                                    </span>
                                )) 
                            }</div>                                            
                          ) : (
                            <div className=" flex flex-col bg-gray-200 hover:cursor-pointer px-3 rounded-bl-lg h-40 overflow-y-scroll"> {
                            data.map((item) => (
                                <span onMouseDown={() => { setUniInput(item.title); setDropdownVisible(false)}} key={item.title}
                                className="text-gray-500 hover:text-black">
                                    {item.title}
                                </span>
                            ))
                            }</div>
                          )
                        }
                    </div>   
                  )}
                </div>
              </form>

            </div>

            <div className=" flex justify-center md:justify-end order-1 md:order-2 mb-5 md:mb-0">
              <img src={heropic} alt="campus bodima" className="w-56 md:w-96" />
            </div>
          </div>
        </div>

        <div className="  md:px-20  mt-16 w-full ">
          <div className=" flex flex-col md:grid md:grid-cols-3 md:gap-5">
            <div className=" md:flex md:flex-col md:justify-center md:col-span-2 mb-5 md:mb-0">
              <p className=" flex justify-center md:justify-start text-primary text-xl font-semibold">Find Your University</p>
              <p className="flex justify-center md:justify-start px-10 md:px-0 md:pl-12 mt-3">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi sunt debitis doloremque vitae quam illo repellendus reprehenderit maxime aspernatur perspiciatis.</p>
            </div>
            <div className=" flex justify-center md:justify-end md:pl-20">
              <img src={sticker} alt="Find your university" className=" w-40 md:w-52"/>
            </div>
          </div>

          <div className=" flex flex-col md:grid md:grid-cols-3 md:gap-5 mt-20">
            <div className="flex justify-center md:justify-start md:pl-20 mb-5 md:mb-0 order-2 md:order-1">
              <img src={sticker1} alt="Find your university" className=" w-32 md:w-48"/>
            </div>
            <div className="md:flex md:flex-col md:justify-center md:col-span-2 order-1 md:order-2 mb-5 md:mb-0">
              <p className="flex justify-center md:justify-start text-primary text-xl font-semibold">Add reviews, Share with others</p>
              <p className="flex justify-center md:justify-start px-10 md:px-0 pl-12 mt-3">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi sunt debitis doloremque vitae quam illo repellendus reprehenderit maxime aspernatur perspiciatis.</p>
            </div>
          </div>
        </div>

        <div className=" mt-24">
          <div className="mb-8 flex justify-between">
            <p className=" text-2xl md:text-4xl text-primary font-bold">Top Ads</p>
            <p onClick={() => window.location.href = '/allAds'} className=" text-secondary text-lg cursor-pointer hover:underline">view all</p>
          </div>

          <div className="flex justify-center">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {topAds.length > 0?
                topAds.slice(0, 3).map((ad) => (
                    <a href={`/addetail?id=${ad._id}`} key={ad._id}>
                        <AdDetail 
                            image={ad.imageUrl} 
                            title={ad.title} 
                            location={ad.location}
                            price={ad.price}
                            rate={ad.rating}                  
                        />
                    </a> 
                )) :            
                <div className=" flex justify-center md:col-span-2 lg:col-span-3">
                  <p>No ads</p>
                </div>
              }
            </div>
          </div>
        </div>

        <div className=" flex flex-col md:grid md:grid-cols-2 mt-24">
          <div className=" mb-5 md:mb-0" id="about-us">
            <p className=" flex justify-center md:justify-start text-2xl md:text-4xl text-primary font-bold">About Us</p>
            <p className="flex justify-center md:justify-start px-10 md:px-0 mt-3">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi sunt debitis doloremque vitae quam illo repellendus reprehenderit maxime aspernatur perspiciatis.</p>
          </div>
          <div className=" flex justify-center md:justify-end">
            <img src={about} alt="Find your university" className=" w-60 md:w-64"/>
          </div>
        </div>
      </div>

      <Footer />      
    </div>
  );
};

export default Home;
