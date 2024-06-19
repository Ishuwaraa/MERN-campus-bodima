import Skeleton , { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const SkeltionAdCard = () => {
    return (
        <div className=" w-80"> 
            <SkeletonTheme baseColor='#E0E0E0' highlightColor='#F5F5F5'>
                <Skeleton className=' w-full h-48' />
                <div className="m-4">
                    <Skeleton count={2}/>
                </div>
                <div className=" grid grid-cols-2 m-4">
                    <Skeleton />
                    <div className=" flex justify-end items-center">
                        <Skeleton />
                    </div>
                </div>            
            </SkeletonTheme>
        </div>   
    )
}

export default SkeltionAdCard;