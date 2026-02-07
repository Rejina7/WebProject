import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import "../../css/admin-dashboard-dark.css";
import "../../css/feedback.css";
import { getStoredUser } from "../../Utils/authStorage";
import apiCall from "../../Utils/api";

function Feedback() {
	const [feedback, setFeedback] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const userData = getStoredUser();
		if (!userData) {
			navigate("/login");
			return;
		}

		if (userData.role !== "admin") {
			navigate("/home");
			return;
		}

		loadFeedback();
	}, [navigate]);

	const loadFeedback = async () => {
		try {
			setLoading(true);
			setError("");

			const data = await apiCall("GET", "/feedback");
			setFeedback(data.feedback || []);
		} catch (err) {
			setError(err.message || "Failed to load feedback.");
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (value) => {
		if (!value) return "-";
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return "-";
		return date.toLocaleString();
	};

	if (loading) {
		return <div className="admin-container">Loading...</div>;
	}

	return (
		<div className="admin-container">
			<AdminSidebar />
			<div className="admin-main-content feedback-page">
				<header className="admin-header">
					<h1>Feedback</h1>
					<button className="add-btn" onClick={loadFeedback}>
						Refresh
					</button>
				</header>

				<main className="admin-content">
					<section className="statistics-section">
						<h2>Quiz Feedback ({feedback.length})</h2>
						{error && <p style={{ color: "#ff9b9b" }}>{error}</p>}

						{feedback.length === 0 ? (
							<p style={{ color: "#cccccc" }}>No feedback yet.</p>
						) : (
							<div className="stats-table">
								<table>
									<thead>
										<tr>
											<th>User</th>
											<th>Email</th>
											<th>Quiz Category</th>
											<th>Quiz Title</th>
											<th>Comment</th>
											<th>Date</th>
										</tr>
									</thead>
									<tbody>
										{feedback.map((item) => (
											<tr key={item.id}>
												<td>{item.username || "-"}</td>
												<td>{item.email || "-"}</td>
												<td>{item.quizCategory || "-"}</td>
												<td>{item.quizTitle || "-"}</td>
												<td>{item.comment || "-"}</td>
												<td>{formatDate(item.createdAt)}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</section>
				</main>
			</div>
		</div>
	);
}

export default Feedback;
