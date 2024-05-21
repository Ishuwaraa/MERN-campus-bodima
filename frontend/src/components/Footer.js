import fimage from "../assets/footer.png";
import { Facebook } from "lucide-react";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <div>
      <div className="box-content md:w-128 p-4 border-2 -mb-96 md:h-128 bg-footerb -mx-0.5  ">
        <div className="md:w-56 md:mx-10 w-40 mx-28">
          <img src={fimage} alt="footer" />
        </div>
        <div className="md:mx-10 md:w-20 text-white cursor-pointer mx-32">
          <Facebook size={32} />
          <Instagram size={32} className="md:mx-10  md:top-10  -mt-8 mx-20" />
        </div>

        <div className="border border-b-1 hidden md:block border-ashGray md:rotate-90 md:w-64 md:mx-115 md:mt-10 "></div>

        <div className="text-ashGray md:absolute md:right-96 md:w-101 md:-mt-28 mt-10 font-roboto md:text-left text-center md:text-2xl text-lg">
          <a href="#">All Ads</a>
          <br />
          <br />
          <a href="#">About us</a>
          <br />
          <br />
          <a href="#">Help</a>
          <br />
          <br />
          <a href="#">Privacy policy</a>
        </div>

        <div className="border border-b-1 border-ashGray md:rotate-90 md:w-64 md:mx-121 md:mt-0 mt-5 "></div>

        <div className="text-ashGray  md:mx-122 md:-mt-32 md:mr-56 font-roboto text-lg mt-10 md:text-left text-center">
          <a className="text-2xl" href="#">
            Contact us
          </a>
          <br />
          <br />
          <a href="#">34, flower Rd, Colombo5, Sri Lanka</a>
          <br />
          <br />
          <a href="#">0112224448</a>
          <br />
          <br />
          <a href="#">campusbodima@gmail.com</a>
        </div>

        <div className=" text-gray-400 md:mt-24 text-center font-roboto text-base">
          <h1>© 2024 Campus Bodima. All rights reserved.</h1>
        </div>
      </div>
    </div>
  );
};

export default Footer;
