import React from 'react'
import googleImage from '../assests/google-img.png'
import styles from '../styles/LoginPage.module.css'
import twitterImage from '../assests/twitter-img.webp'
import logo from '../assests/meowngalogo.png'

const googleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google"
}

const twitterlogin = () => {
    window.location.href = "http://localhost:5000/auth/twitter"
}

export default function LoginPage() {
    return (
        <>
            <section className="vh-100 mt-5">
                <div className="container h-50">
                    <div className="row d-flex align-items-center justify-content-center h-100">
                        <div className="col-md-8 col-lg-7 col-xl-6 text-center">
                            <img src={logo} style={{ maxHeight: "40vh", minWidth: "20vw" }} className='img-fluid' alt="" />
                        </div>
                        
                            <div className={` col-lg-6  text-center`}  >
                                <h1 className='mt-5 fw-bold'>Login/SignUp</h1>
                                <h1 className='mb-5 fw-bold'>Meownga</h1>

                                <div className={`${styles.googleContainer} container my-3 fw-bold`} style={{ "margin": "auto auto" }} onClick={googleLogin}>
                                    <img src={googleImage} alt="google icon" />
                                    <p className='my-1' style={{ fontSize: "1rem" }}>Login with google</p>
                                </div>
                                <div className={`${styles.twitterContainer} container my-3 fw-bold`} style={{ "margin": "auto auto" }} onClick={twitterlogin}>
                                    <img src={twitterImage} alt="twitter icon" />
                                    <p className='my-1' style={{ fontSize: "1rem" }}>Login with twitter</p>
                                </div>
                            </div>

                        
                    </div>
                </div>
            </section>
        </>

    )
}