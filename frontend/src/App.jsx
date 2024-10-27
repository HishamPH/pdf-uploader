import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  console.log("private router");
  const { userInfo } = useSelector((state) => state.user);
  if (userInfo) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

const PublicRoute = () => {
  console.log("public router");
  const { userInfo } = useSelector((state) => state.user);
  if (!userInfo) {
    return <Outlet />;
  } else {
    return <Navigate to="/home" />;
  }
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<PublicRoute />}>
        <Route index element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
