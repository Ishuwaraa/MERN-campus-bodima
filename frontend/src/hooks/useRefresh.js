import axios from "axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('http://localhost:4000/api/user/refresh', {
            withCredentials: true
        });

        setAuth((prevState) => {
            console.log(prevState);
            console.log(response.data.accessToken);
            return { ...prevState, accessToken: response.data.accessToken }
        });

        return response.data.accessToken;
    }

    return refresh;
}

export default useRefreshToken;