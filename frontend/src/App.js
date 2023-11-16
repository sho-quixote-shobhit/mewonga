import axios from 'axios'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import UserPage from './components/UserPage';
import UploadManga from './components/UploadManga';
import Results from './components/Results';
import FaceToComic from './components/FaceToComic';
import CreateCharacter from './components/CreateCharacter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const logout = async () => {
  await axios.get("http://localhost:5000/logout", { withCredentials: true }).then(res => {
    if (res.data === 'done') {
      window.localStorage.removeItem('userData')
    }
  })
}


function App() {

  const data = window.localStorage.getItem('userData');
  const userData = JSON.parse(data)

  return (
    <div className="App">
      <Navbar logout={logout} />
      <BrowserRouter>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path = "/" element={<HomePage />} />
          <Route path="/profile" element={userData ? <UserPage /> : <Navigate to="/" />} />
          <Route path="/uploadmanga" element={userData ? <UploadManga /> : <Navigate to="/" />} />
          <Route path="/:search/results" element={<Results />} />
          <Route path="/facetocomic" element={<FaceToComic />} />
          <Route path="/create" element={<CreateCharacter />} />
        </Routes>

      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
