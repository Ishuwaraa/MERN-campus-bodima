import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import AdDetail from "../components/AdDetail";

const AllAds = () => {
    const [ads, setAds] = useState([]);
    const [errMessage, setErrMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [imageUrls, setImageUrls] = useState([]);
    const [sortBy, setSortBy] = useState('');

    const [ratingAscSort, setRatingAscSort] = useState([]);
    const [ratingDscSort, setRatingDscSort] = useState([]);

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
        }else {
            console.log('no ads')
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
        }else {
            console.log('no ads')
        }
    }

    const dropDownOnChange = (e) => {
        setSortBy(e.target.value);
        sortByRatingAsc();
        sortByRatingDsc();
    }    

    useEffect(() => {
        const fetchAds = async () => {
            try{
                const response = await axios.get('http://localhost:4000/api/ads/');

                const adsWithImages = response.data.ads.map((ad, index) => ({
                    ...ad,
                    imageUrl: response.data.imageUrls[index]
                }));
                setAds(adsWithImages);
                // setImageUrls(response.data.imageUrls);
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
                        <select name="sort" value={sortBy} onChange={(e) => dropDownOnChange(e)} className="h-8 p-1 w-20 md:w-32 border border-cusGray rounded-lg ml-3">
                            <option value="" className=" text-gray-500">Sort by</option>
                            <option value="ratingAsc" >Rating (asc)</option>
                            <option value="ratingDsc" >Rating (dsc)</option>
                            <option value="date" >Date added</option>
                        </select>
                    </div>
                    <div className="flex justify-center">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {ads.length > 0? (
                                (sortBy === 'date' || sortBy === '')? (
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
                                ) : sortBy === 'ratingAsc'? (
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
                                ) : (
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