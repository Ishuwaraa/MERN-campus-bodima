import { useState } from 'react';
import logoDark from '../assets/logo/campus_bodima_dark.png';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [burgerIcon, setBurgerIcon] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const { auth } = useAuth();
    const navigate = useNavigate();

    const toggleBurgerIcon = () => {
        setBurgerIcon(!burgerIcon);
        setMenuVisible(!menuVisible);
    }   
    
    const logout = async () => {
        try{
            await axios.get('http://localhost:4000/api/user/logout', { withCredentials: true });
            localStorage.removeItem('auth');
            navigate('/login');
        } catch (err) {
            if(err.response.status === 401){
                localStorage.removeItem('auth');
                navigate('/login');
            } else {
                console.log(err.message);
            }
        }
    }
    
    return(
        <nav className=' flex items-center justify-between border border-b-1 border-b-gray-200 font-roboto h-14 fixed top-0 bg-white w-full z-50'>
            <div className=' mx-10 pt-4'>
            <a href="/"><img className=' w-30 h-20' src={logoDark} alt="campus bodima" /></a>
            </div>

            <ul className=' hidden md:flex flex-grow justify-evenly mx-16 lg:px-32 text-cusGray'>
            <li><a href="/" className=' hover:text-primary'>Home</a></li>
            <li><a href="/map" className=' hover:text-primary'>Map</a></li>
            <li><a href="/postAd" className=' hover:text-primary'>Post Ad</a></li>
            <li><a href="/#about-us" className=' hover:text-primary'>About Us</a></li>
            {auth?.accessToken && <li><a href="/profile" className=' hover:text-primary'>Profile</a></li>}
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
                {auth?.accessToken ? (
                    <button className='btn bg-primary' onClick={logout}>Log out</button>
                ) : (
                    <button className='btn bg-primary' onClick={() => navigate('/login')}>Log in</button>
                )}
            </div>

            {menuVisible && (
            <div className={`absolute top-14 left-0 w-full bg-white border border-b-gray-200  pb-4 md:hidden transition-all duration-300 ease-in-out ${menuVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <ul className='flex flex-col items-center space-y-4 py-4 text-cusGray'>
                <li><a href="/" className='block w-full text-center'>Home</a></li>
                <li><a href="/map" className='block w-full text-center'>Map</a></li>
                <li><a href="/postAd" className='block w-full text-center'>Post Ad</a></li>
                <li><a href="/#about-us" className='block w-full text-center'>About Us</a></li>
                {auth?.accessToken && <li><a href="/profile" className='block w-full text-center'>Profile</a></li>}
                </ul>
                <div className=' flex justify-center'>
                    {auth?.accessToken ? (
                        <button className='btn bg-primary' onClick={logout}>Log out</button>
                    ) : (
                        <button className='btn bg-primary' onClick={() => navigate('/login')}>Log in</button>
                    )}
                </div>
            </div>
            )}
        </nav>
    )
}

export default Navbar;