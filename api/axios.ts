import axios from 'axios';

export const axiosPrivate= axios.create({
    baseURL:process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials:true
})

