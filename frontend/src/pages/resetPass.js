import { useEffect, useState } from "react";
import LoginSideView from "../components/LoginSideView";
import { useForm } from "react-hook-form";
import axios from '../api/axios';
import { notify } from "../toastify/notifi";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";

const ResetPass = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    const [errMessage, setErrMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();

    const password = watch('password');
    const conPass = watch('conPass');

    const onSubmit = async () => {
        if(!token) navigate('/', { replace: true });

        if(password !== conPass) {
            setErrMessage("passwords don't match");
            return
        }

        try{
            setLoading(true);
            await axios.patch(`/api/user/reset-pass/${token}`, { password });
            setLoading(false);
            setErrMessage(null);
            notify('Your password has been reset successfully');
            setValue('password', '');
            setValue('conPass', '');
            navigate('/login', { replace: true });
        } catch (err) {
            setLoading(false);
            if(err.response.status === 401){
                setErrMessage(err.response.data.msg);
            }else if(err.response.status === 404){
                setErrMessage(err.response.data.msg);
            }else if(err.response.status === 500){
                console.log(err.response.data.msg);
                setErrMessage(err.response.data.msg);
            }else console.log(err.message);
        }
    }

    useEffect(() => {
        if(!token) navigate('/', { replace: true });
    }, [])


    return (
        <>
        {loading? (
            <Loading />
        ) : (
            <div className=" grid md:grid-cols-2 mx-6 my-8">
                <LoginSideView />

                <div className=' m-10 font-poppins'>

                    <div className=' flex flex-col justify-center items-center md:mt-14'>  
                        <p className=' font-bold text-2xl text-cusGray mb-8 md:mb-14'>Reset your password</p>
                                        
                        <form action="" onSubmit={handleSubmit(onSubmit)} className=' w-full lg:w-96'>
                            <p className='mb-1'>New password</p>
                            <input type="password" name='password' required className=' border border-cusGray rounded-lg w-full h-8 p-2' 
                            {...register('password', { maxLength: 15, minLength: 8, pattern: /^[a-zA-Z0-9@_-]+$/})}/>
                            {errors.password && errors.password.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit for password is 15</span> : 
                            errors.password && errors.password.type === 'minLength' ? <span className=' text-sm text-red-600'>password must contain atleast 8 characters</span> :
                            errors.password && <span className=' text-sm text-red-600'>password must contain only letters, numbers, @, _, and -'</span>}

                            <p className=' mt-3 mb-1'>Confirm password</p>
                            <input type="password" name='conPass' required className=' border border-cusGray rounded-lg w-full h-8 p-2' 
                            {...register('conPass', { maxLength: 15, minLength: 8, pattern: /^[a-zA-Z0-9@_-]+$/})}/>
                            {errors.conPass && errors.conPass.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit for password is 15</span> : 
                            errors.conPass && errors.conPass.type === 'minLength' ? <span className=' text-sm text-red-600'>password must contain atleast 8 characters</span> :
                            errors.conPass && <span className=' text-sm text-red-600'>password must contain only letters, numbers, @, _, and -'</span>}

                            {errMessage && <p className=" mt-1 text-sm text-red-600">{errMessage}</p>}
                            <div className=' flex justify-center mt-8'>
                                <button className='btn bg-primary'>Reset Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

export default ResetPass;