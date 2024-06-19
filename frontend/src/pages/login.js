import { useState } from "react";
import LoginSideView from "../components/LoginSideView";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
    // const { setAuth } = useContext(AuthContext);
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    // const [isStudent, setIsStudent] = useState(true);
    const [errMessage, setErrMessage] = useState(null);
    const { register, handleSubmit, watch, formState: { errors }, getValues, setValue } = useForm();

    const email = watch('email');
    const password = watch('password');

    // const togglePx = isStudent ? '0px' : '127px';
    // const stdTxtClr = isStudent ? 'white' : 'black';
    // const landlordTxtClr = isStudent ? 'black' : 'white';
    // const accType = isStudent ? 'student' : 'landlord';

    // const stdOnClick = (e) => {
    //     e.preventDefault();
    //     setIsStudent(true);
    // };

    // const landlordOnClick = (e) => {
    //     e.preventDefault();
    //     setIsStudent(false);
    // };

    const onSubmit = async () => {
        const formData = { email, password };
        try{
            const response = await axios.post('http://localhost:4000/api/user/login', formData, { withCredentials: true });
            // console.log(response.data);
            const accessToken = response.data.accessToken;
            setAuth({ accessToken });
            setValue('email', '');
            setValue('password', '');
            setErrMessage(null);
            navigate(from, { replace: true });
        } catch (err) {
            if(err.response.status === 401) {
                setErrMessage(err.response.data.msg);
            } else if(err.response.status === 404) {
                setErrMessage(err.response.data.msg);
            } else if(err.request) {
                console.log(err.request);
            } else {
                console.log(err.message);
            }
        }
    }

    

    return(
        <div className=" grid md:grid-cols-2 mx-6 my-8">
            <LoginSideView />

            <div className=' m-10 font-poppins'>
                <div className=' flex justify-center mb-10 md:mb-14'>
                    <p className=' font-bold text-2xl text-cusGray'>Welcome Back!</p>
                </div>

                <div className=' flex justify-center'>                    
                    <form action="" onSubmit={handleSubmit(onSubmit)} className=' w-full lg:w-96'>
                        <p className=' mt-3 mb-1'>Email</p>
                        <input type="email" name='email' required className=' border border-cusGray rounded-lg w-full h-8 p-2' placeholder='cbodima@gmail.com'
                        {...register('email', { maxLength: 100})}/>
                        {errors.email && <span className=" text-red-600 text-sm">max character limit is 100</span>}

                        <p className=' mt-3 mb-1'>Password</p>
                        <input type="password" name='password' required className=' border border-cusGray rounded-lg w-full h-8 p-2' 
                        {...register('password', { maxLength: 15, minLength: 8, pattern: /^[a-zA-Z0-9@_-]+$/})}/>
                        {errors.password && errors.password.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit for password is 15</span> : 
                        errors.password && errors.password.type === 'minLength' ? <span className=' text-sm text-red-600'>password must contain atleast 8 characters</span> :
                        errors.password && <span className=' text-sm text-red-600'>password must contain only letters, numbers, @, _, and -'</span>}
                        
                        {errMessage && <p className=" mt-1 text-sm text-red-600">{errMessage}</p>}
                        <a href=""><p className=" mt-3 text-sm text-cusGray underline">Forgot your password?</p></a>
                                                
                        {/* <div className="flex justify-center mt-6">
                            <div className="relative w-64 border border-gray-500 rounded-full">
                                <div className="absolute w-32 h-full bg-gray-500 rounded-full transition-all duration-500" style={{ left: togglePx }}></div>
                                    <button onClick={(e) => stdOnClick(e)} className="relative w-1/2 py-2 bg-transparent border-0 text-center focus:outline-none">
                                        <span style={{ color: stdTxtClr }}>Student</span>
                                    </button>
                                    <button onClick={(e) => landlordOnClick(e)} className="relative w-1/2 py-2 bg-transparent border-0 text-center focus:outline-none">
                                        <span style={{ color: landlordTxtClr }}>Landlord</span>
                                    </button>
                            </div>
                        </div> */}

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