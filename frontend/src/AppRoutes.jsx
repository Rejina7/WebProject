import { Routes, Route } from "react-router-dom";
import PublicRoute from "./Routes/PublicRoute.jsx";
import PrivateRoute from "./Routes/PrivateRoute.jsx";

// Public pages
import Landing from "./Pages/Public/Landing.jsx";
import Login from "./Pages/Public/Login.jsx";
import Signup from "./Pages/Public/Signup.jsx";
import Homepage from "./Pages/Public/Homepage.jsx";
import Dashboard from "./Pages/Public/Dashboard.jsx";
import Profile from "./Pages/Public/Profile.jsx";
import Quiz from "./Pages/Public/Quiz.jsx";
import CreateQuiz from "./Pages/Public/CreateQuiz.jsx";

// Admin pages
import AdminHome from "./Pages/Private/AdminHome.jsx";
import AdminDashboard from "./Pages/Private/AdminDashboard.jsx";



const AppRoutes = () => (
	<Routes>
		{/* Public routes */}
		<Route element={<PublicRoute />}>
			<Route path="/" element={<Landing />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/home" element={<Homepage />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/quiz/:category" element={<Quiz />} />
			<Route path="/create-quiz" element={<CreateQuiz />} />
		</Route>

		{/* Admin routes - Private */}
		<Route path="/admin/home" element={<PrivateRoute requiredRole="admin"><AdminHome /></PrivateRoute>} />
		<Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
	</Routes>
);

export default AppRoutes;
