import axios from 'axios'

export const signup = async (email, password) => {
    const response = await axios.post('/api/users', {
        email, password
    })
    return response.data
}