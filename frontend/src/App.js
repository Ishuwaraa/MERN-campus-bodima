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


function App() {

  return (    
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />}/>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/search' element={<Search />} />
        <Route path='/postAd' element={<PostAd />} /> 
        <Route path='/postUpdate' element={<PostUpdate />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/addetail' element={<Addetail />} />
        <Route path='/map' element={<MapPage />} />
        <Route path='/allAds' element={<AllAds />} />
        
      </Routes>
    </BrowserRouter>       
  );
}

export default App;
