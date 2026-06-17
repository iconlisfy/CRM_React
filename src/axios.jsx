import axios from "axios";
import store from "./Store";
import config from "./base";
import { showDialogAction } from "./Actions";



const axiosInstance = axios.create({
  baseURL: config.api_url,
});



axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state?.token;
    console.log('Attaching token:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => {
    const msg = response.data?.Message || response.data?.message;

    if (msg?.toLowerCase().includes('token is expired')) {
      console.log('Token Expired  Logging Out');

      store.dispatch({ type: 'Logout' });
      store.dispatch(showDialogAction());

      return Promise.reject(new Error('Session Expired'));
    }

    return response;
  },
  (error) => {
    console.log('Axios Error Response:', error.response?.data);
    if (error.response?.status === 401) {
      console.log('401 Unauthorized  Logging Out');

      store.dispatch({ type: 'Logout' });
      store.dispatch(showDialogAction());

      return Promise.reject(new Error('Session Expired'));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;