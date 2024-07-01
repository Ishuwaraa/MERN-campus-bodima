import axios from "axios";
const baseURL = 'https://campus-bodima-api.vercel.app/';

export default axios.create({ baseURL });

export const axiosPrivate = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})