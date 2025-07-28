import { axiosInstance } from ".";


export async function RegisterUser(data){
    console.log("Make an API call with data",data);

    try{
         const response = await axiosInstance.post("http://localhost:8000/register",{
        name:data.name,
        email:data.email,
        password:data.password
        });

       return response;
    }
    catch(err){
        console.error("Register error:", err);
        return err.response || { data: { success: false, message: "Network error occurred" } };
    }
}



export async function LoginUser(data){
    console.log("Make an API call with data",data);

    try{
         const response = await axiosInstance.post("http://localhost:8000/login",{
        email:data.email,
        password:data.password
        });

       return response;
    }
    catch(err){
        console.error("Login error:", err);
        return err.response || { data: { success: false, message: "Network error occurred" } };
    }
}

export async function ForgetPasswordAPI(data){
    console.log("Make an API call with data",data);

    try{
         const response = await axiosInstance.post("http://localhost:8000/forget",{
        email:data.email
        });

       return response;
    }
    catch(err){
        console.error("Forget password error:", err);
        return err.response || { data: { success: false, message: "Network error occurred" } };
    }
}


export async function ResetPassword(data){
    console.log("Make an API call with data",data);

    try{
         const response = await axiosInstance.post("http://localhost:8000/reset",{
        otp:data.otp,
        password:data.password
        });

       return response;
    }
    catch(err){
        console.error("Reset password error:", err);
        return err.response || { data: { success: false, message: "Network error occurred" } };
    }
}



