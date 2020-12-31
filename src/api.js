import axios from 'axios';
import Q from 'q';

const getBox = ({ host, basePath, minLon, maxLon, minLat, maxLat }) => {
    return axios.get(`${host}${basePath}?bbox=${[minLon, minLat, maxLon, maxLat]}`)
        .then(response => response.data)
        .catch(err => {
            console.log(err);
            throw new Error(`An error occured on getting bbox: ${err}`);
        });
}

export default getBox;
