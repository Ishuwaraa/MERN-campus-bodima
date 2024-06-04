import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import AdDetail from "../components/AdDetail";
import card from "../assets/card.png";
import axios from "axios";
import { useEffect, useState } from "react";

const UniAds = () => {
    const [uniAds, setUniAds] = useState([]);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const uni = searchParams.get('uni');
    console.log(uni);

    useEffect(() => {
        const fetchUniAds = async () => {
            try{
                const response = await axios.get(`http://localhost:4000/api/ads/uni/${uni}`);
                console.log(response.data);
                setUniAds(response.data);
            }catch(err) {
                // request was made and the server responded with a status code that falls out of the range of 2xx
                if(err.response) console.log(err.response.data);
                else if(err.request) console.log(err.request);  // request was made but no response was received
                else console.log(err.message);
            }
        }

        fetchUniAds();
    }, [])

    return (
        <div>
            <Navbar />

            <div className="page">
                <p className="mb-8 text-2xl md:text-4xl text-primary font-bold">Search results</p>

                <div className="flex justify-center">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {uniAds.length > 0?
                        uniAds.map((ad, index) => (
                            <a href={`/addetail?id=${ad._id}`} key={index}>
                                <AdDetail 
                                    image={card} 
                                    title={ad.title} 
                                    location={ad.location}
                                    price={ad.price}
                                    rating="3"                 
                                />
                            </a>
                        )) :
                        <div className=" md:col-span-2 lg:col-span-3 h-36 lg:h-40 ">
                            <p className=" text-cusGray text-lg">Sorry we couldn't find any ads for your search</p>
                        </div>
                    }
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default UniAds;