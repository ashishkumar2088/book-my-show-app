import { publicAxiosInstance } from ".";

export async function getAllMovies(){
    try{
         const response = await publicAxiosInstance.get("http://localhost:8000/movies");

       return response;
    }
    catch(err){
        console.error("Get movies error:", err);
        return err.response || { data: { success: false, message: "Failed to fetch movies" } };
    }
}


export async function getMovieById(id){
    try{
         const response = await publicAxiosInstance.get(`http://localhost:8000/movies/${id}`);

       return response;
    }
    catch(err){
        console.error("Get movie by ID error:", err);
        return err.response || { data: { success: false, message: "Failed to fetch movie" } };
    }
}