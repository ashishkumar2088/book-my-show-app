import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getShowDetails } from "../../calls/shows";
import {Card, Row, Col, message} from "antd";
import Navbar from "../../Components/ Navbar/Navbar";
import StripeCheckout from "react-stripe-checkout";
import { CreateBooking, MakePayment } from "../../calls/bookings";

function BookShow(){

    const params = useParams();
    const navigate = useNavigate();

    const showId = params.showId;

    const [showDetails, setShowDetails] = useState(null);
    const [selectedSeats, setSelectedSeats]  = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('token');

    // Authentication check and redirect
    useEffect(() => {
        if (!isLoggedIn) {
            message.warning("Please login to book tickets!");
            navigate('/login');
            return;
        }
        setIsAuthenticated(true);
    }, [isLoggedIn, navigate]);

    const getSeats = ()=>{
        const columns = 12;
        const totalSeats = 120;

        const rows = totalSeats/columns; //10

        let allRows = [];

        for(let i=0;i<rows;i++){
            allRows.push(i);
        }

        let allColumns = [];

        for(let j=0;j<columns;j++){
            allColumns.push(j);
        };

        const handleSeatSelect  = (seatNumber)=>{
            seatNumber = seatNumber.toString();

            if(showDetails.bookedSeats.includes(seatNumber)){
                return;
            }

            if(!selectedSeats.includes(seatNumber)){
                setSelectedSeats([...selectedSeats, seatNumber]);
                return;
            }

            const updatedSelectedSeats = selectedSeats.filter((seat)=>seat !== seatNumber);
            setSelectedSeats(updatedSelectedSeats);
        }

        return <div className="seat-ul" >
            <div>
                {
                    allRows.map((row)=>{
                        return <div className="d-flex" key={row}>
                            {
                                allColumns.map((col)=>{
                                    let seatNumber = row*columns + col + 1;
                                    const isSeatBooked = showDetails.bookedSeats.includes(seatNumber.toString());
                                    let seatClass = "seat-btn";
                                    
                                    if(isSeatBooked){
                                        seatClass += " seat-btn-booked";
                                    }

                                    if(selectedSeats.includes(seatNumber.toString())){
                                        seatClass+= " seat-btn-selected";
                                    }

                                    return <button 
                                        key={seatNumber}
                                        onClick={()=>handleSeatSelect(seatNumber)} 
                                        className={seatClass}
                                    >
                                        {seatNumber}
                                    </button>
                                })
                            }
                        </div>
                    })
                }
            </div>
        </div>
    }

    const onToken = async (token)=>{
        try{
            console.log("Payment token received:", token);
            
            // Calculate total amount
            const totalAmount = selectedSeats.length * showDetails.ticketPrice;
            console.log("Total amount:", totalAmount);
            
            const response = await MakePayment({
                token: token,
                amount: totalAmount
            });
            console.log("Payment response:", response);
            console.log("Payment response data:", response.data);
            
            if(response.data.success){
                console.log("Payment successful, creating booking...");
                console.log("Transaction ID:", response.data.data);
                
                const bookingResponse = await CreateBooking({
                    show: showId,
                    seats: selectedSeats,
                    transactionId: response.data.data
                });
                console.log("Booking response:", bookingResponse);
                
                if(bookingResponse.data.success){
                    message.success("Booking successful!");
                    console.log("Navigating to home page...");
                    navigate("/");
                } else {
                    message.error("Booking failed: " + (bookingResponse.data.message || "Unknown error"));
                }
            } else {
                message.error("Payment failed: " + (response.data.message || "Unknown error"));
            }
        }
        catch(err){
            console.error("Payment/Booking error:", err);
            message.error("Payment failed: " + (err.message || "Unknown error"));
        }
    }

    const fetchShowData = useCallback(async ()=>{
        try{
            const response = await getShowDetails(showId);
            setShowDetails(response.data.data);
        }
        catch(err){
            message.error("Failed to load show details!");
        }
    }, [showId]);

    useEffect(()=>{
        if (isAuthenticated) {
            fetchShowData();
        }
    },[isAuthenticated, fetchShowData])

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return  <>
        <Navbar/> 
        {
            showDetails && <div>
                <Row gutter={24}>
                    <Col span={24}>
                        <Card title= {
                            <div>
                                <h1> {showDetails.movie.movieName}</h1>
                                <p>
                                    Theatre : {showDetails.theatre.name}, {showDetails.theatre.address}
                                </p>
                            </div>
                        }
                        extra = {
                            <>
                                <div>
                                    <h3> Show Name : {showDetails.name} </h3>
                                </div>
                                <h4>
                                    Ticket Price : {showDetails.ticketPrice}
                                </h4>
                                <h4>
                                    Total Seats : {showDetails.totalSeats}
                                </h4>
                                <h4>
                                    Available Seats : {showDetails.totalSeats - showDetails.bookedSeats.length}
                                </h4>
                            </>
                        }
                        style={{width:"100%"}}
                        >
                            {getSeats()}

                            {/* Seat Selection Summary */}
                            {selectedSeats.length > 0 && (
                                <div style={{ 
                                    marginTop: '20px', 
                                    padding: '15px', 
                                    backgroundColor: '#f0f8ff', 
                                    borderRadius: '8px',
                                    border: '1px solid #d6e4ff'
                                }}>
                                    <h3 style={{ marginBottom: '10px', color: '#1890ff' }}>
                                        🎫 Booking Summary
                                    </h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <div>
                                            <p style={{ margin: '5px 0', fontSize: '16px' }}>
                                                <strong>Selected Seats:</strong> {selectedSeats.sort((a, b) => parseInt(a) - parseInt(b)).join(', ')}
                                            </p>
                                            <p style={{ margin: '5px 0', fontSize: '16px' }}>
                                                <strong>Number of Seats:</strong> {selectedSeats.length}
                                            </p>
                                            <p style={{ margin: '5px 0', fontSize: '16px' }}>
                                                <strong>Price per Seat:</strong> ₹{showDetails.ticketPrice}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <h2 style={{ color: '#52c41a', margin: '0' }}>
                                                Total: ₹{selectedSeats.length * showDetails.ticketPrice}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Payment Button */}
                            {selectedSeats.length > 0 && (
                                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                    <StripeCheckout 
                                        token={onToken}
                                        stripeKey="pk_test_51Pk5XWKp25HZoc30bcTmozGCabcS6KEKI7isIVopkB8TmzislgHqHIY3fzvxstSTY6bSN6LhQeW3z7oYpkc242Sd008g8PAKBI"
                                        amount={selectedSeats.length * showDetails.ticketPrice * 100} // Stripe expects amount in cents
                                        currency="INR"
                                        name={`${showDetails.movie.movieName} - ${showDetails.name}`}
                                        description={`${selectedSeats.length} seat(s) for ${showDetails.movie.movieName}`}
                                        image="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&h=100&fit=crop"
                                        locale="auto"
                                        allowRememberMe={true}
                                        style={{
                                            backgroundColor: '#52c41a',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '12px 24px',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <button style={{
                                            backgroundColor: '#52c41a',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '12px 24px',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            width: '200px'
                                        }}>
                                            💳 Pay ₹{selectedSeats.length * showDetails.ticketPrice}
                                        </button>
                                    </StripeCheckout>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        }
    </>
}

export default BookShow;


