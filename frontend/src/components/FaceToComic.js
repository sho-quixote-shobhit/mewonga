import React, { useState } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import axios from 'axios'
import { TailSpin } from 'react-loader-spinner'
import styles from '../styles/LoginPage.module.css'

const FaceToComic = () => {
    const [src, setsrc] = useState(null);
    const [crop, setcrop] = useState({ unit: "px" })
    const [croppedImage, setcroppedImage] = useState(null);
    const [animatedImage, setanimatedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const animate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/other/animate', { croppedImage }, { withCredentials: true });
            if (!response) {
                alert('Crop the face only')
            }
            setanimatedImage(response.data.animatedImage);
        } catch (error) {
            console.error('Error animating image:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (animatedImage) {
            const link = document.createElement('a');
            link.href = `data:image/jpeg;base64,${animatedImage}`;
            link.download = 'animated_image.jpg'; // Specify the filename here
            link.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setsrc(URL.createObjectURL(file))
        }
    }

    const handleCrop = (crop) => {
        setcrop(crop)
    }

    const handleCropcomplete = (image, crop, pixelCrop) => {
        if (src) {
            const image = new Image();
            image.src = src;

            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const x = (crop.x / 100) * image.width;
                const y = (crop.y / 100) * image.height;
                const width = (crop.width / 100) * image.width;
                const height = (crop.height / 100) * image.height;

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

                const base64 = canvas.toDataURL('image/jpeg', 0.8);
                setcroppedImage(base64);
            };
        }

    }

    return (
        <div className='container'>
            <div className="d-flex flex-column justify-content-center align-items-center mt-3" >
                <div className={styles.inputcontainer} style={{ borderRadius: "30px", color: "black" }}>
                    <input
                        type="file"
                        accept=".jpg, .png, .jpeg"
                        onChange={handleFileChange}
                        className={styles.inputlabel}
                    />
                </div>
                {src && <div className="text-center">

                    <ReactCrop crop={crop} onChange={handleCrop} onComplete={handleCropcomplete} aspect={1 / 1} unit="px">
                        <img src={src} alt="" />
                    </ReactCrop>
                    <h5 className='fw-bold mb-4'>Try to crop the face</h5>

                </div>
                }
                {/* {
                    croppedImage && <div className='d-flex flex-column justify-content-center align-items-center'>

                        <img src={croppedImage} style={{width : "256px" , height : "256px"}} className='my-4' alt="" />
                        {loading ? <TailSpin type="TailSpin" color="#007BFF" height={50} width={50} /> : <button className='btn btn-primary fw-bold' onClick={(e) => { animate(e) }} > Animate</button> }
                    </div>

                }
               
                {
                    animatedImage && <div className='d-flex flex-column justify-content-center align-items-center'>

                        <img src={`data:image/jpeg;base64,${animatedImage}`} className='my-4' alt="" />
                        <button className='btn btn-primary fw-bold' onClick={handleDownload}> Download</button>
                    </div>

                } */}
                <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-12'>

                        {
                            croppedImage && <div className='d-flex flex-column justify-content-center align-items-center'>
                                <h4 className='text-center m-0 p-0 fw-bold px-4 py-1' style={{backgroundColor : "white" , borderRadius : "50px"}}>Preview</h4>
                                <img src={croppedImage} style={{ width: "256px", height: "256px" }} className='my-4' alt="" />
                                {loading ? <TailSpin type="TailSpin" color="#007BFF" height={50} width={50} /> : <button className='btn btn-light fw-bold px-3' style={{ borderRadius: "50px" }} onClick={(e) => { animate(e) }} > Animate</button>}
                            </div>

                        }
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-12'>

                        {
                            animatedImage && <div className='d-flex flex-column justify-content-center align-items-center'>
                                <h4 className='text-center m-0 p-0 fw-bold px-3 py-1' style={{backgroundColor : "white" , borderRadius : "50px"}}>Animated</h4>
                                <img src={`data:image/jpeg;base64,${animatedImage}`} className='my-4' alt="" />
                                <button className='btn btn-light fw-bold' style={{ borderRadius: "50px" }} onClick={handleDownload}> Download</button>
                            </div>

                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default FaceToComic

