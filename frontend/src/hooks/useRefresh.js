import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/api/user/refresh', {
            withCredentials: true
        });

        setAuth((prevState) => {
            // console.log('prev auth state: ', prevState);
            // console.log('new access token: ', response.data.accessToken);
            //spreading prevState to let the other properties of the auth object staty the same and override the access token only
            return { ...prevState, accessToken: response.data.accessToken }
        });

        return response.data.accessToken;
    }

    return refresh;
}

export default useRefreshToken;