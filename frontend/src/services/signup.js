import axios from 'axios'
import { User } from 'lucide-react';

const baseurl = "http://localhost:3000"

export const signup = async (email, password) => {
    const response = await axios.post(`${baseurl}/api/users`, {
        email, password
    })
    console.log("SIGNUP RESPONSE", response.data);
    return response.data
}

export const verify = async (email, verificationCode) => {
    const response = await axios.post(`${baseurl}/api/users/verify`, {
        email, verificationCode
    })
    console.log("Sending Verificaiton Code", response.data);
    return response.data
}