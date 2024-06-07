const SearchPageHero = ({ image, title}) => {
    return (
        <div className=" w-full h-64 md:h-96">
            <div className=" relative w-full h-full rounded-xl">
                <img src={image} alt={image} className="w-full h-full object-cover rounded-xl"/>
                
                {/* inset-0 add 0 for top, right, bottom, left */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                    <h2 className="text-white text-2xl md:text-4xl font-bold">{title}</h2>
                </div>
            </div>                                        
        </div>
    )
}

export default SearchPageHero;