import { useEffect, useCallback } from "react";
import { getAllMovies } from "../../calls/movies";
import Navbar from "../../Components/ Navbar/Navbar";
import { Col, Flex, Input, Row, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function Home(){

    const [movies,setMovies] = useState(null);
    const [searchText, setSearchText] = useState(""); 
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchMovies = useCallback(async ()=>{
        try {
            setLoading(true);
            console.log("Fetching movies...");
            const response = await getAllMovies();
            console.log("API Response:", response);
            
            if(response && response.data && response.data.success){
                console.log("Movies data:", response.data.data);
                setMovies(response.data.data);
            } else {
                console.log("API returned error:", response);
                message.error("Failed to fetch movies");
                setMovies([]);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            message.error("Failed to load movies");
            setMovies([]);
        } finally {
            setLoading(false);
        }
    }, []);   

    useEffect(()=>{
        fetchMovies();
    },[fetchMovies])

    const onSearchInputChange=(e)=>{
        setSearchText(e.target.value);
    }

    const filteredMovies = movies ? movies.filter((movie)=>
        movie.movieName.toLowerCase().includes(searchText.toLowerCase())
    ) : [];

    return <div>

          <Navbar/>

          <Row style={{justifyContent:"center",marginTop:"20px"}} className="d-flex justify-content-center w-100">

            <Col lg={{span:12}} xs={{span:24}} >

            <Input value={searchText} onChange={onSearchInputChange}  placeholder="Type here to search for movies" />
            
            </Col>
          </Row>

          <Flex  wrap gap="large" justify="center" align="center" style={{marginTop:"10px",padding:"30px"}}>

            {loading ? (
                <div>Loading movies...</div>
            ) : filteredMovies.length > 0 ? (
                filteredMovies.map((movie)=>{
                    return <div 
                        className="mb-5 cursor-pointer"
                        style={{ cursor: 'pointer' }}
                        onClick={()=>{
                            navigate(`/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`)
                        }}
                        span={{
                            lg:10,
                            xs:24,
                            md:12
                        }}
                    >
                        <div className="text-center">
                            <img 
                                width={250} 
                                src={movie.poster} 
                                style={{borderRadius:"8px"}} 
                                alt={movie.movieName} 
                            />
                            <h3> {movie.movieName} </h3>
                        </div>
                    </div>
                })
            ) : (
                <div>No movies found. {searchText && "Try a different search term."}</div>
            )}

          </Flex>

        </div>
    
}

export default Home;