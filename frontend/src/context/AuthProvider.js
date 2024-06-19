import { createContext, useEffect, useState } from "react";
import Loading from "../components/Loading";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const savedAuth = localStorage.getItem('auth');
        return savedAuth ? JSON.parse(savedAuth) : { accessToken: null }
    })
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem('auth', JSON.stringify(auth));
    }, [auth]);

    useEffect(() => {
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
          setAuth(JSON.parse(savedAuth));
        }
        setLoading(false);
    }, []);
    
    // console.log('auth provider: auth state', auth);
    // if(loading) return <Loading />

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;