import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const apiCall = async (method, endpoint, options = {}) => {
  const { data, params, headers } = options;

  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      data,        // ✅ IMPORTANT (for POST/PUT)
      params,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    return response.data;

  } catch (error) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Server unreachable");
    }
  }
};

export default apiCall;
