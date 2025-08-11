import a from "axios";

const axios = a.create({
    // axios configuration
    baseURL: "http://localhost:3000/api/v1",
    withCredentials: true // send cookies with the request, so server has json web token
})

export default axios;