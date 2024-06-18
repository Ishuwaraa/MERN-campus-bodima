import { useState } from 'react';
import LoginSideView from '../components/LoginSideView';
import { useForm } from 'react-hook-form';
// import axios from "axios";
import axios from '../api/axios';
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    // const [accType, setAccType] = useState(null);
    const [errMessage, setErrMessage] = useState(null);
    const { register, handleSubmit, watch, formState: { errors }, getValues, setValue } = useForm();

    const name = watch('name');
    const email = watch('email');
    const contact = watch('contact');
    const password = watch('password');

    // const onAccChange = (e) => setAccType(e.target.value);

    const onSubmit = async () => {
        // console.log( name, email, contact, password);
        const formData = { name, email, contact, password };
        try{
            const response = await axios.post('/api/user/register', formData, { withCredentials: true });
            const accessToken = response.data.accessToken;
            setAuth({ accessToken });
            setValue('name', '');
            setValue('email', '');
            setValue('contact', '');
            setValue('password', '');
            setErrMessage(null);
            navigate('/');
        } catch (err) {
            if(err.response.status === 400) {
                setErrMessage(err.response.data.msg);
            } else {
                setErrMessage(err.response.data.msg);
            }
        }
    }

    return(
        <div className=" grid md:grid-cols-2 m-6">
            <LoginSideView />

            <div className=' m-10 font-poppins'>
                <div className=' flex justify-center mb-10'>
                    <p className=' font-bold text-2xl text-cusGray'>Let's get started</p>
                </div>
                <div className=' flex justify-center'>                    
                    <form action="" onSubmit={handleSubmit(onSubmit)} className=' w-full lg:w-96'>
                        {/* <p className=' mb-1'>Acc Type</p>
                        <input type="radio" name="accType" id="student" required value='student' checked={accType === 'student'} onChange={(e) => onAccChange(e)} className=' ml-4 mr-2'/>
                        <label htmlFor="student" className=' mr-8'>student</label>
                        <input type="radio" name="accType" id="landlord" required value='landlord' checked={accType === 'landlord'} onChange={(e) => onAccChange(e)} className=' mr-2'/>
                        <label htmlFor="landlord">landlord</label> */}

                        <p className=' mt-3 mb-1'>Name</p>
                        <input type="text" name='name' required className=' border border-cusGray rounded-lg w-full h-8 p-2' placeholder='John Doyle'
                        {...register('name', { maxLength: 100, pattern: /^[A-Za-z\s]+$/i })}/>
                        {errors.name && errors.name.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 100</span> : errors.name && <span className=' text-sm text-red-600'>enter only letters</span> }

                        <p className=' mt-3 mb-1'>Email</p>
                        <input type="email" name='name' required className=' border border-cusGray rounded-lg w-full h-8 p-2' placeholder='johndoyle@gmail.com'
                        {...register('email', { maxLength: 100 })}/>
                        {errors.email && <span className=' text-sm text-red-600'>max character limit is 100</span>}

                        <p className=' mt-3 mb-1'>Contact</p>
                        <input type="text" name='name' required className=' border border-cusGray rounded-lg w-full h-8 p-2' placeholder='0712567345'
                        {...register('contact', { maxLength: 10, pattern: /^\d{1,10}$/})}/>
                        {errors.contact && errors.contact.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 10</span> : errors.contact && <span className=' text-sm text-red-600'>enter only numbers from 0-9</span> }

                        <p className=' mt-3 mb-1'>Password</p>
                        <input type="password" name='name' required className=' border border-cusGray rounded-lg w-full h-8 p-2' 
                        {...register('password', { maxLength: 15, minLength: 8, pattern: /^[a-zA-Z0-9@_-]+$/})}/>
                        {errors.password && errors.password.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 15</span> : 
                        errors.password && errors.password.type === 'minLength' ? <span className=' text-sm text-red-600'>min character limit is 8</span> :
                        errors.password && <span className=' text-sm text-red-600'>Password must contain only letters, numbers, @, _, and -'</span>}
                        
                        {errMessage && <p className=" mt-1 text-sm text-red-600">{errMessage}</p>}
                        <div className=' flex justify-center mt-10'>
                            <button className='btn bg-primary'>Create profile</button>
                        </div>
                        
                        <div className=' flex justify-center mt-2'>
                            <p>Already have an account? <a href="/login" className=' text-primary'>Log in</a></p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;