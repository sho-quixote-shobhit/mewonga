import React, { useEffect, useState } from 'react'
import styles from '../styles/UserPage.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'


const Results = () => {
    const navigate = useNavigate()
    const {search} = useParams();

    const [results, setresults] = useState([])


    useEffect(() => {
        const fetchResults = async()=>{
            const response = await axios.post('http://localhost:5000/manga/search' , {search} , {withCredentials : true})
            setresults(response.data);
        }
        fetchResults();
    }, [search])

    const submit = async(id) => {
        navigate(`/${id}/chapters`)
    }

    return (
        <>

            <div className="container my-5">

                <div className="row ">
                    <h1 className='text-center fw-bold'>Manga</h1>
                    <p className='text-center fw-bold'>Related to your search</p>
                    {results.map((manga) => {
                        return (
                            <>
                                <div className = {`${styles.each} col-lg-4 col-md-6 col-sm-12`} onClick={()=>{submit(manga._id)}}>
                                    <div className="card border-0 d-flex justify-content-center align-items-center my-3 m-auto" style={{ width: "17rem" , cursor : "pointer" , borderRadius : "20px" }}>
                                        <img src={manga.cover}  className="card-img-top img-fluid " style={{ width: "260px", height: "260px" , borderRadius : "5%"}} alt="..." />
                                        <div className="card-body p-1">
                                            <h4 style={{ color: "black", fontWeight: "bold" }} className='p-0' >{manga.title}</h4>
                                            <p className='text-center p-0 m-1 fw-bold' style={{ color: "black" }}>{manga.status}</p>
                                            <p className='text-center p-0 fw-bold' style={{ color: "black" }}>By : {manga.author.username}</p>
                                            <p className='text-center p-0 fw-bold ' style={{ color: "black" }}>Chapters : {manga.chapters.length}</p>
                                        </div>

                                    </div>
                                </div>
                            </>)
                    })}
                </div>

            </div>

        </>
    )
}

export default Results
