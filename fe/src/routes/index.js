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
            ],
          },
        ],
      },
    ],
  },
];

export default Routes;