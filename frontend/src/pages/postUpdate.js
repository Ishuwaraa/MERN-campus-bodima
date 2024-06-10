import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar"
import { Plus } from 'lucide-react'
import { useForm } from "react-hook-form";
import Footer from "../components/Footer";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import data from '../data/uniNames.json';

const PostUpdate = () => {
    const [uniInput, setUniInput] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [images , setImages] = useState(Array(4).fill(null)); //initializing array with 4 null elements
    const [backendImg, setBackendImg] = useState([]);
    const [gender, setGender] = useState(null);
    const [bed, setBed] = useState('');
    const [bathroom, setBathroom] = useState('');    

    const [loading, setLoading] = useState(false);
    const [ad, setAd] = useState([]);
    const [imageNames, setImageNames] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [errMessage, setErrMessage] = useState(null);
    const [uni, setUni] = useState('');
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);

    const { register, handleSubmit, watch, formState: { errors }, getValues, setValue } = useForm();
    const title = watch('title');
    const location = watch('location');
    const contact = watch('contact');
    const price = watch('price');
    const description = watch('description');

    // Google Maps integration
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const fileInputRefs = useRef([]);
    const handleIconClick = (index) => {
        fileInputRefs.current[index].click();   //referencing to the input field
    }

    const handleChange = (e, index) => {
        const file = e.target.files[0];
        if (file && !file.type.match('image.*')) {
            alert('Please upload only image files (png, jpg, jpeg).');
            e.target.value = ''; // Reset the input field
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

    const navigate = useNavigate();
    const searchLocation = useLocation();
    const searchParams = new URLSearchParams(searchLocation.search);
    const adId = searchParams.get('id');

    useEffect(() => {
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
            } catch(err) {
                if(err.response) {
                    setLoading(false);
                    console.log(err.response.data);
                    setErrMessage(err.response.data.msg);
                } else if(err.request) {
                    console.log(err.request);
                } else {
                    console.log(err.message);
                }
            }
        }

        fetchData();
    }, [])

    const deleteAd = async (e) => {
        e.preventDefault();

        try{
            if(window.confirm('Are you sure you want to delete this ad? ')){
                const response = await axios.delete(`http://localhost:4000/api/ads/${adId}`);
                console.log(response.data.msg, response.data.deletedAd);
                navigate('/profile');
            }
        } catch (err) {
            if(err.response) {
                console.log(err.response.data.msg);
            } else if(err.request) {
                console.log(err.request);
            } else {
                console.log(err.message);
            }
        }
    }

    const onSubmit = async () => {
        const newImages = images.filter(image => image !== null);

        // if(lat === null || long === null) {
        //     alert('Please add your location on the map');
        //     return;
        // }       

        if(newImages.length > 0 && newImages.length !== 4){
            alert('Please add 4 images');
            return;
        }else if(newImages.length === 4){
            const formData = new FormData();
            formData.append('userId', "123");
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

            //delete old images
            // console.log(formData);
            // console.log(title, location, contact, price, description, gender, bed, bathroom, newUni, newImages.length, backendImg)

            try{
                setLoading(true);
                const response = await axios.patch(`http://localhost:4000/api/ads/new/${adId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                // console.log(response.data.newAd);

                setLoading(false);
                alert('Your ad updated successfully');
                navigate('/profile');
            } catch (err) {                
                if(err.response){
                    setLoading(false);
                    alert(err.response.data.msg);
                }else if(err.request) {
                    console.log(err.request);
                }else {
                    console.log(err.message);
                }
            }
        }else {
            const newData = {
                userId: 123,
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
                setLoading(true);
                const response = await axios.patch(`http://localhost:4000/api/ads/${adId}`, newData);

                setLoading(false);
                alert('Your ad updated successfully');
                // console.log(response.data.ad);
                navigate('/profile');
            } catch (err) {       
                if(err.response){
                    setLoading(false);
                    console.log(err.response.data.msg);
                }else if(err.request) {
                    console.log(err.request);
                }else{
                    console.log('Error updating ad', err.message);
                }
            }
        }
    }

    //adding a marker on map
    useEffect(() => {
        const loadGoogleMapsScript = (callback) => {
            if (document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]')) {
                callback();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDdr0Aijr7M2pIqpX43Hsk2erMP4mYtoxc`;
            script.async = true;
            script.defer = true;
            script.onload = callback;
            script.onerror = () => {
                console.error("Error loading Google Maps script");
                alert("Error loading Google Maps. Please check your API key.");
            };
            document.body.appendChild(script);
        };

        const initMap = () => {
            if (window.google && mapRef.current) {
                const map = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 6.9271, lng: 79.8612 },
                    zoom: 10,
                });

                map.addListener('click', (e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    setLat(lat);
                    setLong(lng);
                    console.log(lat, lng);

                    if (markerRef.current) {
                        markerRef.current.setMap(null);
                    }

                    const marker = new window.google.maps.Marker({
                        position: { lat, lng },
                        map: map,
                    });

                    markerRef.current = marker;
                });
            }
        };

        loadGoogleMapsScript(initMap);

        return () => {
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }
        };
    }, []);

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
                        <span className="flex justify-center text-sm text-red-600 mt-3 text-justify">Note: To update images, all 4 images are required. <br /> If no new images added, your current images will remain unchanged.</span>  

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
                                {...register('contact', { maxLength: 10, pattern: /^[0-9]/ })}/>
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
                                {...register('price', { maxLength: 10, pattern: /^[0-9.]/})}/> 
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
                        <div className=" w-full h-110 border border-cusGray rounded-lg mb-20" ref={mapRef}></div>                 

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