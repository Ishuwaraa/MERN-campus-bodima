import { useState } from "react";
import LoginSideView from "../components/LoginSideView";
import { useForm } from "react-hook-form";
import axios from '../api/axios';
import Loading from "../components/Loading";
import { notify } from "../toastify/notifi";
import { useNavigate } from "react-router-dom";

const ForgotPass = () => {
    const navigate = useNavigate();

    const [errMessage, setErrMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors }, getValues, setValue } = useForm();

    const email = watch('email');

    const onSubmit = async () => {
        try{
            setLoading(true);
            const response = await axios.post('/api/user/forgot-pass', { email });
            setLoading(false);
            setValue('email', '');
            notify('We have sent the password reset link to your email');
            setErrMessage(null);
            navigate('/login', { replace: true });
        } catch (err) {
            setLoading(false);            
            if(err.response.status === 404){
                setErrMessage(err.response.data.msg);
            }else {
                console.log(err.message);
            }
        }
    }

    return (
        <>
        {loading? (
            <Loading />
        ) : (
            <div className=" grid md:grid-cols-2 mx-6 my-8">
                <LoginSideView />
    
                <div className=' m-10 font-poppins'>
    
                    <div className=' flex flex-col justify-center items-center md:mt-14'>  
                        <p className=' font-bold text-2xl text-cusGray mb-8 md:mb-14'>Forgot your password?</p>
                        <p className=' font-semibold text-cusGray mb-10 lg:w-96 text-justify'>Please enter your email address. We'll email you a link to reset your password.</p>
                                      
                        <form action="" onSubmit={handleSubmit(onSubmit)} className=' w-full lg:w-96'>
                            <p className=' mb-1'>Email</p>
                            <input type="email" name='email' required className=' border border-cusGray rounded-lg w-full h-8 p-2' placeholder='cbodima@gmail.com'
                            {...register('email', { maxLength: 100})}/>
                            {errors.email && <span className=" text-red-600 text-sm">max character limit is 100</span>}
    
                            {errMessage && <p className=" mt-1 text-sm text-red-600">{errMessage}</p>}
                            <div className=' flex justify-center mt-8'>
                                <button className='btn bg-primary'>Reset password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default ForgotPass;