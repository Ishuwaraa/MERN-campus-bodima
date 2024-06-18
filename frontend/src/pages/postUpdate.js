import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar"
import { Plus } from 'lucide-react'
import { useForm } from "react-hook-form";
import Footer from "../components/Footer";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import data from '../data/uniNames.json';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { notify, errorNotify, deleteNotify } from "../toastify/notifi";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const PostUpdate = () => {
    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();
    const pageStateLocation = useLocation();
    const searchParams = new URLSearchParams(pageStateLocation.search);
    const adId = searchParams.get('id');

    //form input
    const [uniInput, setUniInput] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [images , setImages] = useState(Array(4).fill(null)); //initializing array with 4 null elements
    const [backendImg, setBackendImg] = useState([]);
    const [gender, setGender] = useState(null);
    const [bed, setBed] = useState('');
    const [bathroom, setBathroom] = useState('');    

    //storing fetched data
    const [loading, setLoading] = useState(false);
    const [imageNames, setImageNames] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [errMessage, setErrMessage] = useState(null);
    const [uni, setUni] = useState('');
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [oldLat, setOldLat] = useState(null);
    const [oldLng, setOldLng] = useState(null);

    //use form inputs
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
        if (file && !file.type.match('image.*')) {
            // alert('Please upload only image files (png, jpg, jpeg).');
            errorNotify('Please upload only image files (png, jpg, jpeg).')
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
    // const defPosition = {lat: 6.884504262718018, lng: 79.91861383804526};
    const oldPosition = (oldLat === null || oldLng === null) ? {lat: 6.884504262718018, lng: 79.91861383804526} : {lat: oldLat, lng: oldLng};
    // const [oldMarker, setOldMarkr] = useState({ lat: null, lng: null});
    const [clickedPosition, setClickedPosition] = useState(null);

    const handleMapClick = (event) => {
        console.log('Map clicked', event);
        setClickedPosition(event.detail.latLng);
        const lat = event.detail.latLng.lat;
        const lng = event.detail.latLng.lng;
        setLat(lat);
        setLong(lng);
        console.log(lat, lng);
    }

    const fetchData = async () => {
        try{
            if(adId === '') return navigate('/');

            // setLoading(true);
            const response = await axios.get(`http://localhost:4000/api/ads/${adId}`);
            setImageUrls(response.data.imageUrls);
            setImageNames(response.data.ad.images);
            // setLoading(false);
            setErrMessage(null);
            setValue('title', response.data.ad.title || '');
            setValue('location', response.data.ad.location || '');
            setValue('contact', response.data.ad.contact || '');
            setValue('price', response.data.ad.price || '');
            setValue('description', response.data.ad.description || '');
            setUni(response.data.ad.university || '');
            setGender(response.data.ad.gender || '');
            setBed(response.data.ad.bed || '');
            setBathroom(response.data.ad.bathroom || '');
            setLat(response.data.ad.latitude || '');
            setLong(response.data.ad.longitude || '');
            // setOldMarkr({lat: response.data.ad.latitude, lng: response.data.ad.longitude});
            setOldLat(response.data.ad.latitude || '');
            setOldLng(response.data.ad.longitude || '');
        } catch(err) {
            if(err.response) {
                // setLoading(false);
                console.log(err.response.data);
                setErrMessage(err.response.data.msg);
            } else if(err.request) {
                console.log(err.request);
            } else {
                console.log(err.message);
            }
        }
    }
    useEffect(() => {
        const checkUserId = async () => {
            try{
                await axiosPrivate.post('/api/user/check-id', { adId });
                fetchData();
            } catch (err) {
                if(err.response.status === 401){
                    console.log(err.response.data.msg);
                    localStorage.removeItem('auth');
                    errorNotify('Your session has expired. Please log in again to continue.')
                    navigate('/login', { state: { from: pageStateLocation }, replace: true });
                }else if(err.response.status === 403){
                    console.log(err.response.data.msg);
                    navigate('/');
                }else console.log(err.message);
            }
        }

        checkUserId();        
    }, [])
    
    const deleteAd = async (e) => {
        e.preventDefault();

        try{
            if(window.confirm('Are you sure you want to delete this ad? ')){
                const response = await axiosPrivate.delete(`/api/ads/${adId}`);
                console.log(response.data.msg);
                navigate('/profile');
                deleteNotify('Ad deleted successfully!');
            }
        } catch (err) {
            if(err.response.status === 401){
                console.log(err.response.data.msg);
                localStorage.removeItem('auth');
                errorNotify('Your session has expired. Please log in again to continue.')
                navigate('/login', { state: { from: pageStateLocation }, replace: true });
            } else if(err.response.status === 403) {
                console.log(err.response.data.msg);
            } else if (err.response.status === 404) {
                console.log(err.response.data.msg);
            } else console.log(err.message);
        }
    }
    
    const onSubmit = async () => {
        const newImages = images.filter(image => image !== null);            

        if(newImages.length > 0 && newImages.length !== 4){
            errorNotify('All 4 images are required');
            return;
        }else if(newImages.length === 4){
            const formData = new FormData();
            formData.append('title', title);
            formData.append('location', location);
            formData.append('uniInput', (uniInput === '')? uni : uniInput);
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

            try{
                setLoading(true);
                const response = await axiosPrivate.patch(`/api/ads/new/${adId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                // console.log(response.data.newAd);

                setLoading(false);
                setImages(Array(4).fill(null));
                setClickedPosition(null);
                notify('Ad updated successfully!');
                fetchData();
                // navigate('/profile');
            } catch (err) {                
                if(err.response.status === 401){
                    console.log(err.response.data.msg);
                    localStorage.removeItem('auth');
                    errorNotify('Your session has expired. Please log in again to continue.')
                    navigate('/login', { state: { from: pageStateLocation }, replace: true });
                } else if(err.response.status === 403) {
                    console.log(err.response.data.msg);
                } else if (err.response.status === 404) {
                    console.log(err.response.data.msg);
                } else console.log(err.message);
            }
        }else {
            const newData = {
                title, 
                location, 
                uniInput: (uniInput === '')? uni : uniInput,
                contact, 
                price, 
                description,
                gender,
                bed, 
                bathroom,
                lat, 
                long            
            }    

            try{
                // setLoading(true);
                const response = await axiosPrivate.patch(`/api/ads/${adId}`, newData);

                // setLoading(false);
                setClickedPosition(null);
                // alert('Your ad updated successfully');
                fetchData();
                notify('Ad updated successfully!');
            } catch (err) {       
                if(err.response.status === 401){
                    console.log(err.response.data.msg);
                    localStorage.removeItem('auth');
                    errorNotify('Your session has expired. Please log in again to continue.')
                    navigate('/login', { state: { from: pageStateLocation }, replace: true });
                } else if(err.response.status === 403) {
                    console.log(err.response.data.msg);
                } else if (err.response.status === 404) {
                    console.log(err.response.data.msg);
                } else console.log(err.message);
            }
        }
    }    

    return (
        <div>
            <Navbar />

            <div className="page">

                {loading? (
                    <Loading />
                ) : (
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
                        <span className="flex justify-center text-sm text-red-600 mt-3"> image size should be less than 5mb*</span>
                        <span className="flex justify-center text-sm text-red-600 text-justify">Note: To update images, all 4 images are required. If no new images added, your current images will remain unchanged.</span>  

                        <div className="mx-5 md:mx-20 lg:mx-40 lg:px-20 mt-10 mb-3">
                            <p className=' w-full text-secondary font-semibold text-xl '>Current images</p>
                        </div>
                        <div className=" flex justify-center ">
                            <div className=" grid grid-cols-2 md:grid-cols-4 gap-5 mt-2">
                                {imageUrls.length > 0 && 
                                    imageUrls.map((image, index) => (
                                        <div key={index} className=" w-24 h-24 md:w-32 md:h-32 border border-cusGray">
                                            <img src={image} alt={title} className=" w-24 h-24 md:w-32 md:h-32 object-fill" />
                                        </div>
                                    ))
                                }
                            </div>                  
                        </div>
                        

                        <div className=" flex flex-col justify-center mx-5 md:mx-20 lg:mx-40 my-10"> 
                            <div className=" lg:px-20 mb-3">
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Title</p>
                                <input type="text" name='title' required value={title} className=' input' placeholder='NSBM Hostel Lodge'
                                {...register('title', { maxLength: 100, pattern: /^[a-zA-z0-9\s]+$/i})}/> 
                                {errors.title && errors.title.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 100</span> : errors.title && <span className=' text-sm text-red-600'>enter only letters and numbers</span>}                
                            </div>                   
                            <div className=" lg:px-20 mb-3">
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Location</p>
                                <input type="text" name='location' required value={location} className=' input' placeholder='77, vihara Rd, Pitipana, Homagama'
                                {...register('location', { maxLength: 100, pattern: /^[a-zA-z0-9\s,'"\.\/]+$/i})}/>
                                {errors.location && errors.location.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 100</span> : errors.location && <span className=' text-sm text-red-600'>must contain only letters, numbers, and characters(' " , . /)</span>} 
                            </div>                   
                            <div className=" lg:px-20 mb-3">
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Contact</p>
                                <input type="text" name='contact' required value={contact} className=' input' placeholder='0772345123'
                                {...register('contact', { maxLength: 10, pattern: /^\d{1,10}$/ })}/>
                                {errors.contact && errors.contact.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 10</span> : errors.contact && <span className=' text-sm text-red-600'>enter only numbers from 0-9</span> }
                            </div>                   
                            <div className=" lg:px-20 mb-3">
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>University <span className=" text-red-500">*</span></p>
                                <input type="text" name="university" required className=' input' value={(uniInput === '')? uni : uniInput} placeholder="NSBM Green University"
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
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Gender</p>
                                <input type="radio" name="gender" id="male" required value='male' checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} className=' ml-4 mr-2 cursor-pointer'/>
                                <label htmlFor="male" className=' mr-8 text-cusGray  cursor-pointer'>male</label>

                                <input type="radio" name="gender" id="female" required value='female' checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} className=' mr-2 cursor-pointer'/>
                                <label htmlFor="female" className="text-cusGray  cursor-pointer">female</label>
                            </div>
                            <div className="grid grid-cols-2 mb-3 lg:px-20">
                                <div>
                                    <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Beds</p>
                                    <select name="beds" required value={bed} onChange={(e) => setBed(e.target.value)} className="h-8 p-1 w-20 md:w-32 border border-cusGray rounded-lg ml-3">
                                        <option value="" className=" text-gray-500">beds</option>
                                        <option value="1 Bedroom">1</option>
                                        <option value="2 Bedrooms">2</option>
                                        <option value="3 Bedrooms">3</option>
                                        <option value="4 Bedrooms">4</option>
                                        <option value="5 Bedrooms">5</option>
                                    </select>
                                </div>
                                <div>
                                    <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Bathrooms</p>
                                    <select name="bathrooms" required value={bathroom} onChange={(e) => setBathroom(e.target.value)} className="h-8 p-1 w-20 md:w-32 border border-cusGray rounded-lg ml-3">
                                        <option value="" className=" text-gray-500">bathrooms</option>
                                        <option value="1 Bathroom">1</option>
                                        <option value="2 Bathrooms">2</option>
                                        <option value="3 Bathrooms">3</option>
                                    </select>
                                </div>
                            </div>
                            <div className=" lg:px-20 mb-3">
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Price (monthly) Rs.</p>
                                <input type="text" name='price' required value={price} className=' input' placeholder='5500'
                                {...register('price', { maxLength: 10, pattern: /^[0-9.]*$/ })}/> 
                                {errors.price && errors.price.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 10</span> : errors.price && <span className=' text-sm text-red-600'>only numbers from 0-9 and period (.) are allowed</span>}                   
                            </div>         
                            <div className=" lg:px-20 mb-3">
                                <p className=' mt-3 mb-1 w-full text-secondary font-semibold text-xl'>Description</p>
                                <textarea name="description" rows='4' required value={description} className=" p-2 w-full border border-cusGray rounded-lg" placeholder="Details about the bodima" 
                                {...register('description', {maxLength: 300, pattern: /^[a-zA-Z0-9\s\.,_&@'"?!\-]+$/i })}/>
                                {errors.description && errors.description.type === 'maxLength' ? <span className=' text-sm text-red-600'>max character limit is 300</span> : errors.description && <span className=' text-sm text-red-600'>description must contain only letters, numbers, and characters(@ & ' " _ - , . ? !)</span>}                            
                            </div>         
                        </div>

                        <p className='mb-5 w-full text-secondary font-semibold text-xl '>Pin your new location</p>
                        <span className="flex justify-center text-sm text-red-600 mt-3 text-justify">Note: If no new pin added your current location will remain unchanged.</span> 
                        <div className=" w-full h-96 border border-cusGray rounded-lg mb-20">
                            <APIProvider apiKey={process.env.REACT_APP_MAP_KEY}>
                                <Map defaultCenter={oldPosition} defaultZoom={10} mapId={'bf51a910020fa25a'} onClick={handleMapClick}>   
                                    <AdvancedMarker position={oldPosition} title='Current Location'/>                                 
                                    {clickedPosition && <AdvancedMarker position={clickedPosition} title='New Location'/>}                                    
                                </Map>
                            </APIProvider>
                        </div>

                        <div className=" flex justify-between md:mx-20 lg:mx-48">
                            <button onClick={(e) => deleteAd(e)} className="btn bg-red-500">DELETE AD</button>
                            <button className="btn bg-secondary">SAVE CHANGES</button>
                        </div>
                    </form>
                )}
                
                
            </div>

            <Footer />
        </div>
    )
}

export default PostUpdate;