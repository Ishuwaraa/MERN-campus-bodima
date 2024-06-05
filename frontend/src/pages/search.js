import Navbar from "../components/Navbar";
import nsbm from '../assets/unis/nsbm.jpg';
import sliit from '../assets/unis/sliit.jpg';
import iit from '../assets/unis/iit.jpg';
import card from '../assets/card.png'
import SearchPageHero from "../components/SearchPageHero";
import AdDetail from "../components/AdDetail";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import uniData from '../data/uniNames.json';

const Search = () => {
    const [uniAds, setUniAds] = useState([]);
    const [errMessage, setErrMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uniImage, setUniImage] = useState('');
    const [uniTitle, setUniTitle] = useState('');

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const uni = searchParams.get('uni');
    console.log(uni);

    //mapping uni names to images
    const imageMap = {
        nsbm: nsbm,
        sliit: sliit,
        iit: iit
    };

    useEffect(() => {
        const fetchUniAds = async () => {
            try{
                // setLoading(true);
                const response = await axios.get(`http://localhost:4000/api/ads/uni/${uni}`);
                console.log(response.data);
                setUniAds(response.data);

                //getting hero image dynamically
                //getting the first item that matches the name
                const matchedItem = uniData.find((item) => item.title === uni);
                if(matchedItem) {
                    setUniImage(imageMap[matchedItem.image]);
                    setUniTitle(matchedItem.fullname);
                }
                // setLoading(false);
            }catch(err) {
                // request was made and the server responded with a status code that falls out of the range of 2xx
                if(err.response) {
                    setLoading(false);
                    console.log(err.response.data);
                    setErrMessage(err.response.data.msg);
                } else if(err.request) { 
                    console.log(err.request);  // request was made but no response was received
                } else console.log(err.message);
            }
        }

        fetchUniAds();
    }, [])

    return (
        <div>
            <Navbar />

            <div className="page">
                {
                // loading? (
                //     <Loading />
                // ) : 
                errMessage? (
                    <div className=" flex justify-center">
                        <p className=" text-cusGray text-lg">{errMessage}</p>
                    </div>
                ) : (
                    <>
                    <SearchPageHero image={uniImage} title={uniTitle} />

                    <div>
                        <p className=" mt-14 lg:mt-20 mb-8 text-2xl md:text-4xl text-primary font-bold">Search results...</p>

                        <div className="flex justify-center">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {uniAds.map((ad, index) => (
                                <a href={`/addetail?id=${ad._id}`} key={index}>
                                    <AdDetail 
                                        image={card} 
                                        title={ad.title} 
                                        location={ad.location}
                                        price={ad.price}
                                        rating="3"                 
                                    />
                                </a>
                            ))}
                            </div>
                        </div>
                    </div>
                    </>
                )}                
            </div>

            <Footer />
        </div>
    )
}

export default Search;