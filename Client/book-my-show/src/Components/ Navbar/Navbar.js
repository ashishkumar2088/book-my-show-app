
import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
const { Header } = Layout;

function Navbar(){
    const navigate = useNavigate();
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('token');
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    };

    const navItems = [
        {
            key: 'home',
            label: <Link to="/" style={{ color: 'white' }}>Home</Link>
        },
        ...(isLoggedIn ? [
            {
                key: 'bookings',
                label: <Link to="/bookings" style={{ color: 'white' }}>My Bookings</Link>
            },
            {
                key: 'logout',
                label: <Button type="text" style={{ color: 'white' }} onClick={handleLogout}>Logout</Button>
            }
        ] : [
            {
                key: 'login',
                label: <Link to="/login" style={{ color: 'white' }}>Login</Link>
            },
            {
                key: 'register',
                label: <Link to="/register" style={{ color: 'white' }}>Register</Link>
            }
        ])
    ];

    return (
        <Layout>
            <Header 
                className='d-flex'
                style={{
                    position: "sticky",
                    top: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h3 
                            className='text-white m-0' 
                            style={{ 
                                marginRight: '20px',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                        > 
                            Book My Show 
                        </h3>
                    </Link>
                </div>
                
                <Menu
                    theme="dark"
                    mode="horizontal"
                    items={navItems}
                    style={{ 
                        flex: 1, 
                        justifyContent: 'flex-end',
                        backgroundColor: 'transparent',
                        border: 'none'
                    }}
                />
            </Header>
        </Layout>
    );
}

export default Navbar;