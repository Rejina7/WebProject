import { Routes, Route } from "react-router-dom";
import PublicRoute from "./Routes/PublicRoute.jsx";
import PrivateRoute from "./Routes/PrivateRoute.jsx";

// Public pages
import Landing from "./Pages/Public/Landing.jsx";
import Login from "./Pages/Public/Login.jsx";
import Signup from "./Pages/Public/Signup.jsx";

// Private pages
import Product from "./Pages/Private/Product.jsx";
import ProductList from "./Pages/Private/ProductList.jsx";
import Feedback from "./Pages/Private/Feedback.jsx";

const AppRoutes = () => (
	<Routes>
		{/* Public routes */}
		<Route element={<PublicRoute />}>
			<Route path="/" element={<Landing />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />
		</Route>

		{/* Private routes */}
		<Route element={<PrivateRoute />}>
			<Route path="/product" element={<Product />} />
			<Route path="/products" element={<ProductList />} />
			<Route path="/feedback" element={<Feedback />} />
		</Route>

		{/* Fallback */}
		<Route path="*" element={<Landing />} />
	</Routes>
);

export default AppRoutes;
