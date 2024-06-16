import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/login';
import Search from './pages/search';
import PostAd from './pages/postAd';
import PostUpdate from './pages/postUpdate';
import Profile from './pages/profile';
import Addetail from './pages/addetail';
import MapPage from './pages/map';
import AllAds from './pages/allAds';
import ErrorPage from './pages/404';

import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './components/PrivateRoute';


function App() {

  return ( 
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />}/>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/search' element={<Search />} />
          <Route path='/map' element={<MapPage />} />
          <Route path='/allAds' element={<AllAds />} />
          <Route path='/addetail' element={<Addetail />} />        
                  
          <Route path='/postAd' element={<PrivateRoute element={<PostAd />} />} />
          <Route path='/postUpdate' element={<PrivateRoute element={<PostUpdate />} />} />
          <Route path='/profile' element={<PrivateRoute element={<Profile />} />} />          
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>       
    </AuthProvider>  
  );
}

export default App;
