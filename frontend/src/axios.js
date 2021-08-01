import axios from "axios";
axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: "https://trek-n-travel.herokuapp.com",
});
export default instance;
