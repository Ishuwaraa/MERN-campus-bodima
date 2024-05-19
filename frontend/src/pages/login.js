import { useState } from "react";
import LoginSideView from "../components/LoginSideView";

const Login = () => {
    const [accType, setAccType] = useState('student');

    const toggleAccType = (e, type) => {
        e.preventDefault();

        if(type === 'student') setAccType('student');
        else setAccType('landlord');
        console.log(accType);
    }

    return(
        <div className=" grid md:grid-cols-2 m-6">
            <LoginSideView />

            <div className=' m-10 font-poppins'>
                <div className=' flex justify-center mb-14'>
                    <p className=' font-bold text-2xl text-cusGray'>Welcome Back!</p>
                </div>
                <div className=' flex justify-center'>                    
                    <form action="" className=' w-full lg:w-96'>
                        <p className=' mt-3 mb-1'>Email</p>
                        <input type="email" name='name' className=' border border-cusGray rounded-lg w-full h-8 p-2' placeholder='johndoyle@gmail.com'/>

                        <p className=' mt-3 mb-1'>Password</p>
                        <input type="password" name='name' className=' border border-cusGray rounded-lg w-full h-8 p-2' placeholder='*******'/>
                        
                        <div className=" mt-3 border border-cusGray-2 w-fit bg-slate-500 cursor-pointer">
                            <button className=" mr-2" onClick={(e) => toggleAccType(e, 'student')}>student</button>
                            <button onClick={(e) => toggleAccType(e, 'landlord')}>landlord</button>
                        </div>

                        <div className=' flex justify-center mt-10'>
                            <button className='btn bg-primary'>Login</button>
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