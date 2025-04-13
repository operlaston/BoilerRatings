import axios from "axios"

const baseurl = 'http://localhost:3000'

const sendReport = async (page, reportContent) => {
    const response = await axios.post(`${baseurl}/api/pagereports`, {page, reportContent})
}

export { sendReport }