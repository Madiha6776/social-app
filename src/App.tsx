import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./components/layout/Layout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Feed from "./features/auth/feed/Feed";
import UserProfile from "./features/users/UserProfile";
import PostDetails from "./features/posts/componets/PostDetails";
import ProtectedRoute from "./Routes/ProtectedRoute";
import MainRouting from "./Routes/MainRouting";
import Loading from "./components/ui/Loading";
import Settings from "./features/settings/Settings";
import Profile from "./features/profile/Profile";

// ===== Lazy Loading =====
const Notifications = lazy(
  () => import("./features/notifications/Notifications"),
);

const queryClient = new QueryClient();

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <MainRouting>
          <Home />
        </MainRouting>
      ),
    },
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "feed",
          element: (
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile/:userId",
          element: (
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "settings",
          element: (
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          ),
        },
        {
          path: "/postdetails/:id",
          element: (
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "notifications",
          element: (
            <ProtectedRoute>
              <Suspense fallback={<Loading />}>
                <Notifications />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
