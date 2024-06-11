import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosClient = axios.create({
  baseURL: process.env.REACT_NATIVE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor to set the Authorization headera
axiosClient.interceptors.request.use(
  async (config) => {
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem("token");

    // If the token exists, set the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config, response } = error;

    if (response && response.status === 401) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    }

    // Retry the request if it's a 429 error (Too Many Requests)
    if (response && response.status === 429) {
      // Exponential backoff retry logic
      const delay = Math.pow(2, config.retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Retry the request
      return axiosClient(config);
    }

    // If not a 429 error, reject with the original error
    return Promise.reject(error);
  }
);

export default axiosClient;
