const BookingsModel = require('../Models/Booking.model');
const ShowsModel = require('../Models/Show.model');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const makePayment = async (req,res)=>{


    try{
        
    const {token,amount} = req.body;

    console.log(token, amount);


    const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
    });

    const paymentIntent = await stripe.paymentIntents.create({
        customer:customer.id,
        amount:amount * 100, // Convert to cents for Stripe
        currency:'inr', // Use INR instead of USD
        payment_method_types:['card']
    })

    
    const transactionid = paymentIntent.id;

    return res.send({
        success:true,
        message:"Payment Successful",
        data:transactionid
    })

    }

    catch(err){
        console.error("Payment error:", err);
        return res.status(500).send({
            success: false,
            message: "Payment failed",
            error: err.message
        });
    }



}


const createBooking = async (req,res)=>{


    const {show,seats,transactionId} = req.body;
    const userId = req.userDetails._id;


    try{

        const newBooking = new BookingsModel({show,seats,transactionId,user:userId});

        const newBookingResponse = await newBooking.save();

        const showDetails = await ShowsModel.findById(show);

        const updatedBookedSeats = [...showDetails.bookedSeats, ...seats];

        await ShowsModel.findByIdAndUpdate(show,{bookedSeats:updatedBookedSeats});


        return res.send({
            success:true,
            message:`Booking successfully created with BookingId: ${newBookingResponse._id}`,
            data:newBookingResponse
        })
        

    }catch(err){
        console.error("Booking error:", err);
        return res.status(500).send({
            success: false,
            message: "Booking failed",
            error: err.message
        });
    }
    


}

const getUserBookings = async (req,res)=>{
    const userId = req.userDetails._id;

    try{
        const userBookings = await BookingsModel.find({user: userId})
            .populate('show')
            .populate({
                path: 'show',
                populate: {
                    path: 'movie',
                    model: 'movies'
                }
            })
            .populate({
                path: 'show',
                populate: {
                    path: 'theatre',
                    model: 'theatres'
                }
            })
            .sort({createdAt: -1}); // Most recent first

        return res.send({
            success: true,
            message: "User bookings fetched successfully",
            data: userBookings
        });

    }catch(err){
        console.error("Get user bookings error:", err);
        return res.status(500).send({
            success: false,
            message: "Failed to fetch user bookings",
            error: err.message
        });
    }
}

const cancelBooking = async (req,res)=>{
    const {bookingId} = req.params;
    const userId = req.userDetails._id;

    try{
        // Find the booking and verify it belongs to the user
        const booking = await BookingsModel.findOne({_id: bookingId, user: userId});
        
        if(!booking){
            return res.status(404).send({
                success: false,
                message: "Booking not found or unauthorized"
            });
        }

        // Get the show details to update booked seats
        const showDetails = await ShowsModel.findById(booking.show);
        
        if(showDetails){
            // Remove the booked seats from the show
            const updatedBookedSeats = showDetails.bookedSeats.filter(
                seat => !booking.seats.includes(seat)
            );
            
            await ShowsModel.findByIdAndUpdate(booking.show, {
                bookedSeats: updatedBookedSeats
            });
        }

        // Delete the booking
        await BookingsModel.findByIdAndDelete(bookingId);

        return res.send({
            success: true,
            message: "Booking cancelled successfully"
        });

    }catch(err){
        console.error("Cancel booking error:", err);
        return res.status(500).send({
            success: false,
            message: "Failed to cancel booking",
            error: err.message
        });
    }
}

module.exports={
    makePayment,
    createBooking,
    getUserBookings,
    cancelBooking
}