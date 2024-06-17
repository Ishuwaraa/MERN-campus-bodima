import { axiosPrivate } from '../api/axios';
import useRefreshToken from './useRefresh';
import useAuth from './useAuth';
import { useEffect } from 'react';

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        //interceptors
        //runs before each request
        const requestIntercept = axiosPrivate.interceptors.request.use(
            //handles configurations of outgoing requests before they are sent
            config => {
                //if the request doesnt has an authoriazation header setting it w one
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        //runs after receiving a response
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,   //letting the response pass through w/o modifying if it was a success
            async (error) => {
                const prevRequest = error?.config;  //optional chaining
                //if access token expired or invalid and prevRequest has not already been retried
                if(error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;    //preventing the interceptior from repeatedly retrying the same req in case of multiple 403 responses
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                
                return Promise.reject(error);   //if the error is not 403 or request has alr been retried
            }
        );

        return () => {
            //removing interceptors when the hook is unmounted or auth or refresh changes
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
        
    }, [auth, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;