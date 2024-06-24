const MapCard = ({title, image, gender, bed, price, viewClick }) => {
  
  const onViewClick = () => window.location.href = `/addetail?id=${viewClick}`;

  return (
    <div className="flex flex-row md:flex-col border border-secondary rounded-lg w-80 h-44 md:h-full md:w-full mr-8 md:mr-0 mb-0 md:mb-8 ">
      <div className="">
        <img src={image} alt={title} className="h-full md:h-32 w-52 md:w-full object-cover rounded-tl-lg rounded-bl-lg md:rounded-bl-none md:rounded-tr-lg"/>
      </div>
      <div className="flex flex-col p-2">
        <p className="line-clamp-1 md:line-clamp-2 pb-1 text-lg font-bold text-gray-700">{title}</p>
        <p className="text-cusGray font-semibold">{gender} | {bed}</p>
        <p className="text-secondary font-semibold">Rs. {price} /=</p>
        <div className="flex justify-center pt-3">
          <button onClick={onViewClick} className="text-white font-semibold px-3 md:px-10 py-1 rounded-lg text-center bg-primary">
            view
          </button>
        </div>
      </div>
    </div>
  )
}

export default MapCard