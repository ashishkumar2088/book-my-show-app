import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById } from "../../calls/movies";
import Navbar from "../../Components/ Navbar/Navbar";
import { Col, Flex, Input, Row, message } from "antd";
import moment from "moment";
import { getShowsForAMovie } from "../../calls/shows";

function SingleMovie(){
    
    const [movie,setMovie] = useState(null);
    const [date, setDate]=  useState(moment().format("YYYY-MM-DD"));
    const [showsData, setShowsData]= useState(null);

    const navigate = useNavigate();

    const params = useParams();

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('token');

    const getData = useCallback(async ()=>{
        const movieAPIResponse = await getMovieById(params.id);
        setMovie(movieAPIResponse.data.data)
    }, [params.id]);

    const handleDate = (e)=>{
        setDate(e.target.value);
        navigate(`/movie/${params.id}?date=${e.target.value}`)
    } 

    const getAllShowsForSelectedMovie = useCallback(async ()=>{
        console.log(`get shows for movieId : ${params.id} and date : ${date}`);
        const showsData = await getShowsForAMovie(params.id,date);
        setShowsData(showsData.data.data);
    }, [params.id, date]);

    // Handle show time click with authentication check
    const handleShowTimeClick = (showId) => {
        if (!isLoggedIn) {
            message.warning("Please login to book tickets!");
            navigate('/login');
            return;
        }
        navigate(`book-show/${showId}`);
    }

    useEffect(()=>{
        getAllShowsForSelectedMovie();
    },[date, getAllShowsForSelectedMovie])

    useEffect(()=>{
        getData();
    },[getData])

    return <div>
        <Navbar/>

        {
            movie && (
                <Flex gap="large" justify="center" align="center">
                  <div>
                    <img src={movie.poster} width={200} alt={movie.movieName} />
                  </div>

                  <div> 
                    <h1> {movie.movieName} </h1>
                    <p> Language : {movie.language} </p>
                    <p> Genre : {movie.genre} </p>
                    <p> Release Date : {movie.releaseDate} </p>
                    <p> Duration : {movie.duration} </p>
                    <hr/>

                    <div>
                        <label> Choose the Date : </label>
                        <Input onChange={handleDate} type="date" value={date} />
                    </div>
                  </div>  
              </Flex>
            )
        }

        {
            showsData && showsData.length===0 && (
                <div className="pt-3 m-5">
                    <h2 className="blue-clr"> 
                        Currently, No Theatres available for this movie!
                    </h2>
                </div>
            )
        }

        {
            showsData && showsData.length>0 && (
                <div className="m-3">
                    <h2> Theatres </h2>
                    {!isLoggedIn && (
                        <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
                            <strong>⚠️ Login Required:</strong> Please login to book tickets for this movie.
                        </div>
                    )}
                    {
                        showsData.map(showsData=>{
                            const theatreId = showsData.theatreId;
                            const theatreDetails = showsData.theatreDetails;
                            const allShowsForThisTheatre = showsData.allShowsForParticularTheatre;

                            return <div key={theatreId}>
                                <Row gutter={24} >
                                    <Col lg={{span:8}} >
                                       <h3> {theatreDetails.name} </h3>
                                       <p> {theatreDetails.address}</p>
                                    </Col>

                                    <Col lg={{span:16}} >
                                    <ul className="show-ul">
                                        {
                                            allShowsForThisTheatre.map(singleShow=>{
                                                return <li 
                                                    key={singleShow._id}
                                                    onClick={()=> handleShowTimeClick(singleShow._id)}
                                                    style={{ cursor: isLoggedIn ? 'pointer' : 'not-allowed', opacity: isLoggedIn ? 1 : 0.6 }}
                                                > 
                                                    {singleShow.time} 
                                                    {!isLoggedIn && <span style={{ fontSize: '12px', color: '#666' }}> (Login required)</span>}
                                                </li>
                                            })
                                        }
                                    </ul>
                                    </Col>
                                </Row>
                                </div>
                        })
                    }
                </div>    
            )
        }
    </div>
}

export default SingleMovie;