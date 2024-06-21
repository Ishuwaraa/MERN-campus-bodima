import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar"
import { Plus } from 'lucide-react'
import { useForm } from "react-hook-form";
import data from '../data/uniNames.json';
import Footer from "../components/Footer";
import Loading from '../components/Loading';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { notify, errorNotify } from "../toastify/notifi";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const PostAd = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const pageStateLocation = useLocation();

    const [uniInput, setUniInput] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    
    const [images , setImages] = useState(Array(4).fill(null)); //initializing array with 4 null elements
    const [backendImg, setBackendImg] = useState([]);
    const [gender, setGender] = useState(null);
    const [bed, setBed] = useState(null);
    const [bathroom, setBathroom] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    
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
        const file = e.target.files[0];
        console.log(file);
        if (file && !file.type.match('image.*')) {
            errorNotify('Please upload only image files (png, jpg, jpeg)');
            e.target.value = ''; // Reset the input field
            return;
        }

        const maxSizeInBytes = 5 * 1024 * 1024;
        if(file && file.size > maxSizeInBytes){
            errorNotify('Max file size is 5mb');
            e.target.value = '';
            return;
        }
            
        const newImage = [...images];
        const newBackendImage = [...backendImg];
        newImage[index] = (URL.createObjectURL(e.target.files[0]));
        newBackendImage[index] = file;
        setImages(newImage);
        setBackendImg(newBackendImage);
        // console.log(e.target.files, images, backendImg);
    }    
             
    const onSubmit = async () => {
        if (images.some(image => image === null)) {
            errorNotify('All 4 images are required');
            return;
        }

        if(lat === null || long === null) {
            errorNotify('Please add your location on the map');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('location', location);
        formData.append('uniInput', uniInput);
        formData.append('contact', contact);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('gender', gender);
        formData.append('bed', bed);
        formData.append('bathroom', bathroom);
        formData.append('lat', lat);
        formData.append('long', long);

        backendImg.forEach((image, index) => {
            formData.append('photos', image);
        });

        try {
            setLoading(true);
            const response = await axiosPrivate.post('/api/ads/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setLoading(false);
            notify("We'll send you an email once your Ad is live");
            setImages(Array(4).fill(null));
            setBackendImg([]);
            setGender(null);
            setBed(null);
            setBathroom(null);
            setValue('title', '');
            setValue('location', '');
            setValue('contact', '');
            setValue('price', '');
            setValue('description', '');
            setLat(null);
            setLong(null);
            setClickedPosition(null);
            // console.log('ad posted', response);
        } catch (err) {
            setLoading(false);
            if(err.response.status === 401) {
                //no refresh token
                console.log(err.response.data.msg);
                localStorage.removeItem('auth');
                errorNotify('Your session has expired. Please log in again to continue.')
                navigate('/login', { state: { from: pageStateLocation }, replace: true });
            }
            else if(err.response.status === 403) console.log(err.response.data.error);
            else if(err.response.status === 404) console.log(err.response.data.msg);
            else if(err.response) errorNotify(err.response.data.msg);
            else console.log(err.message);
        }
    }

    //uni name input filter
    const filterData = data.filter((item) => {
        const searchItem = uniInput.toLowerCase();
        const fullName = item.title.toLowerCase();

        return(
            //input field not empty, uni title starts with the input value, ensuring title is not exactly the search term(helps with suggesting)
            //creating a new array that pass these conditions
            searchItem && fullName.startsWith(searchItem) && searchItem !== fullName
        )
    });

    //removing uni input field data if not in the list onBlur
    const removeData = () => {
        if (!data.some(item => item.title === uniInput)) {
            setUniInput('');
        }
    }  
    
    //map variables
    const defPosition = {lat: 6.884504262718018, lng: 79.91861383804526};    
    const [clickedPosition, setClickedPosition] = useState(null);

    const handleMapClick = (event) => {
        // console.log('Map clicked', event);
        setClickedPosition(event.detail.latLng);
        const lat = event.detail.latLng.lat;
        const lng = event.detail.latLng.lng;
        setLat(lat);
        setLong(lng);
        // console.log(lat, lng);
    }

    return (
        <div>
            <Navbar />

            {loading? (
                <Loading /> 
            ) : (
                <>
                <div className="page">
                    <form action="" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                        <div className="flex justify-center">
                            <div className=" grid grid-cols-2 gap-5 md:gap-15">
                                {
                                    images.map((image, index) => (
                                        <div key={index} className="relative w-32 h-32 md:w-60 md:h-60 border border-cusGray rounded-xl bg-cusGray bg-opacity-30">
                                            {image && <img src={image} alt="" className="w-full h-full rounded-xl object-fill" />}
                                            <div className=" absolute inset-0 flex items-center justify-center">
                                                {!image && (
                                                    <>
                                                        <input
                                                            type="file"
                                                            accept=".png, .jpg, .jpeg"
                                                            // required
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
                        <span className="flex justify-center text-sm text-red-600 mt-3"> all 4 images are required to post the ad. (.png, .jpg, .jpeg)*</span>                                              
                        <span className="flex justify-center text-sm text-red-600"> image size should be less than 5mb*</span>

                        <div className=" flex flex-col justify-center mx-5 md:mx-20 lg:mx-40 mt-3 mb-10"> 
                            <div className=" lg:px-20 mb-3">
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Title <span className=" text-red-500">*</span></p>
                                <input type="text" name='title' required className=' input' placeholder='NSBM Hostel Lodge'
                                {...register('title', { maxLength: 100, pattern: /^[a-zA-z0-9\s]+$/i})}/> 
                                {errors.title && errors.title.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 100</span> : errors.title && <span className=' text-sm text-red-600'>enter only letters and numbers</span>}                
                            </div>                   
                            <div className=" lg:px-20 mb-3">
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Location <span className=" text-red-500">*</span></p>
                                <input type="text" name='location' required className=' input' placeholder='77, vihara Rd, Pitipana, Homagama'
                                {...register('location', { maxLength: 100, pattern: /^[a-zA-z0-9\s,'"\.\/]+$/i})}/>
                                {errors.location && errors.location.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 100</span> : errors.location && <span className=' text-sm text-red-600'>must contain only letters, numbers, and characters(' " , . /)</span>} 
                            </div>                                    
                            <div className=" lg:px-20 mb-3">
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Contact <span className=" text-red-500">*</span></p>
                                <input type="text" name='contact' required className=' input' placeholder='0772345123'
                                {...register('contact', { maxLength: 10, pattern: /^\d{1,10}$/ })}/>
                                {errors.contact && errors.contact.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 10</span> : errors.contact && <span className=' text-sm text-red-600'>enter only numbers from 0-9</span> }
                            </div>                   
                            <div className=" lg:px-20 mb-3">
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>University <span className=" text-red-500">*</span></p>
                                <input type="text" name="university" required className=' input' value={uniInput} placeholder="NSBM Green University"
                                    onChange={(e) => setUniInput(e.target.value)}
                                    onFocus={() => setDropdownVisible(true)}
                                    //timeout added to ensures that the click event on the dropdown items is registered before it is hidden.
                                    onBlur={() => { setTimeout(() => { removeData(); setDropdownVisible(false); }, 200); }}
                                />

                                {dropdownVisible && (
                                    <div>
                                        {
                                            //if filterd array not empty showing results otherwise showing full list
                                            filterData.length > 0 ? (
                                                <div className=" flex flex-col bg-gray-200 hover:cursor-pointer px-3 rounded-lg max-h-40 overflow-y-scroll"> {
                                                    filterData.map((item) => (
                                                        <span onMouseDown={() => { setUniInput(item.title); setDropdownVisible(false) }} key={item.title}
                                                        className="text-gray-500 hover:text-black">
                                                            {item.title}
                                                        </span>
                                                    )) 
                                                }</div>                                            
                                            ) : (
                                                <div className=" flex flex-col bg-gray-200 hover:cursor-pointer px-3 rounded-bl-lg h-40 overflow-y-scroll"> {
                                                data.map((item) => (
                                                    <span onMouseDown={() => { setUniInput(item.title); setDropdownVisible(false)}} key={item.title}
                                                    className="text-gray-500 hover:text-black">
                                                        {item.title}
                                                    </span>
                                                ))
                                                }</div>
                                            )
                                        }
                                    </div>   
                                )}

                            </div> 
                            <div className=" lg:px-20 mb-3">
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Gender <span className=" text-red-500">*</span></p>
                                <input type="radio" name="gender" id="male" required value='male' checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} className=' ml-4 mr-2 cursor-pointer'/>
                                <label htmlFor="male" className=' mr-8 text-cusGray  cursor-pointer'>male</label>

                                <input type="radio" name="gender" id="female" required value='female' checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} className=' mr-2 cursor-pointer'/>
                                <label htmlFor="female" className="text-cusGray  cursor-pointer">female</label>
                            </div>
                            <div className="grid grid-cols-2 mb-3 lg:px-20">
                                <div>
                                    <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Beds <span className=" text-red-500">*</span></p>
                                    <select name="beds" required onChange={(e) => setBed(e.target.value)} className="h-8 p-1 w-20 md:w-32 border border-cusGray rounded-lg ml-3">
                                        <option value="" className=" text-gray-500">beds</option>
                                        <option value="1 Bedroom">1</option>
                                        <option value="2 Bedrooms">2</option>
                                        <option value="3 Bedrooms">3</option>
                                        <option value="4 Bedrooms">4</option>
                                        <option value="5 Bedrooms">5</option>
                                    </select>
                                </div>
                                <div>
                                    <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Bathrooms <span className=" text-red-500">*</span></p>
                                    <select name="bathrooms" required onChange={(e) => setBathroom(e.target.value)} className="h-8 p-1 w-20 md:w-32 border border-cusGray rounded-lg ml-3">
                                        <option value="" className=" text-gray-500">bathrooms</option>
                                        <option value="1 Bathroom">1</option>
                                        <option value="2 Bathrooms">2</option>
                                        <option value="3 Bathrooms">3</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className=" lg:px-20 mb-3">
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Price (monthly) Rs. <span className=" text-red-500">*</span></p>
                                <input type="text" name='price' required className=' input' placeholder='5500'
                                {...register('price', { maxLength: 10, pattern: /^[0-9.]*$/ })}/> 
                                {errors.price && errors.price.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 10</span> : errors.price && <span className=' text-sm text-red-600'>only numbers from 0-9 and period (.) are allowed</span>}                   
                            </div>         
                            <div className=" lg:px-20 mb-3">
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Description <span className=" text-red-500">*</span></p>
                                <textarea name="description" rows='4' required className=" p-2 w-full border border-cusGray rounded-lg" placeholder="Details about the bodima" style={{resize: 'none' }}
                                {...register('description', {maxLength: 300, pattern: /^[a-zA-Z0-9\s\.,_&@'"?!\-]+$/i })}/>
                                {errors.description && errors.description.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 300</span> : errors.description && <span className=' text-sm text-red-600'>description must contain only letters, numbers, and characters(@ & ' " _ - , . ? !)</span>}                            
                            </div>         
                        </div>

                        <p className='mb-5 w-full text-secondary font-semibold text-xl '>Pin your location</p>
                        <div className=" w-full h-96 border border-cusGray rounded-lg mb-20">
                            <APIProvider apiKey={process.env.REACT_APP_MAP_KEY}>
                                <Map defaultCenter={defPosition} defaultZoom={10} mapId={'bf51a910020fa25a'} onClick={handleMapClick}>                                    
                                    {clickedPosition && <AdvancedMarker position={clickedPosition} />}
                                </Map>
                            </APIProvider>
                        </div>

                        <div className=" flex justify-between md:mx-20 lg:mx-48">
                            <button onClick={(e) => {e.preventDefault(); window.location.href = '/'}} className="text-xl font-bold px-3 py-1 rounded-lg text-center border border-primary text-primary">GO BACK</button>
                            <button className="btn bg-primary">POST AD</button>
                        </div>
                    </form>                                               
                </div>

                <Footer />
                </>
            )}
        </div>
    )
}

export default PostAd;