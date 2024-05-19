import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />}/>
      </Routes>
    </BrowserRouter>
    // <div>
    //   <p className='text-4xl underline text-red-300'>Home</p>
    //   <p className='text-xl font-bold text-red-700'>p tag</p>
    // </div>
  );
}

export default App;
