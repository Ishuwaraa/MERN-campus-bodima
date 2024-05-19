import { useState } from 'react';
import logoDark from '../assets/logo/campus_bodima_dark.png';

const Navbar = () => {
    const [burgerIcon, setBurgerIcon] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleBurgerIcon = () => {
        setBurgerIcon(!burgerIcon);
        setMenuVisible(!menuVisible);
    }    
    
    return(
        <nav className=' flex items-center justify-between border border-b-1 border-b-gray-200 font-roboto h-14'>
            <div className=' mx-10 pt-4'>
            <a href="/"><img className=' w-30 h-20' src={logoDark} alt="campus bodima" /></a>
            </div>

            <ul className=' hidden md:flex flex-grow justify-evenly mx-16 md:px-1 lg:px-28 text-cusGray'>
            <li><a href="/">Home</a></li>
            <li><a href="">Map</a></li>
            <li><a href="">Post Ad</a></li>
            <li><a href="">About Us</a></li>
            <li><a href="">Profile</a></li>
            </ul>

            <div className=' mx-10 block md:hidden' onClick={toggleBurgerIcon}>
            {
                burgerIcon ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            }                    
            </div>       

            <div className=' mx-10 hidden md:block'>
                <button className='btn bg-primary' onClick={() => window.location.href = '/login'}>Log in</button>
            </div>

            {menuVisible && (
            <div className={`absolute top-14 left-0 w-full bg-white md:hidden transition-all duration-300 ease-in-out ${menuVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <ul className='flex flex-col items-center space-y-4 py-4 text-cusGray'>
                <li><a href="/" className='block w-full text-center'>Home</a></li>
                <li><a href="" className='block w-full text-center'>Map</a></li>
                <li><a href="" className='block w-full text-center'>Post Ad</a></li>
                <li><a href="" className='block w-full text-center'>About Us</a></li>
                <li><a href="" className='block w-full text-center'>Profile</a></li>
                </ul>
                <div className=' flex justify-center'>
                    <button className='btn bg-primary' onClick={() => window.location.href = '/login'}>Log in</button>
                </div>
            </div>
            )}
        </nav>
    )
}

export default Navbar;