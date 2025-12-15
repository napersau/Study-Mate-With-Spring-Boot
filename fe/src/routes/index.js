import Home from "../pages/home";
import Login from "../pages/login";
import Layout from "../layout";
import PrivateRoutes from "../components/PrivateRoutes";
import PrivateRoutesAdmin from "../components/privateRoutesAdmin";
import Register from "../pages/register";
import AdminHome from "../pages/adminHome";
import Flashcards from "../pages/flashcards";
import DeckDetail from "../pages/deckDetail";

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
        ],
      },

      // Admin-only routes
      {
        element: <PrivateRoutesAdmin />,
        children: [
          { path: "admin", element: <AdminHome /> },
        ],
      },
    ],
  },
];

export default Routes;