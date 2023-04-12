import axios from "axios";

const instance = axios.create({
    baseURL: 'https://serpapi.com/search.json?'
})

export default instance;