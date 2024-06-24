const ReviewCard = ({name , date , review, room, location, bathroom}) => {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <p className="md:text-2xl text-lg font-roboto font-semibold">{name}</p>
        <p className="text-sm text-gray-600">{date}</p>
      </div>
      <div className="flex flex-col border border-secondary p-5 rounded-lg">
        <div className="w-52">
          <div className="grid grid-cols-2 items-center text-lg mt-1">
            <p className="text-gray-600">Room</p>
            <div className="flex">
              {[...Array(room)].map((_, index) => (
                <svg key={index} className="size-5 text-primary mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              ))}
              {(3 - room !== 0) && 
                [...Array(3 - room)].map((_, index) => (
                  <svg key={index} className="size-5 text-cusGray mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                ))
              }
            </div>
          </div>

          <div className="grid grid-cols-2 items-center text-lg mt-1">
            <p className="text-gray-600">Location</p>
            <div className="flex">
              {[...Array(location)].map((_, index) => (
                <svg key={index} className="size-5 text-primary mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              ))}
              {(3 - location !== 0) && 
                [...Array(3 - location)].map((_, index) => (
                  <svg key={index} className="size-5 text-cusGray mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                ))
              }
            </div>
          </div>

          <div className="grid grid-cols-2 items-center text-lg mt-1">
            <p className="text-gray-600">Bathroom</p>
            <div className="flex">
              {[...Array(bathroom)].map((_, index) => (
                <svg key={index} className="size-5 text-primary mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              ))}
              {(3 - bathroom !== 0) && 
                [...Array(3 - bathroom)].map((_, index) => (
                  <svg key={index} className="size-5 text-cusGray mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                ))
              }
            </div>
          </div>
        </div>

        <div className="mt-4 text-lg">
          <p>{review}</p>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard