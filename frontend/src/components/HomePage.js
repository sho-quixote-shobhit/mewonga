import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles2 from '../styles/UserPage.module.css'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    const [search, setsearch] = useState("");
    const formattedSearch = search.replace(/ /g, '-');
    const data = window.localStorage.getItem('userData');
    const userData = JSON.parse(data)
    let userId = "";
    if (userData) {
        userId = userData._id
    }

    const [topmangas, settopmangas] = useState([])

    const navigate = useNavigate();

    useEffect(() => {

        const fetchtopMangas = async () => {
            const response = await axios.get('http://localhost:5000/other/topmanga')
            settopmangas(response.data)
        }   

        fetchtopMangas()
    }, [userId])


    const onsubmit = async (e) => {
        e.preventDefault()
        navigate(`/${formattedSearch}/results`)
    }

    const handletopmangaclick = (mangaid) => {
        navigate(`/${mangaid}/chapters`)
    }

    return (
        <>

            <div className="container d-flex flex-column justify-content-center align-items-center" style={{ "minHeight": "50vh" }}>

                <h1 className='text-center fw-bold'>Search for Manga</h1>

                <form onSubmit={(e) => { onsubmit(e) }} >
                    <div className="my-4" style={{ "minWidth": "50vw", "borderRadius": "30px" }}>
                        <input style={{ "borderRadius": "30px", "minHeight": "6vh" }} type="text" autoComplete="off" onChange={(e) => { setsearch(e.target.value) }} className="form-control" id="searchmanga" placeholder='Eg. one piece' required />
                    </div>
                    <div className="container d-flex flex-row justify-content-center align-items-center">
                        <button type="submit" className='btn btn-dark mx-2 fw-bold px-4' style={{ borderRadius: "30px", color: "white" }}>Search</button>
                    </div>
                </form>

            </div>

            <div className='container'>

                <h2 className='text-center fw-bold mb-4'>Top Rated Manga</h2>
                <div className='row'>

                    {topmangas.map((manga) => {
                        return (
                                <div key={manga._id} className={`${styles2.each} col-lg-3 col-md-4 col-sm-12`} onClick={() => { handletopmangaclick(manga._id) }}>
                                    <div className="card border-0 d-flex justify-content-center align-items-center my-3 m-auto" style={{ width: "12rem", cursor: "pointer", borderRadius: "20px" }}>
                                        <img src={manga.cover} className="card-img-top img-fluid " style={{ width: "300px", height: "230px", borderRadius: "5%" }} alt="..." />
                                        <div className="card-body p-1">
                                            <h4 style={{ color: "black", fontWeight: "bold" }} className='p-0' >{manga.title}</h4>
                                            <h6 style={{ color: "black", fontWeight: "bold" }} className='p-0 text-center'>Rated : {Math.round((manga.rating + Number.EPSILON) * 100) / 100} &#9733;</h6>
                                        </div>

                                    </div>
                                </div>
                            )
                    })}
                </div>
                <hr style={{ borderTop: '2px dotted ' }}></hr>
            </div>


        </>
    )
}

export default HomePage