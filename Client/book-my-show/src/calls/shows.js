import { publicAxiosInstance } from ".";

export async function getShowsForAMovie(movieId,date){
    try{
         const response = await publicAxiosInstance
         .get(`http://localhost:8000/movies/${movieId}/shows?date=${date}`);

       return response;
    }
    catch(err){
        console.error("Get shows error:", err);
        return err.response || { data: { success: false, message: "Failed to fetch shows" } };
    }
}

export async function getShowDetails(showId){
    try{
         const response = await publicAxiosInstance
         .get(`http://localhost:8000/shows/${showId}`);

       return response;
    }
    catch(err){
        console.error("Get show details error:", err);
        return err.response || { data: { success: false, message: "Failed to fetch show details" } };
    }
}




