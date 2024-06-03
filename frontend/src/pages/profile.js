import { useState } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { useForm } from "react-hook-form";
import AdDetail from "../components/AdDetail";
import card from '../assets/card.png'

const Profile = () => {
    const [activeForm, setActiveForm] = useState('profile');
    const [activeLink, setActiveLink] = useState('profile');
    const onActiveFormClick = (type) => {
        setActiveForm(type);
        setActiveLink(type);
    }

    //data form
    const [name, setName] = useState('ishuwara');
    const [email, setEmail] = useState('example@gmail.com');
    const [phone, setPhone] = useState('0711345234');

    const { register, handleSubmit, watch, formState: { errors }, getValues, setValue } = useForm();

    //edit form
    const editName = watch('editName');
    const editEmail = watch('editEmail');
    const editPhone = watch('editPhone');
    
    //pass form
    const currPass = watch('currPass');
    const newPass = watch('newPass');
    const conPass = watch('conPass');
    
    //delete form
    const delPass = watch('delPass');
    
    const onSubmit = (type) => {
        if(type === 'edit') {
            console.log(editName, editEmail, editPhone);
        } else if( type === 'pass') {
            console.log(currPass, newPass, conPass);
        } else if(type === 'del') {
            console.log(delPass);
        }
    }

    return(
        <div>
            <Navbar />

            <div className="page">
                <p className=" mb-8 text-2xl md:text-4xl text-primary font-bold">My Profile</p>
                <div className=" flex flex-col md:grid md:grid-cols-3 gap-10 lg:gap-20">

                    <div className=" col-span-1 border border-cusGray rounded-lg md:h-64">
                        <div className=" grid grid-cols-2 gap-5 md:gap-8 md:flex md:flex-col px-10 py-8">
                            <p onClick={() => onActiveFormClick('profile')} className={` ${activeLink === 'profile'? 'text-secondary' : 'text-cusGray'} font-semibold hover:cursor-pointer hover:underline`}>Profile</p>
                            <p onClick={() => onActiveFormClick('edit')} className={` ${activeLink === 'edit'? 'text-secondary' : 'text-cusGray'} font-semibold hover:cursor-pointer hover:underline`}>Edit Profile</p>
                            <p onClick={() => onActiveFormClick('pass')} className={` ${activeLink === 'pass'? 'text-secondary' : 'text-cusGray'} font-semibold hover:cursor-pointer hover:underline`}>Change Password</p>
                            <p onClick={() => onActiveFormClick('delete')} className={` ${activeLink === 'delete'? 'text-secondary' : 'text-cusGray'} font-semibold hover:cursor-pointer hover:underline`}>Delete Account</p>
                        </div>
                    </div>

                    <div className=" col-span-2 border border-cusGray rounded-lg">
                        <div className=" px-10 py-8">
                            {activeForm === 'profile' && 
                                <form action="" >
                                    <p className=" mb-1 w-full text-secondary font-semibold">Name</p>
                                    <input type="text" className="input" readOnly value={name}/>
                                    <p className=" mt-3 mb-1 w-full text-secondary font-semibold">Email</p>
                                    <input type="email" className="input" readOnly value={email}/>
                                    <p className=" mt-3 mb-1 w-full text-secondary font-semibold">Contact</p>
                                    <input type="text" className="input" readOnly value={phone}/>                                    
                                </form>
                            }

                            {activeForm === 'edit' &&
                                <form action="" onSubmit={handleSubmit(() => onSubmit('edit'))}>
                                    <p className=" mb-1 w-full text-secondary font-semibold">Name</p>
                                    <input type="text" className="input" required placeholder="John Doyle"
                                    {...register('editName', { maxLength: 100, pattern: /^[A-Za-z\s]+$/i })}/>
                                    {errors.editName && errors.editName.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 100</span> : errors.editName && <span className=' text-sm text-red-600'>enter only letters</span> }
                                    <p className=" mt-3 mb-1 w-full text-secondary font-semibold">Email</p>
                                    <input type="email" className="input" required placeholder="johndoyle@gmail.com"
                                    {...register('editEmail', { maxLength: 100 })}/>
                                    {errors.editEmail && <span className=' text-sm text-red-600'>max character limit is 100</span>}
                                    <p className=" mt-3 mb-1 w-full text-secondary font-semibold">Contact</p>
                                    <input type="text" className="input" required placeholder="0712567345"
                                    {...register('editPhone', { maxLength: 10, pattern: /^[0-9]/})}/>
                                    {errors.editPhone && errors.editPhone.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 10</span> : errors.editPhone && <span className=' text-sm text-red-600'>enter only numbers from 0-9</span> }

                                    <div className=" flex justify-end mt-8">
                                        <button className=" btn bg-primary"> Save changes</button>
                                    </div>
                                </form>
                            }

                            {activeForm === 'pass' &&
                                <form action="" onSubmit={handleSubmit(() => onSubmit('pass'))}>
                                    <p className=" mb-1 w-full text-secondary font-semibold">Current password</p>
                                    <input type="password" className="input" required
                                    {...register('currPass', { maxLength: 15, minLength: 8, pattern: /^[a-zA-Z0-9@_-]+$/})}/>
                                    {errors.currPass && errors.currPass.type === 'maxLength' ? <span className=' text-sm text-red-600'>incorrect password</span> : 
                                    errors.currPass && errors.currPass.type === 'minLength' ? <span className=' text-sm text-red-600'>incorrect password</span> :
                                    errors.currPass && <span className=' text-sm text-red-600'>Password must contain only letters, numbers, @, _, and -'</span>}

                                    <p className=" mt-3 mb-1 w-full text-secondary font-semibold">New password</p>
                                    <input type="password" className="input" required
                                    {...register('newPass', { maxLength: 15, minLength: 8, pattern: /^[a-zA-Z0-9@_-]+$/})}/>
                                    {errors.newPass && errors.newPass.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 15</span> : 
                                    errors.newPass && errors.newPass.type === 'minLength' ? <span className=' text-sm text-red-600'>min character limit is 8</span> :
                                    errors.newPass && <span className=' text-sm text-red-600'>Password must contain only letters, numbers, @, _, and -'</span>}

                                    <p className=" mt-3 mb-1 w-full text-secondary font-semibold">Confirm password</p>
                                    <input type="password" className="input" required
                                    {...register('conPass', { maxLength: 15, minLength: 8, pattern: /^[a-zA-Z0-9@_-]+$/})}/>
                                    {errors.conPass && errors.conPass.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 15</span> : 
                                    errors.conPass && errors.conPass.type === 'minLength' ? <span className=' text-sm text-red-600'>min character limit is 8</span> :
                                    errors.conPass && <span className=' text-sm text-red-600'>Password must contain only letters, numbers, @, _, and -'</span>}

                                    <div className=" flex justify-end mt-8">
                                        <button className=" btn bg-primary"> Update password</button>
                                    </div>
                                </form>
                            }

                            {activeForm === 'delete' &&
                                <form action="" onSubmit={handleSubmit(() => onSubmit('del'))}>
                                    <p className=" mb-1 w-full text-secondary font-semibold">Current password</p>
                                    <input type="password" className="input" required
                                    {...register('delPass', { maxLength: 15, minLength: 8, pattern: /^[a-zA-Z0-9@_-]+$/})}/>
                                    {errors.delPass && errors.delPass.type === 'maxLength' ? <span className=' text-sm text-red-600'>incorrect password</span> : 
                                    errors.delPass && errors.delPass.type === 'minLength' ? <span className=' text-sm text-red-600'>incorrect password</span> :
                                    errors.delPass && <span className=' text-sm text-red-600'>Password must contain only letters, numbers, @, _, and -'</span>}

                                    <div className=" flex justify-end mt-8">
                                        <button className=" btn bg-red-500"> Delete account</button>
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                </div>

                <p className=" mt-20 mb-8 text-2xl md:text-4xl text-primary font-bold">My Ads</p>

                <div className="flex justify-center">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AdDetail 
                            image={card} 
                            title='NSBM Hostel Lodge' 
                            location='76, Vihara rd, Homagama'
                            price='4500'
                            rating='3.5' 
                        /> 
                        <AdDetail 
                            image={card} 
                            title='NSBM Hostel Lodge' 
                            location='76, Vihara rd, Homagama'
                            price='4500'
                            rating='3.5' 
                        /> 
                        <AdDetail 
                            image={card} 
                            title='NSBM Hostel Lodge' 
                            location='76, Vihara rd, Homagama'
                            price='4500'
                            rating='3.5' 
                        /> 
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Profile;