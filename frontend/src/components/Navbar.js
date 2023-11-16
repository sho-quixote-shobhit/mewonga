import React, { useContext } from 'react'
import { myContext } from '../Context'

const Navbar = ({ logout }) => {

    const userObject = useContext(myContext)
    return (
        <>
            <div className="container">

                <nav className="navbar navbar-expand-lg " style={{color : "white"}}>
                    <div className="container-fluid">
                        <a className="navbar-brand fw-bold" href="/" style={{color : "white"}}>
                            {/* {window.localStorage.removeItem('results')} */}
                            <img src="https://i1.sndcdn.com/avatars-000600452151-38sfei-t500x500.jpg" alt="Logo" width="30" height="24" className="d-inline-block align-text-top" style={{ "borderRadius": "50%" }} />
                            Meownga
                        </a>
                        <button className="navbar-toggler" type="button" style={{backgroundColor : "white" , color : "black"}} data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span  className="navbar-toggler-icon">___</span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            {userObject ? (

                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <a className="nav-link active mx-1 fw-bold" style={{color : "white"}} aria-current="page" href="/uploadmanga">Upload Manga</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link active mx-1 fw-bold" style={{color : "white"}} aria-current="page" href="/create">Create Character</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link active mx-1 fw-bold" style={{color : "white"}} aria-current="page" href="/facetocomic">Animate Yourself</a>
                                    </li>

                                </ul>

                            ) : (
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    
                                </ul>
                            )}
                            <div className="d-flex">
                                {userObject ? (
                                    <li className="nav-item dropdown " style={{ "listStyleType": "none" }}>
                                        <a  style={{color : "white"}} className="nav-link dropdown-toggle fw-bold" href="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Profile
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item fw-bold" href="/profile">{userObject.username}</a></li>
                                            <hr style={{ "margin": "0" }} />
                                            <li><a className="dropdown-item fw-bold" href="/" onClick={logout}>Logout</a></li>
                                        </ul>
                                    </li>
                                ) : (<a href="/login" style={{color : "white"}} className='nav-link fw-bold'> Login/SignUp</a>)}
                            </div>  
                        </div>
                    </div>
                </nav>

            </div>
        </>
    )
}

export default Navbar
