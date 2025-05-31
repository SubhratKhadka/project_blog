import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import GeneralPost from "./Components/GeneralPost";
import Hero from "./Components/Hero";
import Create from "./Components/Create";
import Login from "./Components/Login";
import Header from "./Components/Header";

import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./ContextProvider/UserContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Profile from "./Components/Profile";
import IndivialBlog from "./Components/IndividualBlog";

// for Pages with regular header
const HeaderLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => ({ message: "Hello routing" }),
    element: (
      <ProtectedRoute>
        <Hero />
      </ProtectedRoute>
    ),
  },
  {
    element: <HeaderLayout />, // Header included
    children: [
      {
        path: "/blog/:blogId",
        element: <IndivialBlog />,
      },

      {
        path: "/create",
        element: (
          <ProtectedRoute>
            <Create />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <Login />
          </GoogleOAuthProvider>
        ),
      },
      {
        path: "/blogs",
        children: [
          {
            path: "trending",
            element: (
              <ProtectedRoute>
                <GeneralPost />
              </ProtectedRoute>
            ),
          },
          {
            path: "latest",
            element: (
              <ProtectedRoute>
                <GeneralPost />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/profile/:userId",
        element: (
          // <ProtectedRoute>
          <Profile />
          // </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
