import { Outlet, useLocation } from "react-router-dom";
import Header from '../components/header';
import Footer from '../components/footer';

function AppLayout(){
    const location = useLocation();
    
    // Các trang không hiển thị header và footer
    const authPages = ["/login", "/register", "/forgot-password"];
    const isAuthPage = authPages.includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Chỉ hiển thị Header khi không phải trang auth */}
            {!isAuthPage && <Header />}
            
            {/* Main Content */}
            <main className={`flex-grow ${isAuthPage ? '' : 'bg-gray-50'}`}>
                <Outlet />
            </main>
            
            {/* Chỉ hiển thị Footer khi không phải trang auth */}
            {!isAuthPage && <Footer />}
        </div>
    );
}

export default AppLayout;