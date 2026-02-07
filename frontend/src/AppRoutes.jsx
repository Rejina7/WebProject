import { Routes, Route } from "react-router-dom";
import PublicRoute from "./Routes/PublicRoute.jsx";
import PrivateRoute from "./Routes/PrivateRoute.jsx";

// Public pages (no authentication required)
import Landing from "./Pages/Public/Landing.jsx";
import Login from "./Pages/Public/Login.jsx";
import Signup from "./Pages/Public/Signup.jsx";

// Private/User pages (authentication required)
import Dashboard from "./Pages/Private/Homepage.jsx";
import Homepage from "./Pages/Private/Dashboard.jsx";
import Profile from "./Pages/Private/Profile.jsx";
import Quiz from "./Pages/Private/Quiz.jsx";
import CreateQuiz from "./Pages/Private/CreateQuiz.jsx";

// Admin pages (admin role required)
import AdminHome from "./Pages/Private/AdminHome.jsx";
import AdminDashboard from "./Pages/Private/AdminDashboard.jsx";
import Feedback from "./Pages/Private/Feedback.jsx";



const AppRoutes = () => (
	<Routes>
		{/* Public routes - No authentication required */}
		<Route element={<PublicRoute />}>
			<Route path="/" element={<Landing />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
		</Route>

		{/* User routes - Authentication required */}
		<Route path="/home" element={<PrivateRoute><Homepage /></PrivateRoute>} />
		<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
		<Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
		<Route path="/quiz/:category" element={<PrivateRoute><Quiz /></PrivateRoute>} />
		<Route path="/create-quiz" element={<PrivateRoute><CreateQuiz /></PrivateRoute>} />

		{/* Admin routes - Admin role required */}
		<Route path="/admin/home" element={<PrivateRoute requiredRole="admin"><AdminHome /></PrivateRoute>} />
		<Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
		<Route path="/admin/create-quiz" element={<PrivateRoute requiredRole="admin"><CreateQuiz /></PrivateRoute>} />
		<Route path="/admin/feedback" element={<PrivateRoute requiredRole="admin"><Feedback /></PrivateRoute>} />
	</Routes>
);

export default AppRoutes;
