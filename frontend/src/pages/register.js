import LoginSideView from '../components/LoginSideView';

const Register = () => {
    return(
        <div className=" grid md:grid-cols-2 m-6">
            <LoginSideView />

            <div className=' m-10 font-poppins'>
                <div className=' flex justify-center mb-14'>
                    <p className=' font-bold text-2xl text-cusGray'>Let's get started</p>
                </div>
                <div className=' flex justify-center'>                    
                    <form action="" className=' w-full lg:w-96'>
                        <p className=' mb-1'>Acc Type</p>
                        <input type="radio" name="accType" id="student" className=' ml-4 mr-2'/>
                        <label htmlFor="student" className=' mr-8'>student</label>

                        <input type="radio" name="accType" id="landlord" className=' mr-2'/>
                        <label htmlFor="landlord">landlord</label>

                        <p className=' mt-3 mb-1'>Name</p>
                        <input type="text" name='name' className=' border border-cusGray rounded-lg w-full h-8 p-2' placeholder='John Doyle'/>

                        <p className=' mt-3 mb-1'>Email</p>
                        <input type="email" name='name' className=' border border-cusGray rounded-lg w-full h-8 p-2' placeholder='johndoyle@gmail.com'/>

                        <p className=' mt-3 mb-1'>Contact</p>
                        <input type="text" name='name' className=' border border-cusGray rounded-lg w-full h-8 p-2' placeholder='0712567345'/>

                        <p className=' mt-3 mb-1'>Password</p>
                        <input type="password" name='name' className=' border border-cusGray rounded-lg w-full h-8 p-2' placeholder='*******'/>
                        
                        <div className=' flex justify-center mt-10'>
                            <button className='btn bg-primary'>Create profile</button>
                        </div>
                        
                        <div className=' flex justify-center mt-1'>
                            <p>Already have an account? <a href="/login" className=' text-primary'>Log in</a></p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;