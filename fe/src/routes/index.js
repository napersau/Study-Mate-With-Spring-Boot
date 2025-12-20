import Home from "../pages/home";
import Login from "../pages/login";
import Layout from "../layout";
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
        ],
      },

      // Admin-only routes
      {
        element: <PrivateRoutesAdmin />,
        children: [
          { path: "admin", element: <AdminHome /> },
          { path: "admin/documents", element: <DocumentAdmin /> },
        ],
      },
    ],
  },
];

export default Routes;