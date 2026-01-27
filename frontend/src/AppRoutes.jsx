import { Routes, Route } from "react-router-dom";
import PublicRoute from "./Routes/PublicRoute.jsx";
import PrivateRoute from "./Routes/PrivateRoute.jsx";

// Public pages
import Landing from "./Pages/Public/Landing.jsx";
import Login from "./Pages/Public/Login.jsx";
import Signup from "./Pages/Public/Signup.jsx";
import Homepage from "./Pages/Public/Homepage.jsx";
import Dashboard from "./Pages/Public/Dashboard.jsx";



const AppRoutes = () => (
	<Routes>
		{/* Public routes */}
		<Route element={<PublicRoute />}>
			<Route path="/" element={<Landing />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/home" element={<Homepage />} />
		</Route>
	</Routes>
);

export default AppRoutes;
