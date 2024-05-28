import React from 'react';

const Detail = ({name , image}) => {
  return (
    <div>
        
        
            <div className='col-span-4 border border-primary md:py-10 py-5 px-2 md:px-0 flex items-center justify-center rounded-lg '>
            <div className='lg:w-20 md:w-10  w-5 mx-2 '>
                <img src={image} alt={name} className='' />
                
            </div>
            <div className='lg:text-3xl md:text-2xl text-lg text-end  '>
              <h1 className=''>{name}</h1>
              </div>
            </div>
            
            

         
        
    </div>
  )
}

export default Detail