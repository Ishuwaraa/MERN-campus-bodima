const Detail = ({name , image}) => {
  return (
    <div> 
      <div className=' border border-primary flex items-center justify-center gap-2 py-2 rounded-lg '>
        <div className=''>
          <img src={image} alt={name} className=' w-6 md:w-10 h-6 md:h-10' />          
        </div>
        <div className=' '>
          <h1 className=''>{name}</h1>
        </div>
      </div> 
    </div>
  )
}

export default Detail