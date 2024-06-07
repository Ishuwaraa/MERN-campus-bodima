import { useEffect, useState } from "react";

const AdDetail = ({ image, title, location, price, reviews }) => {
    const [adRate, setAdRate] = useState(0);

    useEffect(() => {
        //calculating rating
        if(reviews.length !== 0) {
            const reviewRatings = reviews;
            let wholeRate = 0;

            reviewRatings.forEach((rate) => {
            const individualRate = rate.bathroom + rate.location + rate.room;
            wholeRate += individualRate;
            })
            const finalRate = wholeRate / (reviews.length * 3);
            setAdRate(finalRate.toFixed(1));
        }
    }, [reviews])

    return (
        <div className=" card"> 
            <img src={image} alt={title} className=" w-full h-48 object-cover" />
            <div className="m-4">
                <span className=" text-xl font-bold line-clamp-2 mb-2">{title}</span>
                <span className="block text-cusGray text-sm line-clamp-2">{location}</span>
            </div>
            <div className=" grid grid-cols-2 m-4">
                <div className=" text-lg font-bold">Rs. {price}/mo</div>
                <div className=" flex justify-end items-center">
                    <span className=" text-lg font-semibold mr-1">{adRate}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            
        </div>   
    )
}

export default AdDetail;