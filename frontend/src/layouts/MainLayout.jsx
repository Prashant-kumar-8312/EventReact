import { Outlet } from "react-router-dom";

import NavBar from "../components/NavBar";

import Footer from "../components/Footer";

const MainLayout = () => {
     
    return (

        <div className="flex min-h-screen flex-col">

            <NavBar />

            <main className="flex-1" >
                <Outlet />
            </main>
            
            <Footer />

        </div>



    );
};

export default MainLayout;