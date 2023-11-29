import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner';

const Chapter = () => {

    const { chapId } = useParams();

    const [pages, setpages] = useState([])
    const [chapterno, setchapterno] = useState(0)
    const [chaptername, setchaptername] = useState('')
    const [loading, setloading] = useState(false)
    const [colorloading, setcolorloading] = useState(false)
    const [coloredPages, setcoloredPages] = useState()

    useEffect(() => {
        const fetchdata = async () => {
            try {
                setloading(true);
                const response = await axios.post('http://localhost:5000/chapter/getchapter', { chapId }, { withCredentials: true });
                setchaptername(response.data.chapName)
                setpages(response.data.pages)
                setchapterno(response.data.chapNumber)
                setloading(false);
            } catch (error) {
                toast("Error occured !!", {
                    position: "top-center",
                    autoClose: 1000,
                })
                console.log(error)
            }
        };
        fetchdata();
    }, [chapId])

    const handleColorize = async (e) => {
        e.preventDefault();
        try {
            setcolorloading(true);
            const response = await axios.post('http://localhost:5000/chapter/colorize', { pages }, { withCredentials: true });
            const colored = response.data;
            setcoloredPages(colored)
            setcolorloading(false);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>

            <div className='container d-flex flex-column align-items-center'>
                <div className='container mt-4'>
                    <h1 className='text-center fw-bold'>Chapter {chapterno}</h1>
                    <h1 className='text-center fw-bold'>{chaptername}</h1>
                </div>
                {loading && <TailSpin type="TailSpin" color="#007BFF" height={30} width={30} />}
                <div>{colorloading ? <TailSpin type="TailSpin" color="#007BFF" height={30} width={30} /> : <button disabled = {coloredPages ? true : false} onClick={(e) => { handleColorize(e) }} className='btn btn-light btn-sm fw-bold px-4 py-2' style={{ borderRadius: "50px" }}>Colorize</button>}</div>

                {coloredPages ? coloredPages.map(page => {
                    return (
                        <div className='container text-center' key={page}>
                            <img style={{ minWidth: "40vw", maxHeight: "80vh" }} className='img-fluid my-3' src={`data:image/jpeg;base64,${page}`} alt=""></img>
                        </div>
                    )
                }) : pages.map(page => {
                    return (
                        <div className='container text-center' key={page.page}>
                            <img style={{ minWidth: "40vw", maxHeight: "80vh" }} className='img-fluid my-3' src={`data:image/jpeg;base64,${page.page}`} alt=""></img>
                        </div>
                    )
                })}

<hr style={{ borderTop: '2px dotted ' }}></hr>

            </div>

        </>
    )
}


export default Chapter 