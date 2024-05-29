import Navbar from "../components/Navbar";
import MapCard from "../components/MapCard";
import addimage from "../assets/ad/adimage.jpeg";
import Footer from "../components/Footer";


const map = () => {
  return (
    <div>
      <Navbar />

      <div className="page">
        <div className=" flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-10">
          <div className=" flex flex-row md:flex-col border border-red-500 rounded-lg px-5 py-8 md:px-2 min-w-64 h-56 md:h-110 md:overflow-y-scroll overflow-x-scroll md:overflow-x-hidden">
            <div className="flex flex-row md:flex-col">
              {/* card  */}              
              <MapCard
                image={addimage}
                title="NSBM Green House"
                gender="Male"
                bed="2 Beds"
                price="3500"
              />

             <MapCard
                image={addimage}
                title="NSBM Green House"
                gender="Male"
                bed="2 Beds"
                price="3500"
              />

             <MapCard
                image={addimage}
                title="NSBM Green House"
                gender="Male"
                bed="2 Beds"
                price="3500"
              />
            </div>
          </div>

          <div className=" h-110 md:col-span-2 lg:col-span-3 border border-cusGray rounded-lg">
            <iframe
              width="100%"
              height="100%"
              frameBorder=""
              className="rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.229678747617!2d80.03966!3d6.82092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae247f82e67f285%3A0x446d8a7e211d7b77!2sNSBM%20Green%20University!5e0!3m2!1sen!2slk!4v1621357486734!5m2!1sen!2slk"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default map;
