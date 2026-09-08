import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";


const AuthContext = createContext(null);

export function AuthProvider({children}) {
     
    const [user , setUser] = useState(null);
    const [loading , setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if(token && storedUser ){
           setUser(JSON.parse(storedUser));

        }
        setLoading(false);
    } ,  [] );

    const login = async (credentials) => {
        try {
            const response = await authApi.login(credentials);
            const { token , user } = response.data;
            localStorage.setItem("token" , token);
            localStorage.setItem("user" , JSON.stringify(user));
            setUser(user);

            return user;
}catch(error){

    console.log("error in login" ,  error);
    throw(error);

}

    }  


const register = async (data) => {
      
    
    const res = await authApi.register(data);
  
    const { token , user: userData } = res.data;



    localStorage.setItem("token" , token);
    localStorage.setItem("user" , JSON.stringify(userData));

    setUser(userData);

    return userData;
};

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
};



const value = {user , login , register , logout , loading};

return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
);

    }

    export function useAuth() {
         
        const context = useContext(AuthContext);

        if(!context ){
            throw new Error("useAuth must be used within an AuthProvider");

        }

        return context;
    }



