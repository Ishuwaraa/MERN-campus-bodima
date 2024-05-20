import Navbar from "../components/Navbar";
import uni from '../assets/unis/nsbm.png';
import card from '../assets/card.png'
import SearchPageHero from "../components/SearchPageHero";
import AdDetail from "../components/AdDetail";

const Search = () => {
    return (
        <div>
            <Navbar />

            <div className=" mx-8 md:mx-10 my-8 ">
                <SearchPageHero image={uni} title='NSBM Green University' />

                <div>
                    <p className=" mt-20 mb-8 text-2xl md:text-4xl text-primary font-bold">Search results...</p>

                    <div className="flex justify-center">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <AdDetail 
                                image={card} 
                                title='NSBM Hostel Lodge' 
                                location='76, Vihara rd, Homagama'
                                price='4500'
                                rating='3.5' 
                            /> 
                            <AdDetail 
                                image={card} 
                                title='NSBM Hostel Lodge' 
                                location='76, Vihara rd, Homagama'
                                price='4500'
                                rating='3.5' 
                            /> 
                            <AdDetail 
                                image={card} 
                                title='NSBM Hostel Lodge' 
                                location='76, Vihara rd, Homagama'
                                price='4500'
                                rating='3.5' 
                            /> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search;