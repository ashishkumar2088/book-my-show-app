import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserBookings, cancelBooking } from "../../calls/bookings";
import { Card, Row, Col, message, Button, Modal, Spin, Empty } from "antd";
import Navbar from "../../Components/ Navbar/Navbar";
import { DeleteOutlined, CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import moment from "moment";

function UserBookings() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('token');

    // Authentication check and redirect
    useEffect(() => {
        if (!isLoggedIn) {
            message.warning("Please login to view your bookings!");
            navigate('/login');
            return;
        }
        fetchUserBookings();
    }, [isLoggedIn, navigate]);

    const fetchUserBookings = async () => {
        try {
            setLoading(true);
            const response = await getUserBookings();
            
            if (response && response.data && response.data.success) {
                setBookings(response.data.data);
            } else {
                message.error("Failed to fetch bookings");
                setBookings([]);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            message.error("Failed to load bookings");
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (booking) => {
        setSelectedBooking(booking);
        setIsModalVisible(true);
    };

    const confirmCancelBooking = async () => {
        if (!selectedBooking) return;

        try {
            setCancelLoading(true);
            const response = await cancelBooking(selectedBooking._id);
            
            if (response && response.data && response.data.success) {
                message.success("Booking cancelled successfully!");
                // Refresh the bookings list
                fetchUserBookings();
            } else {
                message.error(response?.data?.message || "Failed to cancel booking");
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
            message.error("Failed to cancel booking");
        } finally {
            setCancelLoading(false);
            setIsModalVisible(false);
            setSelectedBooking(null);
        }
    };

    const formatDate = (dateString) => {
        return moment(dateString).format('DD MMM YYYY');
    };

    const formatTime = (timeString) => {
        return timeString;
    };

    const getBookingStatus = (showDate) => {
        const today = moment();
        const showDateMoment = moment(showDate);
        
        if (showDateMoment.isBefore(today, 'day')) {
            return { status: 'Completed', color: '#52c41a' };
        } else if (showDateMoment.isSame(today, 'day')) {
            return { status: 'Today', color: '#1890ff' };
        } else {
            return { status: 'Upcoming', color: '#faad14' };
        }
    };

    // Don't render if not authenticated
    if (!isLoggedIn) {
        return null;
    }

    return (
        <>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ color: '#1890ff', marginBottom: '10px' }}>
                        🎫 My Bookings
                    </h1>
                    <p style={{ color: '#666', fontSize: '16px' }}>
                        View and manage your movie bookings
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Spin size="large" />
                        <p style={{ marginTop: '20px' }}>Loading your bookings...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <Empty
                        description="No bookings found"
                        style={{ marginTop: '50px' }}
                    >
                        <Button type="primary" onClick={() => navigate('/')}>
                            Browse Movies
                        </Button>
                    </Empty>
                ) : (
                    <Row gutter={[16, 16]}>
                        {bookings.map((booking) => {
                            const status = getBookingStatus(booking.show.date);
                            const totalAmount = booking.seats.length * booking.show.ticketPrice;
                            
                            return (
                                <Col xs={24} sm={12} lg={8} key={booking._id}>
                                    <Card
                                        hoverable
                                        style={{ 
                                            height: '100%',
                                            border: `2px solid ${status.color}20`,
                                            borderRadius: '12px'
                                        }}
                                        bodyStyle={{ padding: '20px' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                            <div>
                                                <h3 style={{ margin: '0 0 10px 0', color: '#1890ff' }}>
                                                    {booking.show.movie.movieName}
                                                </h3>
                                                <div style={{ 
                                                    display: 'inline-block',
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    backgroundColor: `${status.color}20`,
                                                    color: status.color,
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {status.status}
                                                </div>
                                            </div>
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleCancelBooking(booking)}
                                                disabled={status.status === 'Completed'}
                                                style={{ padding: '4px' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                                                <EnvironmentOutlined style={{ marginRight: '8px' }} />
                                                {booking.show.theatre.name}
                                            </p>
                                            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                                                <CalendarOutlined style={{ marginRight: '8px' }} />
                                                {formatDate(booking.show.date)}
                                            </p>
                                            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                                                <ClockCircleOutlined style={{ marginRight: '8px' }} />
                                                {formatTime(booking.show.time)}
                                            </p>
                                        </div>

                                        <div style={{ 
                                            backgroundColor: '#f5f5f5', 
                                            padding: '10px', 
                                            borderRadius: '8px',
                                            marginBottom: '15px'
                                        }}>
                                            <p style={{ margin: '5px 0', fontSize: '14px' }}>
                                                <strong>Seats:</strong> {booking.seats.sort((a, b) => parseInt(a) - parseInt(b)).join(', ')}
                                            </p>
                                            <p style={{ margin: '5px 0', fontSize: '14px' }}>
                                                <strong>Total Amount:</strong> ₹{totalAmount}
                                            </p>
                                            <p style={{ margin: '5px 0', fontSize: '12px', color: '#999' }}>
                                                <strong>Booking ID:</strong> {booking._id}
                                            </p>
                                        </div>

                                        {status.status !== 'Completed' && (
                                            <div style={{ textAlign: 'center' }}>
                                                <Button
                                                    type="primary"
                                                    danger
                                                    size="small"
                                                    onClick={() => handleCancelBooking(booking)}
                                                >
                                                    Cancel Booking
                                                </Button>
                                            </div>
                                        )}
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}

                {/* Cancel Confirmation Modal */}
                <Modal
                    title="Cancel Booking"
                    open={isModalVisible}
                    onOk={confirmCancelBooking}
                    onCancel={() => {
                        setIsModalVisible(false);
                        setSelectedBooking(null);
                    }}
                    confirmLoading={cancelLoading}
                    okText="Yes, Cancel"
                    cancelText="No, Keep"
                >
                    {selectedBooking && (
                        <div>
                            <p>Are you sure you want to cancel your booking for:</p>
                            <div style={{ 
                                backgroundColor: '#f5f5f5', 
                                padding: '15px', 
                                borderRadius: '8px',
                                margin: '15px 0'
                            }}>
                                <p><strong>Movie:</strong> {selectedBooking.show.movie.movieName}</p>
                                <p><strong>Theater:</strong> {selectedBooking.show.theatre.name}</p>
                                <p><strong>Date:</strong> {formatDate(selectedBooking.show.date)}</p>
                                <p><strong>Time:</strong> {formatTime(selectedBooking.show.time)}</p>
                                <p><strong>Seats:</strong> {selectedBooking.seats.sort((a, b) => parseInt(a) - parseInt(b)).join(', ')}</p>
                            </div>
                            <p style={{ color: '#ff4d4f' }}>
                                <strong>Note:</strong> This action cannot be undone.
                            </p>
                        </div>
                    )}
                </Modal>
            </div>
        </>
    );
}

export default UserBookings; 