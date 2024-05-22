import { useRef, useState } from "react";
import Navbar from "../components/Navbar"
import { Plus } from 'lucide-react'
import { useForm } from "react-hook-form";

const PostUpdate = () => {
    const [images , setImages] = useState(Array(4).fill(null)); //initializing array with 4 null elements
    const [gender, setGender] = useState(null);
    const [bed, setBed] = useState(null);
    const [bathroom, setBathroom] = useState(null);
    // const [imagesAdded, setImagesAdded] = useState(false);

    const { register, handleSubmit, watch, formState: { errors }, getValues, setValue } = useForm();
    const title = watch('title');
    const location = watch('location');
    const contact = watch('contact');
    const price = watch('price');
    const description = watch('description');

    const fileInputRefs = useRef([]);
    const handleIconClick = (index) => {
        fileInputRefs.current[index].click();   //referencing to the input field
    }

    const handleChange = (e, index) => {
        const newImage = [...images];
        newImage[index] = (URL.createObjectURL(e.target.files[0]));
        setImages(newImage);
        console.log(e.target.files, images);
    }    

    const onSubmit = () => {
        // if(images.length !== 4) setImagesAdded(true);
        console.log(title, location, contact, price, description, gender, bed, bathroom, images)
    }

    return (
        <div>
            <Navbar />

            <div className="mx-8 md:mx-10 my-8 font-roboto">
                
                <form action="" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    
                    <div className="flex justify-center">
                        <div className=" grid grid-cols-2 gap-5 md:gap-15">
                            {
                                images.map((image, index) => (
                                    <div key={index} className="relative w-32 h-32 md:w-60 md:h-60 border border-cusGray rounded-xl bg-cusGray bg-opacity-30">
                                        {image && <img src={image} alt="" className="w-full h-full rounded-xl" />}
                                        <div className=" absolute inset-0 flex items-center justify-center">
                                            {!image && (
                                                <>
                                                    <input
                                                        type="file"
                                                        accept=".png, .jpg, .jpeg"
                                                        required
                                                        name={`photo${index + 1}`}
                                                        ref={el => fileInputRefs.current[index] = el}
                                                        onChange={(e) => handleChange(e, index)}
                                                        className="hidden"
                                                    />
                                                    <Plus onClick={() => handleIconClick(index)} className="w-20 h-20 text-primary hover:cursor-pointer" />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            }                            
                        </div>    
                    </div>
                    <span className="flex justify-center text-sm text-red-600 mt-3">4 images are required to update the ad*</span>

                    {/* { imagesAdded && 
                        <div className="flex justify-center mt-3">
                            <p>hey</p>                    
                        </div>
                    } */}
                    

                    <div className=" flex flex-col justify-center mx-5 md:mx-20 lg:mx-40 my-10"> 
                        <div className=" lg:px-20 mb-3">
                            <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Title</p>
                            <input type="text" name='title' required className=' input' placeholder='NSBM Hostel Lodge'
                            {...register('title', { maxLength: 100, pattern: /^[a-zA-z\s]+$/i})}/> 
                            {errors.title && errors.title.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 100</span> : errors.title && <span className=' text-sm text-red-600'>enter only letters</span>}                
                        </div>                   
                        <div className=" lg:px-20 mb-3">
                            <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Location</p>
                            <input type="text" name='location' required className=' input' placeholder='77, vihara Rd, Pitipana, Homagama'
                            {...register('location', { maxLength: 100, pattern: /^[a-zA-z0-9\s,\.\/]+$/i})}/>
                            {errors.location && errors.location.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 100</span> : errors.location && <span className=' text-sm text-red-600'>enter only [a-zA-z0-9,./]</span>} 
                        </div>                   
                        <div className=" lg:px-20 mb-3">
                            <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Contact</p>
                            <input type="text" name='contact' required className=' input' placeholder='0772345123'
                            {...register('contact', { maxLength: 10, pattern: /^[0-9]/ })}/>
                            {errors.contact && errors.contact.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 10</span> : errors.contact && <span className=' text-sm text-red-600'>enter only numbers from 0-9</span> }
                        </div>                   
                        {/* <div className=" lg:px-20 mb-3">
                            <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>University</p>
                            <input type="text" name='title' required className=' input' placeholder='NSBM'
                            {...register('university', { maxLength: 100})}/>                    
                        </div>  */}
                        <div className=" lg:px-20 mb-3">
                            <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Gender</p>
                            <input type="radio" name="gender" id="male" required value='male' checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} className=' ml-4 mr-2'/>
                            <label htmlFor="male" className=' mr-8 text-cusGray '>male</label>

                            <input type="radio" name="gender" id="female" required value='female' checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} className=' mr-2'/>
                            <label htmlFor="female" className="text-cusGray ">female</label>
                        </div>
                        <div className="grid grid-cols-2 mb-3 lg:px-20">
                            <div>
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Beds</p>
                                <select name="beds" required onChange={(e) => setBed(e.target.value)} className=" w-20 md:w-32 border border-cusGray rounded-lg ml-3">
                                    <option value="" className=" text-gray-500">beds</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                            <div>
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Bathrooms</p>
                                <select name="bathrooms" required onChange={(e) => setBathroom(e.target.value)} className=" w-20 md:w-32 border border-cusGray rounded-lg ml-3">
                                    <option value="" className=" text-gray-500">bathrooms</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                        </div>
                        <div className=" lg:px-20 mb-3">
                            <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Price (monthly) Rs.</p>
                            <input type="text" name='price' required className=' input' placeholder='5500'
                            {...register('price', { maxLength: 10, pattern: /^[0-9.]/})}/> 
                            {errors.price && errors.price.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 10</span> : errors.price && <span className=' text-sm text-red-600'>enter only numbers from 0-9</span>}                   
                        </div>         
                        <div className=" lg:px-20 mb-3">
                            <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Description</p>
                            <textarea name="description" rows='4' required className=" p-2 w-full border border-cusGray rounded-lg" placeholder="Details about the bodima" 
                            {...register('description', {maxLength: 300, pattern: /^[a-zA-Z0-9\s\.,_&@'"\-]+$/i })}/>
                            {errors.description && errors.description.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 300</span> : errors.description && <span className=' text-sm text-red-600'>only allowed [a-zA-Z0-9.,-_&@'"]</span>}                            
                        </div>         
                    </div>

                    <p className='mb-5 w-full text-secondary font-semibold text-xl '>Pin your location</p>
                    <div className=" w-full h-48 border border-cusGray rounded-lg mb-20"></div>                    

                    <div className=" flex justify-between md:mx-20 lg:mx-48">
                        <button className="btn bg-red-500">DELETE AD</button>
                        <button className="btn bg-secondary">SAVE CHANGES</button>
                    </div>
                </form>
                
            </div>
        </div>
    )
}

export default PostUpdate;