import axios from 'axios'
const baseurl = "http://localhost:3000"

const getMajors = async () => {
  const res = await axios.get(`${baseurl}/api/majors`)
  return res.data;
}

export { getMajors }