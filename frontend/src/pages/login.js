import { useEffect, useState } from "react";
import LoginSideView from "../components/LoginSideView";

const Login = () => {
    const [isStudent, setIsStudent] = useState(true);

    const togglePx = isStudent ? '0px' : '127px';
    const stdTxtClr = isStudent ? 'white' : 'black';
    const landlordTxtClr = isStudent ? 'black' : 'white';
    const accType = isStudent ? 'student' : 'landlord';

    const stdOnClick = (e) => {
        e.preventDefault();
        setIsStudent(true);
    };

    const landlordOnClick = (e) => {
        e.preventDefault();
        setIsStudent(false);
    };

    useEffect(() => console.log(accType), [accType])

    return(
        <div className=" grid md:grid-cols-2 mx-6 my-8">
            <LoginSideView />

            <div className=' m-10 font-poppins'>
                <div className=' flex justify-center mb-10 md:mb-14'>
                    <p className=' font-bold text-2xl text-cusGray'>Welcome Back!</p>
                </div>

                <div className=' flex justify-center'>                    
                    <form action="" className=' w-full lg:w-96'>
                        <p className=' mt-3 mb-1'>Email</p>
                        <input type="email" name='name' className=' border border-cusGray rounded-lg w-full h-8 p-2' placeholder='johndoyle@gmail.com'/>

                        <p className=' mt-3 mb-1'>Password</p>
                        <input type="password" name='name' className=' border border-cusGray rounded-lg w-full h-8 p-2' placeholder='*******'/>
                                                
                        <div className="flex justify-center mt-6">
                            <div className="relative w-64 border border-gray-500 rounded-full">
                                <div className="absolute w-32 h-full bg-gray-500 rounded-full transition-all duration-500" style={{ left: togglePx }}></div>
                                    <button onClick={(e) => stdOnClick(e)} className="relative w-1/2 py-2 bg-transparent border-0 text-center focus:outline-none">
                                        <span style={{ color: stdTxtClr }}>Student</span>
                                    </button>
                                    <button onClick={(e) => landlordOnClick(e)} className="relative w-1/2 py-2 bg-transparent border-0 text-center focus:outline-none">
                                        <span style={{ color: landlordTxtClr }}>Landlord</span>
                                    </button>
                            </div>
                        </div>

                        <div className=' flex justify-center mt-8'>
                            <button className='btn bg-primary'>Log in</button>
                        </div>
                        
                        <div className=' flex justify-center mt-2'>
                            <p>New to Campus Bodima? <a href="/register" className=' text-primary'>Register</a></p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;