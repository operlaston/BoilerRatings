import axios from "axios"

const baseurl = 'http://localhost:3000'

const sendReport = async (page, reportContent) => {
    const response = await axios.post(`${baseurl}/api/pagereports`, {page, reportContent})
    return response.data
}

const getReports = async () => {
    const response = await axios.get(`${baseurl}/api/pagereports/`)
    return response.data
}

const deletePageReport = async(id) => {
    const response = await axios.delete(`${baseurl}/api/pagereports/${id}`)
    return response.data
}

export { sendReport, getReports, deletePageReport }