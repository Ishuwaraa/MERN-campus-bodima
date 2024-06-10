import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import AdDetail from "../components/AdDetail";

const AllAds = () => {
    const [ads, setAds] = useState([]);
    const [errMessage, setErrMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [sort, setSort] = useState('');

    useEffect(() => {
        const fetchAds = async () => {
            try{
                const response = await axios.get('http://localhost:4000/api/ads/');
                setAds(response.data.ads);
                setImageUrls(response.data.imageUrls);
                setErrMessage(false);
            } catch(err) {
                console.log(err.message);
                setErrMessage(true);
            }
        }

        fetchAds();
    }, [])
    return (
        <div>
            <Navbar />

            <div className="page">
                {errMessage? (
                    <div className="flex justify-center">
                        <p className=" text-red-500">Error fetching ads. Try again later.</p>
                    </div>
                ) : (
                    <>
                    <div className="mb-8  flex justify-between">
                        <p className="text-2xl md:text-4xl text-primary font-bold">All Ads</p>
                        <select name="sort" onChange={(e) => {setSort(e.target.value); console.log(sort)}} className="h-8 p-1 w-20 md:w-32 border border-cusGray rounded-lg ml-3">
                            <option value="" className=" text-gray-500">Sort by</option>
                            <option value="rating" disabled>Rating</option>
                            <option value="date" disabled>Date added</option>
                        </select>
                    </div>
                    <div className="flex justify-center">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {ads.length > 0? (
                                ads.map((ad, index) => {
                                    const image = imageUrls[index % imageUrls.length];

                                    return (
                                        <a href={`/addetail?id=${ad._id}`} key={ad._id}>
                                            <AdDetail 
                                                image={image}
                                                title={ad.title} 
                                                location={ad.location}
                                                price={ad.price}
                                                rate={ad.rating}                  
                                            />
                                        </a> 
                                    )
                                })
                            ) : (
                                <div className="flex justify-center">
                                    <p className=" text-cusGray">No ads to display.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    )
}

export default AllAds;