import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "../api/axios";
import AdDetail from "../components/AdDetail";
import SkeltionAdCard from "../components/AdSkeltonCard";

const AllAds = () => {
    const [ads, setAds] = useState([]);
    const [errMessage, setErrMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('');

    const [ratingAscSort, setRatingAscSort] = useState([]);
    const [ratingDscSort, setRatingDscSort] = useState([]);
    const [dateNewSort, setDateNewSort] = useState([]);
    const [dateOldSort, setDateOldSort] = useState([]);

    const sortByRatingAsc = () => {
        if(ads.length !== 0){
            let arrayForSort = [...ads];
    
            //ascending
            const ascArray = arrayForSort.sort((a, b) => {
                const rating1 = a.rating;
                const rating2 = b.rating;
    
                return rating1 - rating2;
            })
    
            setRatingAscSort(ascArray);
        }
    }
    const sortByRatingDsc = () => {
        if(ads.length !== 0){
            let arrayForSort = [...ads];
    
            //descending
            const dscArray = arrayForSort.sort((a, b) => {
                const rating1 = a.rating;
                const rating2 = b.rating;
    
                return rating2 - rating1;
            })
    
            setRatingDscSort(dscArray);
        }
    }
    const sortByDateNew = () => {
        if(ads.length !== 0){
            const newArray = [...ads].sort((a, b) => {
                const date1 = new Date(a.createdAt);
                const date2 = new Date(b.createdAt);

                return date2 - date1;
            })

            setDateNewSort(newArray);
        }
    }
    const sortByDateOld = () => {
        if(ads.length !== 0){
            const oldArray = [...ads].sort((a, b) => {
                const date1 = new Date(a.createdAt);
                const date2 = new Date(b.createdAt);

                return date1 - date2;
            })

            setDateOldSort(oldArray);
        }
    }

    const dropDownOnChange = (e) => {
        setSortBy(e.target.value);
        sortByRatingAsc();
        sortByRatingDsc();
        sortByDateNew();
        sortByDateOld();
    }    

    useEffect(() => {
        const fetchAds = async () => {
            try{
                setLoading(true);
                const response = await axios.get('/api/ads/');

                const adsWithImages = response.data.ads.map((ad, index) => ({
                    ...ad,
                    imageUrl: response.data.imageUrls[index]
                }));
                setAds(adsWithImages);
                setLoading(false);
                setErrMessage(false);
            } catch(err) {
                setLoading(false);
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
                        {ads.length > 0 && 
                            <select name="sort" value={sortBy} onChange={(e) => dropDownOnChange(e)} className=" p-1 border border-cusGray rounded-lg">
                                <option value="" className=" text-gray-500">Sort by</option>
                                <option value="ratingAsc" >Rating (Lowest)</option>
                                <option value="ratingDsc" >Rating (Highest)</option>
                                <option value="new" >Date added (Newest)</option>
                                <option value="old" >Date added (Oldest)</option>
                            </select>                    
                        }
                    </div>
                    <div className="flex justify-center">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {loading? (
                                Array(3).fill(0).map((_, index) => (
                                    <SkeltionAdCard key={index}/>
                                ))
                            ) : 
                            ads.length > 0 ? (
                                sortBy === 'ratingAsc'? (
                                    ratingAscSort.map((ad) => (
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
                                ) : (sortBy === 'ratingDsc')? (
                                    ratingDscSort.map((ad) => (
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
                                ) : (sortBy === 'new')? (
                                    dateNewSort.map((ad, index) => (
                                        <a href={`/addetail?id=${ad._id}`} key={index}>
                                            <AdDetail 
                                                image={ad.imageUrl} 
                                                title={ad.title} 
                                                location={ad.location}
                                                price={ad.price}
                                                rate={ad.rating}                  
                                            />
                                        </a>
                                    ))
                                ) : (sortBy === 'old')? (
                                    dateOldSort.map((ad, index) => (
                                        <a href={`/addetail?id=${ad._id}`} key={index}>
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
                                    ads.map((ad) => (
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
                                )
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