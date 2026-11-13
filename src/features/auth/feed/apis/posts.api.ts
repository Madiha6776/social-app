import axios from "axios";


export async function getPosts(){

const token= localStorage.getItem("token");
const {data}=await axios.get(`${import.meta.env.VITE_BASE_URL}/posts`, {
    headers: {  "AUTHORIZATION": `Bearer ${token}` }
});

return data;
}