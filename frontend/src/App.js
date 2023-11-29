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
import Manga from './components/Manga';
import Chapter from './components/Chapter';
import Footer from './components/Footer'

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
        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar logout={logout} />
            <BrowserRouter>

                <Routes>
                    <Route exact path="/login" element={<LoginPage />} />
                    <Route exact path="/" element={<HomePage />} />
                    <Route exact path="/:id/profile" element={userData ? <UserPage /> : <Navigate to="/" />} />
                    <Route exact path="/uploadmanga" element={userData ? <UploadManga /> : <Navigate to="/" />} />
                    <Route exact path="/:search/results" element={<Results />} />
                    <Route exact path="/facetocomic" element={<FaceToComic />} />
                    <Route exact path="/create" element={<CreateCharacter />} />
                    <Route exact path="/:id/chapters" element={<Manga />} />
                    <Route exact path="/:id/chapters/:chapId" element={<Chapter />} />
                </Routes>

            </BrowserRouter>
            <Footer />
            <ToastContainer />
        </div>
    );
}

export default App;
