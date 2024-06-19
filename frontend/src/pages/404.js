import errgif from '../assets/error404.gif';

const ErrorPage = () => {    
    return (
        <div className=' flex flex-col justify-center items-center h-screen'>
            <p className=' text-cusGray text-lg'>Page not found. Let's get you back to 
                <a href="/" className=' text-primary underline ml-2'>Bodima</a>
            </p>
            <img src={errgif} alt="404 page not found" className=' h-96'/>            
        </div>
    )
}

export default ErrorPage;