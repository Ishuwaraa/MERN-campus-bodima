import Navbar from "../components/Navbar";
import AdDetail from "../components/AdDetail";
import Footer from "../components/Footer";
import data from '../data/uniNames.json';
import { useEffect, useState } from "react";
import axios from "../api/axios";
import SkeltionAdCard from "../components/AdSkeltonCard";
import { useForm } from "react-hook-form";
import { errorNotify, notify } from '../toastify/notifi';

const Home = () => {
  const [uniInput, setUniInput] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [topAds, setTopAds] = useState([]);
  const [loading, setLoading] = useState(false);  

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
  const feedback = watch("feedback");
  const [rate, setRate] = useState(null);
  const [rate1Clr, setRate1Clr] = useState('white');
  const [rate2Clr, setRate2Clr] = useState('white');
  const [rate3Clr, setRate3Clr] = useState('white');

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

    if(!data.some(item => item.title === uniInput)){
      setUniInput('');
      return
    }
    
    if(uniInput !== '') window.location.href = `/search?uni=${uniInput}`
  }

  useEffect(() => {
    const fetchTopAds = async () => {
      try{
        setLoading(true);
        const response = await axios.get('/api/ads/');        

        const adsWithImages = response.data.ads.map((ad, index) => ({
          ...ad,
          imageUrl: response.data.imageUrls[index]
        }));

        const sortedAds = [...adsWithImages].sort((a, b) => b.rating - a.rating);
        setTopAds(sortedAds);
        setLoading(false);
      }catch(err) {  
        setLoading(false);      
        console.log(err.message);
      }
    }

    fetchTopAds();
  }, [])    

  const emojiClick = (rating) => {
    if(rating === 1){
      setRate(1);
      setRate1Clr('red');
      setRate2Clr('white');
      setRate3Clr('white');
    } else if(rating === 2){
      setRate(2);
      setRate1Clr('white');
      setRate2Clr('orange');
      setRate3Clr('white');
    } else {
      setRate(3);
      setRate1Clr('white');
      setRate2Clr('white');
      setRate3Clr('green');
    }
  }
  
  const onSubmit = async () => {  
    if(rate){
      try{
        await axios.post('/api/feedback/', { rate, feedback });
        notify('Thank you for your valuable feedback!');
        setValue('feedback', '');
        setRate1Clr('white');
        setRate2Clr('white');
        setRate3Clr('white');
      } catch (err) {
        if(err.response) {
          console.log(err.message);
          errorNotify(err.response?.data?.msg);
        } else {
          console.log(err.message);
        }
      }
    } else {
      errorNotify('Please add a rating');
      return
    }
  }

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
                    <svg onClick={(e) => onSearchIconClick(e)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-secondary hover:cursor-pointer">
                      <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                    </svg>
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
              <img src='https://i.postimg.cc/NjbPfqtw/heropic.png' alt="campus bodima" className="w-56 md:w-96" />
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
              <img src='https://i.postimg.cc/jn4CtPvw/Designe3.png' alt="Find your university" className=" w-40 md:w-52"/>
            </div>
          </div>

          <div className=" flex flex-col md:grid md:grid-cols-3 md:gap-5 mt-20">
            <div className="flex justify-center md:justify-start md:pl-20 mb-5 md:mb-0 order-2 md:order-1">
              <img src='https://i.postimg.cc/q6TgPjcH/Designe2.png' alt="Find your university" className=" w-32 md:w-48"/>
            </div>
            <div className="md:flex md:flex-col md:justify-center md:col-span-2 order-1 md:order-2 mb-5 md:mb-0">
              <p className="flex justify-center md:justify-start text-primary text-xl font-semibold">Add reviews, Stay anonymous</p>
              <p className="flex justify-center md:justify-start px-10 md:px-0 pl-12 mt-3">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi sunt debitis doloremque vitae quam illo repellendus reprehenderit maxime aspernatur perspiciatis.</p>
            </div>
          </div>
        </div>

        <div className=" mt-24 md:mt-32">
          <div className="mb-8 flex justify-between">
            <p className=" text-2xl md:text-4xl text-primary font-bold">Top Ads</p>
            {topAds.length > 0 && <p onClick={() => window.location.href = '/allAds'} className=" text-secondary text-lg cursor-pointer hover:underline">view all</p>}
          </div>

          <div className="flex justify-center">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {loading? (
                Array(3).fill(0).map((_, index) => (
                  <SkeltionAdCard key={index}/>
                ))
              ) : topAds.length > 0 ?(
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
                  
                ))
              ) : (
                <div className=" flex justify-center md:col-span-2 lg:col-span-3">
                  <p className=" text-cusGray text-lg">No ads to display yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=" flex flex-col md:grid md:grid-cols-2 mt-24 md:mt-32">
          <div className=" mb-5 md:mb-0" id="about-us">
            <p className=" flex justify-center md:justify-start text-2xl md:text-4xl text-primary font-bold">About Us</p>
            <p className="flex justify-center md:justify-start px-10 md:px-0 mt-3">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi sunt debitis doloremque vitae quam illo repellendus reprehenderit maxime aspernatur perspiciatis.</p>
          </div>
          <div className=" flex justify-center md:justify-end">
            <img src='https://i.postimg.cc/ZWKvY7GT/about.jpg' alt="Find your university" className=" w-60 md:w-64"/>
          </div>
        </div>

        <div className=" flex flex-col mt-24 md:mt-32">
          <p className=" flex justify-center text-2xl md:text-4xl text-primary font-bold mb-10">Give us Feedback</p>

          <div className=" flex flex-col justify-center border border-cusGray rounded-lg py-5 px-5 md:px-10">
            <div>
              <p className=" flex justify-center my-3 text-lg">How was your experience?</p>
              <div className=" flex justify-center gap-5">
                  <img onClick={() => emojiClick(1)} src='https://i.postimg.cc/67F809y3/sad-face.png' alt="sad" style={{ backgroundColor: rate1Clr}} className=" w-10 h-10 rounded-full cursor-pointer hover:shadow-lg transform hover:scale-105 transition ease-in duration-200" />
                  <img onClick={() => emojiClick(2)} src='https://i.postimg.cc/5HXHLH9T/neutral-face.png' alt="neutral" style={{ backgroundColor: rate2Clr}} className=" w-10 h-10 rounded-full cursor-pointer hover:shadow-lg transform hover:scale-105 transition ease-in duration-200" />
                  <img onClick={() => emojiClick(3)} src='https://i.postimg.cc/mPXzP347/happy-face.png' alt="happy" style={{ backgroundColor: rate3Clr}} className=" w-10 h-10 rounded-full cursor-pointer hover:shadow-lg transform hover:scale-105 transition ease-in duration-200" />                
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className=" md:px-28 lg:px-48">
              <textarea name="description" rows="4" required placeholder="Share your thoughts with us..." style={{resize: "none"}} className=" mt-10 p-2 w-full border border-cusGray rounded-lg"
              {...register("feedback", { maxLength: 300, pattern: /^[a-zA-Z0-9\s\.,_&@'"?!\-]+$/i })}/>
              {errors.feedback && errors.feedback.type === "maxLength" ? <span className=" text-sm text-red-600">max character limit is 300</span> 
              : errors.feedback && <span className=" text-sm text-red-600">feedback must contain only letters, numbers, and characters(@ & ' " _ - , . !)</span>}

              <div className=" flex justify-center mt-5">
                <button className=" btn bg-secondary">Send Feedback</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />      
    </div>
  );
};

export default Home;
