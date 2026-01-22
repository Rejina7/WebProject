// import React, { Suspense } from "react";
// import { Navigate, Route, Routes } from "react-router-dom";

// const UserLogin = React.lazy(() => import("../Pages/Public/Login"));
// const UserRegister = React.lazy(() => import("../pages/public/Register"));

// const PublicRoutes = () => {
//   return (
//     <>
//       <Suspense fallback={<div>.....loading</div>}>
//         <Routes>
//           <Route path="/login" element={<UserLogin />} />
//           <Route path="/register" element={<UserRegister />} />
//           <Route path="*" element={<Navigate to="/login" />} />
//         </Routes>
//       </Suspense>
//     </>
//   );
// };

// export default PublicRoutes;

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
