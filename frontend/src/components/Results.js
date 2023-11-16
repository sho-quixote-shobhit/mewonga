import React from 'react'
import styles from '../styles/UserPage.module.css'

const Results = () => {

    const results = JSON.parse(window.localStorage.getItem('results'));

    const handleManga = (e)=>{
        console.log('hi')
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
                                <div className = {`${styles.each} col-lg-4 col-md-6 col-sm-12`}>
                                    <div className="card border-0 d-flex justify-content-center align-items-center my-3 m-auto" onClick={(e)=>{handleManga(e)}}  style={{ width: "17rem" , cursor : "pointer" , borderRadius : "20px" }}>
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
