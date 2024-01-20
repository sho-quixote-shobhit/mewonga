import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/UserPage.module.css'
import FormData from 'form-data'


function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result)
        };
        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}

const UserPage = () => {
    const navigate = useNavigate();

    // user data
    const data = window.localStorage.getItem('userData');
    const userData = JSON.parse(data);

    const userId = userData._id;
    const username = userData.username;
    // const all_mangas = userData.mangas;

    const [all_mangas, setall_mangas] = useState([])

    const {id} = useParams();

    useEffect(() => {
        const fetchMangasByUser = async()=>{
            const response = await axios.post('http://localhost:5000/manga/byuser' , {id} , {withCredentials : true});
            setall_mangas(response.data)
        }
        fetchMangasByUser();
    }, [id])
    

    //modal of edit 
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);

    // edit profile new data
    const [newUsername, setnewUsername] = useState(username);
    const [newDp, setnewDp] = useState('');

    //handing new dp
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setnewDp(base64)
    }

    //handing edit save request
    const handleProfileEdit = async (e) => {
        e.preventDefault();
        if (!newUsername) {
            toast('Invalid Credentials', {
                position: "top-center",
                autoClose: 1000,
            })
            return;
        }
        setShow1(false);
        try {
            await axios.put('http://localhost:5000/profile/edit', { newUsername, newDp, userId }, { withCredentials: true }).then(res => {
                if (res.data) {
                    window.localStorage.setItem('userData', JSON.stringify(res.data));
                    toast.success('Updating your profile', {
                        position: "top-center",
                        autoClose: 2000,
                    })
                    setTimeout(() => {
                        navigate('/')
                        window.location.reload('/')
                    }, 1000);
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    //id chapternumbers and name of namga in which chapter is being added
    const [mangaId, setmangaId] = useState("");
    const [chapterNo, setchapterNo] = useState();
    const [mangaName, setmangaName] = useState("");

    // new chapter and its name
    const [chapName, setchapName] = useState("");
    const [file, setfile] = useState(null);

    //modal to add new chapter
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const handlenewchapterclink = (id, len, name) => {
        setmangaId(id);
        setchapterNo(len + 1);
        setmangaName(name);
        handleShow2();
    }

    const handleAddChapter = async (e) => {
        e.preventDefault();
        if (!chapterNo || !chapName || !file) {
            toast('Data Incomplete', {
                position: "top-center",
                autoClose: 1000,
            })
            return;
        }
        setShow2(false);
        let formData = new FormData();
        formData.append("pdf", file);
        formData.append("chapterName", chapName);
        formData.append("chapterNumber", chapterNo);
        formData.append("userId", userId)
        formData.append("mangaId", mangaId)

        await axios.post('http://localhost:5000/manga/newchapter', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }, { withCredentials: true }).then(res => {
            if (res.data.msg === 'ok') {
                toast.success('Chapter Added!!', {
                    position: "top-center",
                    autoClose: 1000,
                    closeOnClick: false
                })
                setTimeout(() => {
                    navigate('/')
                    window.location.reload('/')
                }, 1000);
            } else {
                toast("Data Incomplete !!", {
                    position: "top-center",
                    autoClose: 1500,
                })
            }
        })
    }

    //modal to add new chapter
    const [show3, setShow3] = useState(false);
    const handleClose3 = () => setShow3(false);
    const handleShow3 = () => setShow3(true);

    //Update manga
    const [newTitle, setnewTitle] = useState('');
    const [newDesc, setnewDesc] = useState('');
    const [status, setstatus] = useState('');

    const handleUpdateClick = (id, title, status, desc) => {
        setnewTitle(title);
        setmangaId(id);
        setstatus(status);
        setnewDesc(desc);
        handleShow3();
    }

    const handleUpdateManga = async (e) => {
        e.preventDefault();
        if(!newTitle || !newDesc || !status){
            toast('Data Incomplete', {
                position: "top-center",
                autoClose: 1000,
            })
            return;
        }
        setShow3(false);
        await axios.post('http://localhost:5000/manga/update' , {newTitle , newDesc , status , mangaId , userId} , {withCredentials : true}).then(res=>{
            if (res.data.msg === 'ok') {
                toast.success('Manga Updated!!!', {
                    position: "top-center",
                    autoClose: 1000,
                    closeOnClick: false
                })
                setTimeout(() => {
                    navigate('/')
                    window.location.reload('/')
                }, 1000);
            } else {
                toast("Data Incomplete !!", {
                    position: "top-center",
                    autoClose: 1500,
                })
            }
        })
    }

    const ViewManga = (mangaid)=>{
        navigate(`/${mangaid}/chapters`)
    }

    return (
        <>
            {/* modal to edit profile */}
            <Modal show={show1} onHide={handleClose1} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: "black", fontWeight: "bold" }}> Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mb-3">
                            <label style={{ color: "black", fontWeight: "bold" }} htmlFor="newusername" className="form-label">New Username</label>
                            <input type="text" className="form-control" id="" value={newUsername} onChange={(e) => setnewUsername(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label style={{ color: "black", fontWeight: "bold" }} htmlFor="newdp" className="form-label">New Profile Picture</label>
                            <input type="file" accept='.jpg , .jpeg , .png' className="form-control" onChange={(e) => handleFileUpload(e)} id="" />
                        </div>
                        <Button variant="outline-primary" type='submit' style={{ fontWeight: "bold" }} onClick={handleProfileEdit}>
                            Save
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>

            {/* modal to add new chapter */}
            <Modal show={show2} onHide={handleClose2} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: "black", fontWeight: "bold" }}>New Chapter For {mangaName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mb-3">
                            <label style={{ color: "black", fontWeight: "bold" }} htmlFor="newChapterName" className="form-label">Chapter Name</label>
                            <input type="text" className="form-control" id="" onChange={(e) => setchapName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label style={{ color: "black", fontWeight: "bold" }} htmlFor="newChapterNumber" className="form-label">Chapter Number</label>
                            <input type="text" className="form-control" id="" value={chapterNo} readOnly required />
                        </div>
                        <div className="mb-3">
                            <label style={{ color: "black", fontWeight: "bold" }} htmlFor="newChapterPdf" className="form-label">Chapter (.pdf)</label>
                            <input className="form-control" type="file" accept='.pdf' onChange={(e) => { setfile(e.target.files[0]) }} required />
                        </div>
                        <Button variant="outline-primary" type='submit' style={{ fontWeight: "bold" }} onClick={handleAddChapter}>
                            Save
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>

            {/* modal to update manga */}
            <Modal show={show3} onHide={handleClose3} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: "black", fontWeight: "bold" }}>Update {newTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mb-3">
                            <label style={{ color: "black", fontWeight: "bold" }} htmlFor="newMangaName" className="form-label">Change Manga Title</label>
                            <input type="text" className="form-control" id="" value={newTitle} onChange={(e) => setnewTitle(e.target.value)} required />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="description" style={{ color: "black" }} className="form-label fw-bold">Change Description</label>
                            <textarea className="form-control" value={newDesc} rows="5" onChange={(e) => { setnewDesc(e.target.value) }} required />
                        </div>
                        <div className="mb-2">
                            <label className="form-label fw-bold" style={{ color: "black" }} htmlFor="status">Change Status</label>
                            <select className="form-select" aria-label="Default select example" value={status} onChange={(e) => { setstatus(e.target.value) }}>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                        </div>
                        <Button variant="outline-primary" type='submit' style={{ fontWeight: "bold" }} onClick={handleUpdateManga}>
                            Save
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>

            <div className="container">
                {/* User profile */} 
                <div className="container vh-50 py-5 h-100" style={{ width: "90%" }}>
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="card col-md-4 col-xl-4 col-sm-6 col-xs-6 col-lg-4 p-0" >
                            <div className="card-body text-center">
                                <div className="mt-3 mb-4">
                                    <img src={userData.dp || `data:image/png;base64,${userData.dp}`}
                                        className="img-fluid" alt='' width="100vw" height="90vh" style={{borderRadius : "50%" , minHeight : "90px"}} />
                                </div>
                                <h2 className="my-4 fw-bold" style={{ color: "black" }}>{userData.username}</h2>
                                <h5 className="mt-4 fw-bold" style={{ color: "black" }}>Total Manga</h5>
                                <p className='mb-4 fw-bold' style={{ color: "black" }}>{userData.mangas.length}</p>

                                <div className="d-flex flex-row justify-content-center align-items-center">
                                    <Button variant='outline-dark' className='fw-bold' onClick={handleShow1}>
                                        Edit Profile
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* mangas by user */}
                <div className="container my-5">
                    <div className="row ">
                        <h2 className='text-center fw-bold'>Manga By You</h2>
                        {all_mangas.map((manga) => {
                            return (
                                    <div key={manga._id} className={`${styles.each} col-lg-4 col-md-6 col-sm-12`} >
                                        <div className="card border-0 d-flex justify-content-center align-items-center my-3 m-auto" style={{ width: "15rem", borderRadius: "20px" }}>
                                            <img src={manga.cover} className="card-img-top img-fluid " onClick={() =>{ViewManga(manga._id)}} style={{ width: "220px", height: "220px", borderRadius: "20px" , cursor : "pointer" }} alt="..." />
                                            <div className="card-body p-1">
                                                <h4 style={{ color: "black", fontWeight: "bold" }} className='p-0 text-center'  >{manga.title}</h4>
                                                <p style={{ color: "black", fontWeight: "bold" }} className='text-center p-0 m-0'>{manga.status}</p>
                                                <div className='d-flex flex-column justify-content-center align-items-center'>
                                                    <button className='btn btn-sm btn-outline-primary my-1 fw-bold' onClick={() => { handlenewchapterclink(manga._id, manga.chapters.length, manga.title) }} disabled = {manga.status === 'Ongoing' ? false : true} >New Chapter</button>
                                                    <button className='btn btn-sm btn-outline-secondary my-1 fw-bold' onClick={() => { handleUpdateClick(manga._id, manga.title, manga.status, manga.desc) }} >Edit Manga !!</button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )
                        })}
                    </div>

                </div>
                <hr style={{ borderTop: '2px dotted ' }}></hr>
            </div>
        </>
    )
}

export default UserPage
