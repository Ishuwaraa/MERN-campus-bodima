import logoDark from '../assets/logo/campus_bodima_dark.png';

const LoginSideView = () => {
    return(
        <div className='flex justify-center m-10'>
            <div className=' grid grid-rows-2'>
                <div>
                    <a href="/"><img src={logoDark} alt="campus bodima" className=' w-52'/></a>
                </div>
                <div>
                    <p className=' font-ruthie text-3xl'>Where every student find their home away from home</p>
                </div>
            </div>                                
        </div>
    )
}

export default LoginSideView;