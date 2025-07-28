
const { makePayment, createBooking, getUserBookings, cancelBooking } = require("../Controllers/booking.controllers");
const { verfiyToken, verifyAdmin } = require("../Middlewares/auth.middleware");


module.exports = (app)=>{

    app.post("/payment",[verfiyToken],makePayment);

    app.post("/bookings",[verfiyToken],createBooking);
    
    app.get("/bookings",[verfiyToken],getUserBookings);
    
    app.delete("/bookings/:bookingId",[verfiyToken],cancelBooking);

}