import axios from 'axios'
import { User } from 'lucide-react';

const baseurl = "http://localhost:3000"

export const signup = async (email, password) => {
    const response = await axios.post(`${baseurl}/api/users`, {
        email, password
    })
    return response.data
}

export const verify = async (email, code) => {
    const response = await axios.post(`${baseurl}/api/users/verify`, {
        email, code
    })
    console.log(response)
    return response.data
}