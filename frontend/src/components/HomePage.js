import React, { useState } from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    const [search, setsearch] = useState("");
    const formattedSearch = search.replace(/ /g, '-');
    const data = window.localStorage.getItem('userData');
    const userData = JSON.parse(data)

    const navigate = useNavigate()

    const onsubmit = async (e) => {
        e.preventDefault()
        await axios.post('http://localhost:5000/manga/search', { search }, { withCredentials: true }).then(res => {
            if (res.data) {
                window.localStorage.setItem('results', JSON.stringify(res.data));
                navigate(`/${formattedSearch}/results`)
            }
        })
    }

    return (
        <>
            
            {window.localStorage.removeItem('results')}
            <div className="container d-flex flex-column justify-content-center align-items-center" style={{ "minHeight": "50vh" }}>

                <h1 className='text-center fw-bold'>Search for Manga</h1>

                <form onSubmit={(e) => { onsubmit(e) }} >
                    <div className="my-4" style={{ "minWidth": "50vw", "borderRadius": "30px" }}>
                        <input style={{ "borderRadius": "30px", "minHeight": "6vh" }} type="text" autoComplete="off" onChange={(e) => { setsearch(e.target.value) }} className="form-control" id="searchmanga" placeholder='Eg. one piece' required />
                    </div>
                    <div className="container d-flex flex-row justify-content-center align-items-center">
                        <button type="submit" className='btn btn-outline-light mx-2 fw-bold'>Search</button>
                    </div>
                </form>

            </div>


            {userData && userData.visited.length ? <div className="container" >

                <div className="container" style={{ "maxWidth": "50vw" }}>
                    <h3 className='text-center fw-bold'>Manga for You</h3>
                </div>

            </div> : <></>}

        </>
    )
}

export default HomePage