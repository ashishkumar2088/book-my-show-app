import { axiosInstance } from ".";


export async function MakePayment(data){
    console.log("Make an API call with data",data);

    try{
         const response = await axiosInstance.post("http://localhost:8000/payment",{
        token:data.token,
        amount:data.amount,
        });

       return response;
    }
    catch(err){
        console.error("Payment API error:", err);
        return err.response;
    }
}

export async function CreateBooking(data){
    console.log("Make an API call with data",data);

    try{
         const response = await axiosInstance.post("http://localhost:8000/bookings",{
        show:data.show,
        seats:data.seats,
        transactionId:data.transactionId
        });

       return response;
    }
    catch(err){
        console.error("Booking API error:", err);
        return err.response;
    }
}

export async function getUserBookings(){
    console.log("Fetching user bookings");

    try{
         const response = await axiosInstance.get("http://localhost:8000/bookings");
         return response;
    }
    catch(err){
        console.error("Get user bookings error:", err);
        return err.response || { data: { success: false, message: "Failed to fetch bookings" } };
    }
}

export async function cancelBooking(bookingId){
    console.log("Cancelling booking:", bookingId);

    try{
         const response = await axiosInstance.delete(`http://localhost:8000/bookings/${bookingId}`);
         return response;
    }
    catch(err){
        console.error("Cancel booking error:", err);
        return err.response || { data: { success: false, message: "Failed to cancel booking" } };
    }
}