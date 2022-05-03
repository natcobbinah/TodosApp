import axios from "axios";
import { useEffect, useState } from "react";

const UseApi = (endpoint) => {
    const[data, setData] = useState([]);

    useEffect(() => {
        getData();
    },[])

    const getData = async () => {
        const response = await axios.get(endpoint);
        setData(response.data);
    }

    return data;
}

export default UseApi;