# BookMyShow - Movie Booking Application

A full-stack movie booking application built with React.js (Frontend) and Node.js/Express (Backend) with MongoDB database.

## 🎬 Features

- **User Authentication**: Register, Login, and Password Reset functionality
- **Movie Browsing**: View all available movies with search functionality
- **Movie Details**: Detailed movie information with show times
- **Seat Booking**: Interactive seat selection with real-time availability
- **Payment Integration**: Stripe payment gateway for ticket booking
- **Booking Management**: View and cancel existing bookings
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface
- **Ant Design** - UI components
- **React Router** - Navigation
- **Axios** - HTTP client
- **Moment.js** - Date handling
- **Stripe Checkout** - Payment processing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email functionality
- **Stripe** - Payment processing

## 📁 Project Structure

```
BookMyShowApp/
├── Client/                 # React Frontend
│   └── book-my-show/
│       ├── src/
│       │   ├── pages/     # Page components
│       │   ├── Components/ # Reusable components
│       │   ├── calls/     # API service layer
│       │   └── App.js     # Main app component
│       └── public/        # Static assets
└── Server/                # Node.js Backend
    ├── src/
    │   ├── Models/        # Database models
    │   ├── Controllers/   # Business logic
    │   ├── Routes/        # API endpoints
    │   ├── Middlewares/   # Authentication, validation
    │   └── Utils/         # Helper functions
    └── server.js          # Main server file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup

1. **Navigate to Server directory:**
   ```bash
   cd BookMyShowApp/Server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```env
   PORT=8000
   DB_URL=mongodb://localhost:27017/bookmyshow
   JWT_SECRET=your-secret-key-here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   ```

4. **Add sample movies:**
   ```bash
   node addSampleMovies.js
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to Client directory:**
   ```bash
   cd BookMyShowApp/Client/book-my-show
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

## 🌐 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/forget-password` - Password reset request
- `POST /auth/reset-password` - Password reset

### Movies
- `GET /movies` - Get all movies
- `GET /movies/:id` - Get movie by ID

### Shows
- `GET /shows/movie/:movieId` - Get shows for a movie
- `GET /shows/:showId` - Get show details

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings/user` - Get user bookings
- `DELETE /bookings/:bookingId` - Cancel booking

### Payments
- `POST /payments` - Process payment

## 🎯 Usage

1. **Home Page**: Browse available movies
2. **Movie Details**: Click on a movie to see details and show times
3. **Booking**: Select seats and proceed to payment
4. **User Account**: Register/Login to manage bookings
5. **My Bookings**: View and cancel existing bookings

## 🔧 Environment Variables

Create a `.env` file in the Server directory with:

```env
PORT=8000
DB_URL=mongodb://localhost:27017/bookmyshow
JWT_SECRET=your-secret-key-here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

## 📱 Screenshots

[Add screenshots of your application here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

[Your Name]

## 📞 Contact

- Email: [your-email@example.com]
- GitHub: [your-github-username]

---

**Note**: This is an academic project for educational purposes. 