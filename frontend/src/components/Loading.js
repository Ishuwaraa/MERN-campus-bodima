import { BeatLoader } from 'react-spinners';

const Loading = () => {
    const loaderStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    };

    return (
        <div style={loaderStyle}>
            <BeatLoader color='#FF7A00' loading={true} size={15} />
        </div>
    )
}

export default Loading;