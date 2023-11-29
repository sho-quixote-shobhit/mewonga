import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Starts.module.css'
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import 'react-toastify/dist/ReactToastify.css';
import styles2 from '../styles/UserPage.module.css'

const Manga = () => {
    const [manga, setManga] = useState({});
    const [realtedmanga, setrealtedmanga] = useState([])
    const { id } = useParams();
    const [username, setusername] = useState('');
    const [genresString, setGenresString] = useState('');
    const [formattedUpdatedAt, setFormattedUpdatedAt] = useState('');
    const [rating, setrating] = useState(0)
    const [chapters, setchapters] = useState([])
    const [comments, setcomments] = useState([])
    const [newcomment, setnewcomment] = useState('')
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    const userData = JSON.parse(window.localStorage.getItem('userData'));
    let userId = "";
    if (userData) {
        userId = userData._id
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`http://localhost:5000/manga/chapters/`, { userId , id }, { withCredentials: true });
                setManga(response.data.mangaContent);
                console.log(response.data.mangaDetails)
                setrealtedmanga(response.data.mangaDetails)
                setchapters(response.data.mangaContent.chapters)
                setcomments(response.data.mangaContent.comments)
                setusername(response.data.mangaContent.author.username);
                const genres = response.data.mangaContent.genres.map((g) => g.genre);
                setGenresString(genres.join(', '));
                const updatedAt = new Date(response.data.mangaContent.updatedAt);
                const options = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                };
                setFormattedUpdatedAt(updatedAt.toLocaleDateString('en-US', options));
            } catch (error) {
                console.error("Error fetching manga:", error);
            }
        };
        fetchData();
    }, [id , userId]);

    //stars
    const handleRatingClick = async (selectedRating) => {
        setrating(selectedRating)
        await axios.post('http://localhost:5000/manga/rating', { id, selectedRating, userId }, { withCredentials: true }).then(res => {
            toast("Thanks for rating !!", {
                position: "top-center",
                autoClose: 1500,
            })
        })
    };
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`${styles.star} ${i <= rating ? 'selected' : ''}`}
                    onClick={() => handleRatingClick(i)}
                    onMouseOver={() => handleMouseOver(i)}
                    onMouseOut={handleMouseOut}
                >
                    &#9733;&nbsp;
                </span>
            );
        }
        return stars;
    };
    const handleMouseOver = (hoveredRating) => {
        const starElements = document.querySelectorAll('.star');
        starElements.forEach((star, index) => {
            if (index < hoveredRating) {
                star.classList.add(`${styles.hovered}`);
            } else {
                star.classList.remove(`${styles.hovered}`);
            }
        });
    };
    const handleMouseOut = () => {
        const starElements = document.querySelectorAll('.star');
        starElements.forEach((star) => {
            star.classList.remove(`${styles.hovered}`);
        });
    };

    //comment
    const handleComment = async (e) => {
        e.preventDefault();
        try {
            if (!newcomment) {
                toast("Write a comment!!", {
                    position: "top-center",
                    autoClose: 1500,
                })
                return;
            }
            setLoading(true);
            await axios.post('http://localhost:5000/other/comment', { userId, newcomment, id }, { withCredentials: true });
            setnewcomment('');
            window.location.reload('/:id/chapters')
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setLoading(false);
        }
    }

    //delete comment
    const handleDelete = async (commentId) => {
        try {
            await axios.post('http://localhost:5000/other/deletecomment', { id, commentId }, { withCredentials: true })
            window.location.reload('/:id/chapters')

        } catch (error) {
            console.error('Error occured', error)
        }
    }

    //read chapter
    const handleRead = (chapId) => {
        navigate(`/${id}/chapters/${chapId}`)
    }
    //realted
    const handlerelated = (mangaid) =>{
        navigate(`/${mangaid}/chapters`)
        window.location.reload()
    }

    return (
        <>
            <div className='container'>

                {/* all data */}
                <div className='row mt-5'>
                    <div className='col-md-4 text-center mb-4'>
                        <img
                            src={manga.cover}
                            alt=""
                            className='img-fluid'
                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '10%' }}
                        ></img>
                    </div>
                    <div className='col-md-8 d-flex flex-column'>
                        <h1 className='fw-bold mb-4'>{manga.title}</h1>
                        <h6 className='fw-bold mb-4'>
                            {' '}
                            <i className="fa-regular fa-user"></i> Author(s):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {username}
                        </h6>
                        <h6 className='fw-bold mb-4'>
                            <i className="fa-solid fa-signal"></i> Status:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {manga.status}
                        </h6>
                        <h6 className='fw-bold mb-4'>
                            <i className="fa-regular fa-circle"></i> Genres:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {genresString}
                        </h6>
                        <h6 className='fw-bold mb-4'>
                            <i className="fa-regular fa-clock"></i> Updated At:&nbsp;&nbsp; {formattedUpdatedAt}
                        </h6>
                        <h6 className='fw-bold mb-4'>
                            <i className="fa-regular fa-star"></i> Rating:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {manga.rating === 0 ? 'N/A' : Math.round((manga.rating + Number.EPSILON) * 100) / 100 + '/5'}
                        </h6>
                        {userData && <div className='fw-bold mb-4'>
                            <i className="fa-regular fa-star"></i> Rate:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            {renderStars()}
                        </div>}
                    </div>
                </div>
                <hr style={{ borderTop: '2px dotted ' }}></hr>

                {/* description */}
                <div className='d-flex flex-column'>
                    <div style={{backgroundColor : "#BCD2EE" , borderRadius : "50px" }} className='px-4 py-2'>
                        <h4 className='fw-bold'>Description</h4>
                        <p>{manga.desc}</p>
                    </div>
                    <hr style={{ borderTop: '2px dotted ' }}></hr>

                    {/* chapters */}
                    <div>
                        <h4 className='fw-bold'>Chapters</h4>
                        {chapters.map(chap => {
                            return (
                                <div key={chap._id} style={{ backgroundColor: "white", padding: "10px", borderRadius: "10px" }} className='mt-2 mb-2 d-flex align-items-center justify-content-between'>
                                    <h6 className='fw-bold' style={{ color: "black" }}>Chapter {chap.chapNumber} : {chap.chapName}</h6>
                                    <button onClick={(e) => { handleRead(chap._id) }} className='btn btn-sm btn-success fw-bold' style={{ borderRadius: "10px" }}>Read</button>
                                </div>
                            )
                        })}
                    </div>
                    <hr style={{ borderTop: '2px dotted ' }}></hr>

                    {/* related manga */}
                    <h4 className='fw-bold'>Related Manga</h4>
                    <div className='row'>
                        
                        {realtedmanga.map((manga) => {
                            return (
                                <>
                                    <div className={`${styles2.each} col-lg-3 col-md-4 col-sm-12`} onClick={() => {handlerelated(manga._id)}}>
                                        <div className="card border-0 d-flex justify-content-center align-items-center my-3 m-auto" style={{ width: "12rem", cursor: "pointer", borderRadius: "20px" }}>
                                            <img src={manga.cover} className="card-img-top img-fluid " style={{ width: "300px", height: "230px", borderRadius: "5%" }} alt="..." />
                                            <div className="card-body p-1">
                                                <h4 style={{ color: "black", fontWeight: "bold" }} className='p-0' >{manga.title}</h4>
                                            </div>

                                        </div>
                                    </div>
                                </>)
                        })}
                    </div>

                    <hr style={{ borderTop: '2px dotted ' }}></hr>
                    {/* comment section */}
                    <div className='mt-5'>
                        <h4 className='fw-bold'>{comments.length} Comments</h4>
                        {userId ? <form className=''>
                            <textarea rows="1" className="form-control me-2" type="text" autoComplete='off' onChange={(e) => { setnewcomment(e.target.value) }} placeholder='Leave a comment' id="" required />
                            <div className='d-flex flex-row justify-content-between mt-1'>
                                <p></p>
                                <button onClick={(e) => { handleComment(e) }} className='btn btn-sm btn-primary fw-bold' style={{ borderRadius: "50px" }}>{loading ? <TailSpin
                                    type="ThreeDots"
                                    color="#00BFFF"
                                    height={20}
                                    width={20}
                                    style={{ marginLeft: '10px' }}
                                /> : "Comment"}</button>
                            </div>
                        </form> : <><a className='btn btn-primary fw-bold' href='/login' style={{ borderRadius: "10px" }}>Login To comment</a></>}
                        {comments.map(comment => {
                            return (
                                <div key={comment._id} className='d-flex flex-row align-items-center mb-3'>
                                    <div className='me-2'>
                                        <img width="50px" height="50px" src={comment.author.dp} style={{ borderRadius: "50%" }} alt="" />
                                    </div>
                                    <div className='d-flex flex-grow-1 p-2 my-2 justify-content-between align-items-center' style={{ backgroundColor: `${comment.status === 'POSITIVE' ? "#90EE90" : "#FF7F7F"}`, borderRadius: "10px", color: "black" }} >
                                        <div>
                                            <p className='p-0 m-0 fw-bold'><i className="fa-solid fa-at"></i> {comment.author.username} </p>
                                            <p className='p-0 m-0'><i className="fa-regular fa-comment"></i> {comment.comment}</p>
                                        </div>
                                        <div>{comment.author._id === userId ? <button onClick={() => { handleDelete(comment._id) }} className='btn btn-danger btn-sm fw-bold' style={{ borderRadius: "10px" }}>Delete</button> : <></>}</div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>

                </div>
                <hr style={{ borderTop: '2px dotted ' }}></hr>
            </div>
        </>
    );
};

export default Manga;
