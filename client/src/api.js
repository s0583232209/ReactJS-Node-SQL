import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      window.location.href = "/login";
    } else if (status === 403) {
      window.location.href = "/access_denied";
    } else if (status === 404) {
      window.location.href = "/not-found";
    }
    return Promise.reject(error);
  },
);

export default api;
