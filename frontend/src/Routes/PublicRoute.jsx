import { Routes, Route } from "react-router-dom";
import Login from "../Pages/Public/Login";
import Register from "../Pages/Public/Register";

const PublicRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Routes>
);

export default PublicRoutes;
