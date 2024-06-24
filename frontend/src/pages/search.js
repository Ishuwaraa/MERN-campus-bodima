import Navbar from "../components/Navbar";
import AdDetail from "../components/AdDetail";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";
import { useEffect, useState } from "react";
import SkeltionAdCard from "../components/AdSkeltonCard";
import 'react-loading-skeleton/dist/skeleton.css'

const Search = () => {
    const [uniAds, setUniAds] = useState([]);
    const [errMessage, setErrMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const uni = searchParams.get('uni');

    const [sortBy, setSortBy] = useState('');
    const [ratingAscSort, setRatingAscSort] = useState([]);
    const [ratingDscSort, setRatingDscSort] = useState([]);
    const [dateNewSort, setDateNewSort] = useState([]);
    const [dateOldSort, setDateOldSort] = useState([]);

    const sortByRatingAsc = () => {
        if(uniAds.length !== 0){
            let arrayForSort = [...uniAds];
    
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
        if(uniAds.length !== 0){
            let arrayForSort = [...uniAds];
    
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
    const sortByDateNew = () => {
        if(uniAds.length !== 0){
            const newArray = [...uniAds].sort((a, b) => {
                const date1 = new Date(a.createdAt);
                const date2 = new Date(b.createdAt);

                return date2 - date1;
            })

            setDateNewSort(newArray);
        }
    }
    const sortByDateOld = () => {
        if(uniAds.length !== 0){
            const oldArray = [...uniAds].sort((a, b) => {
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

    //mapping uni names to images
    // const imageMap = {
    //     nsbm: nsbm,
    //     sliit: sliit,
    //     iit: iit
    // };    

    useEffect(() => {
        const fetchUniAds = async () => {
            try{
                setLoading(true);
                const response = await axios.get(`/api/ads/uni/${uni}`);
                
                //combining ads with respected images for sorting function. returns an array of objects
                const adsWithImages = response.data.ads.map((ad, index) => ({
                    ...ad,
                    imageUrl: response.data.imageUrls[index]
                }));
                setUniAds(adsWithImages);

                //getting hero image dynamically
                //getting the first item that matches the name
                // const matchedItem = uniData.find((item) => item.title === uni);
                // if(matchedItem) {
                //     setUniImage(imageMap[matchedItem.image]);
                //     setUniTitle(matchedItem.fullname);
                // }
                setLoading(false);
            }catch(err) {
                setLoading(false);
                // request was made and the server responded with a status code that falls out of the range of 2xx
                if(err.response) {
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
                loading? (
                    <div className="flex justify-center">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {Array(3).fill(0).map((_, index) => (
                                <SkeltionAdCard key={index}/>
                            ))}
                        </div>
                    </div>
                ) : 
                errMessage? (
                    <div className=" flex justify-center">
                        <p className=" text-cusGray text-lg">{errMessage}</p>
                    </div>
                ) : uniAds.length > 0? (
                    <div>
                        <div className=" mt-14 lg:mt-20 mb-10 flex justify-between">
                            <p className="text-2xl md:text-4xl text-primary font-bold">Search results...</p>
                            <select name="sort" value={sortBy} onChange={(e) => dropDownOnChange(e)} className=" p-1 border border-cusGray rounded-lg">
                                <option value="" className=" text-gray-500">Sort by</option>
                                <option value="ratingAsc" >Rating (Lowest)</option>
                                <option value="ratingDsc" >Rating (Highest)</option>
                                <option value="new" >Date added (Newest)</option>
                                <option value="old" >Date added (Oldest)</option>
                            </select>
                        </div>

                        <div className="flex justify-center">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {
                                (sortBy === 'ratingAsc')? (
                                    ratingAscSort.map((ad, index) => (
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
                                ) : (sortBy === 'ratingDsc')? (
                                    ratingDscSort.map((ad, index) => (
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
                                    uniAds.map((ad, index) => (
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
                                )
                            }
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className=" flex justify-center">
                        <p className=" text-cusGray text-lg">No ads to display</p>
                    </div>
                )}                
            </div>

            <Footer />
        </div>
    )
}

export default Search;