import Home from "../pages/home";
import Login from "../pages/login";
import Layout from "../layout";
import AdminLayout from "../layout/AdminLayout";
import PrivateRoutes from "../components/PrivateRoutes";
import PrivateRoutesAdmin from "../components/privateRoutesAdmin";
import Register from "../pages/register";
import AdminHome from "../pages/adminHome";
import Flashcards from "../pages/flashcards";
import DeckDetail from "../pages/deckDetail";
import Documents from "../pages/documents";
import DocumentList from "../pages/documentList";
import DocumentDetail from "../pages/documentDetail";
import DocumentAdmin from "../pages/documentAdmin";
import UserAdmin from "../pages/userAdmin";
import FlashcardsAdmin from "../pages/flashcardsAdmin";
import ExamList from "../pages/exams";
import ExamDetail from "../pages/examDetail";
import Courses from "../pages/courses";
import CourseDetail from "../pages/courseDetail";
import CourseAdmin from "../pages/courseAdmin";
import ExamAdmin from "../pages/examAdmin";
import ProfilePage from "../pages/profile";
import PaymentSuccess from "../pages/paymentSuccess";
import OrderHistory from "../pages/orderHistory";

const Routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      // Các route công khai
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        // VNPay redirect về URL này sau khi thanh toán
        path: "payment-success",
        element: <PaymentSuccess />,
      },

      // Các route yêu cầu đăng nhập
      {
        element: <PrivateRoutes />,
        children: [
          { path: "home", element: <Home /> },
          { path: "flashcards", element: <Flashcards /> },
          { path: "decks/:id", element: <DeckDetail /> },
          { path: "documents", element: <Documents /> },
          { path: "documents/:category", element: <DocumentList /> },
          { path: "documents/:category/:documentId", element: <DocumentDetail /> },
          { path: "exams", element: <ExamList /> },
          { path: "exams/:examId", element: <ExamDetail /> },
          { path: "courses", element: <Courses /> },
          { path: "courses/:courseId", element: <CourseDetail /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "order-history", element: <OrderHistory /> },
        ],
      },

      // Admin-only routes with AdminLayout
      {
        element: <PrivateRoutesAdmin />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "admin", element: <AdminHome /> },
              { path: "admin/users", element: <UserAdmin /> },
              { path: "admin/flashcards", element: <FlashcardsAdmin /> },
              { path: "admin/documents", element: <DocumentAdmin /> },
              { path: "admin/courses", element: <CourseAdmin /> },
              { path: "admin/exams", element: <ExamAdmin /> },
            ],
          },
        ],
      },
    ],
  },
];

export default Routes;