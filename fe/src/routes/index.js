import Home from "../pages/home";
import Login from "../pages/login";
import Layout from "../layout";
import PrivateRoutes from "../components/PrivateRoutes";
import Register from "../pages/register";

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
        ],
      },

      // Admin-only routes (uncomment when admin pages are ready)
      // {
      //   element: <PrivateRoutesAdmin />,
      //   children: [
      //     { path: "admin", element: <AdminHome /> },
      //   ],
      // },
    ],
  },
];

export default Routes;