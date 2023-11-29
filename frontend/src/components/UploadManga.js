import React, { useState } from 'react'
import axios from 'axios';
import FormData from 'form-data'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const UploadManga = () => {

    const userData = JSON.parse(window.localStorage.getItem('userData'))

    const navigate = useNavigate()

    const [title, settitle] = useState("");
    const [desc, setdesc] = useState("");
    const [cover, setcover] = useState("");
    const [status, setstatus] = useState("");
    const [genres, setgenres] = useState([]);
    const [chapName, setchapName] = useState("");
    const chapNumber = 1;
    const [file, setfile] = useState(null);
    const userId = userData._id;

    const onsubmit = async (e) => {
        e.preventDefault();
        console.log(status)
        let formData = new FormData();
        formData.append("pdf", file)
        formData.append("title", title)
        formData.append("desc", desc)
        formData.append("cover", cover)
        formData.append("genres", genres)
        formData.append("chapName", chapName)
        formData.append("chapNumber", chapNumber)
        formData.append("status", status)
        formData.append("userId", userId)


        await axios.post('http://localhost:5000/manga/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }, { withcreadentials: true }).then(res => {
            if (res.data.msg === 'ok') {
                toast.success('Manga Uploaded', {
                    position: "top-center",
                    autoClose: 1000,
                    closeOnClick: false
                })
                setTimeout(() => {
                    navigate('/');
                    window.location.reload('/')
                }, 1200);
            } else {
                toast("Data Incomplete !!", {
                    position: "top-center",
                    autoClose: 1500,
                })
            }
        })
    }
    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setcover(base64)
    }

    const handleGenre = (e) => {
        if (e.target.checked === true) {
            setgenres([...genres, e.target.value])
        }
        if (e.target.checked === false) {
            setgenres((current) => {
                return current.filter((genre) => genre !== e.target.value)
            })
        }
    }
    return (
        <>
            <div className="container d-flex flex-column my-5" style={{ "minHeight": "70vh" }} >

                <div className="row">
                    <h1 className='text-center fw-bold'>Upload Manga</h1>
                    <form>
                        <div className="col-8 offset-2">

                            <div className="mb-2">
                                <label className="form-label fw-bold" style={{fontSize : "22px"}} htmlFor="title">Title</label>
                                <input className="form-control" type="text" autoComplete='off' onChange={(e) => { settitle(e.target.value) }} id="" required />
                            </div>

                            <div className="mb-2">
                                <label htmlFor="description" style={{fontSize : "22px"}} className="form-label fw-bold">Description</label>
                                <textarea className="form-control" rows="5" onChange={(e) => { setdesc(e.target.value) }} required />
                            </div>

                            <div className="mb-2">
                                <label className="form-label fw-bold" style={{fontSize : "22px"}} htmlFor="photo">Cover Photo (.jpeg , .png , .jpg)</label>
                                <input className="form-control" type="file" accept='.jpg, .jpeg, .png' onChange={(e) => handleCoverUpload(e)} required />
                            </div>

                            <div className="mb-2">
                                <label className="form-label fw-bold" style={{fontSize : "22px"}} htmlFor="status">Status</label>
                                <select className="form-select" aria-label="Default select example" required onChange={(e) => { setstatus(e.target.value) }}>
                                    <option value="">Select Status</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            {/* genres  */}

                            <div className="mb-2">
                                <h6 className="form-label fw-bold" htmlFor="title" style={{fontSize : "22px"}}>Genres</h6>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox1" value="Action" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox1" >Action</label>
                                </div>

                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Adventure" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Adventure</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Award Winning" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Award Winning</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Drama" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Drama</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Fantasy" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Fantasy</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Horror" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Horror</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Supernatural" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Supernatural</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Girls Love" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Girls Love</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Ecchi" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Ecchi</label>
                                </div>

                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Comedy" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Comedy</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Slice of Life" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Slice of Life</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Mystery" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Mystery</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Romance" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Romance</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Erotica" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Erotica</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="option2" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Sports</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Suspense" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Suspense</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Sci-Fi" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Sci-Fi</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Boys Love" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Boys Love</label>
                                </div>

                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" onChange={(e) => { handleGenre(e) }} type="checkbox" id="inlineCheckbox2" value="Yaoi" required />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">Yaoi</label>
                                </div>

                            </div>

                            <h3 className="form-label fw-bold my-4" htmlFor="chapter">Add Chapter</h3>

                            <div className="mb-2">
                                <label className="form-label fw-bold" style={{fontSize : "22px"}} htmlFor="chapter-name">Chapter Name</label>
                                <input className="form-control" type="text" autoComplete='off' onChange={(e) => { setchapName(e.target.value) }} id="" required />
                            </div>

                            <div className="mb-2">
                                <label className="form-label fw-bold" style={{fontSize : "22px"}} htmlFor="chapter-name">Chapter Number</label>
                                <input className="form-control" type="number" min="1" value={chapNumber} autoComplete='off' id="" />
                            </div>

                        </div>
                        <div className="mb-2 col-8 offset-2">
                            <label className="form-label fw-bold" style={{fontSize : "22px"}} htmlFor="chapter-name">Select Chapter ( .pdf only) </label>
                            <input className="form-control" type="file" accept='.pdf' onChange={(e) => { setfile(e.target.files[0]) }} required />
                            <button className="btn btn-success mt-3 fw-bold px-4" style={{borderRadius : "30px" , color : "black"}} onClick={(e) => { onsubmit(e) }} type="submit">Upload</button>
                        </div>
                    </form>

                </div>
                <hr style={{ borderTop: '2px dotted ' }}></hr>
            </div>
            
        </>
    )
}

export default UploadManga
