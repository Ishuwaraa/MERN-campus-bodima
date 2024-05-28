import { Star } from "lucide-react";

const ReviewCard = ({name , date , review}) => {
  return (
    <div>
        {/* Repeat this block for multiple review cards */}
      <div className="">
        {/* Single review card */}
        <div className="flex justify-between">
          <p className="md:text-4xl text-2xl font-roboto font-semibold">
            {name}
          </p>
          <p className="md:text-2xl text-lg mt-2 text-gray-600">{date}</p>
        </div>
        <div className="flex flex-col border border-secondary p-5 rounded-2xl">
          <div className="w-52 mt-5">
            <div className="flex justify-between items-center text-2xl">
              <p>Room</p>
              <div className="flex">
                <Star size={20} className="text-primary hover:text-red-500 transition-colors duration-300" />
                <Star size={20} className="text-primary hover:text-red-500 transition-colors duration-300" />
                <Star size={20} className="text-primary hover:text-red-500 transition-colors duration-300" />
              </div>
            </div>
            <div className="flex justify-between items-center text-2xl mt-2">
              <p>Location</p>
              <div className="flex">
                <Star size={20} className="text-primary hover:text-red-500 transition-colors duration-300" />
                <Star size={20} className="text-primary hover:text-red-500 transition-colors duration-300" />
                <Star size={20} className="text-primary hover:text-red-500 transition-colors duration-300" />
              </div>
            </div>
            <div className="flex justify-between items-center text-2xl mt-2">
              <p>Bathrooms</p>
              <div className="flex">
                <Star size={20} className="text-primary hover:text-red-500 transition-colors duration-300" />
                <Star size={20} className="text-primary hover:text-red-500 transition-colors duration-300" />
                <Star size={20} className="text-primary hover:text-red-500 transition-colors duration-300" />
              </div>
            </div>
          </div>
          <div className="mt-10 text-2xl mb-10">
            <p>{review}
              
            </p>
          </div>
        </div>
      </div>
      {/* End of single review card */}
    </div>
  )
}

export default ReviewCard