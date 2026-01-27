import { Routes, Route } from "react-router-dom";
import Login from "../Pages/Public/Login";
import Register from "../Pages/Public/Signup";
import Homepage from "../Pages/Public/Homepage";


const PublicRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/homepage" element={<Homepage />} />
  </Routes>
);

export default PublicRoutes;
