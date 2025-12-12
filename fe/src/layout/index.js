import { Outlet, useLocation } from "react-router-dom";
import Header from '../components/header';
import Footer from '../components/footer';

function AppLayout(){
    const location = useLocation();
    
    // Các trang authentication giờ cũng có header và footer
    const authPages = ["/login", "/register", "/forgot-password"];
    const isAuthPage = authPages.includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header hiển thị cho tất cả các trang */}
            <Header />
            
            {/* Main Content */}
            <main className={`flex-grow ${isAuthPage ? '' : 'bg-gray-50'}`}>
                <Outlet />
            </main>
            
            {/* Footer hiển thị cho tất cả các trang */}
            <Footer />
        </div>
    );
}

export default AppLayout;