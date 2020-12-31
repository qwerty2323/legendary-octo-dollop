import osmtogeojson from 'osmtogeojson';
import Q from 'q';
import getBox from './api';
import config from './config';
import checkRequest from './checkRequest';

const handler = (req, res) => {
    return Q()
        .then(() => checkRequest(req))
        .then(() => getBox({ ...config, ...req.body }))
        .then(response => {
            //console.log(response)
            return response;
        })
        .then(osmtogeojson)
        .then(geojson => {
            res.status(200);
            res.json(geojson);
        })
        .catch(err => {
            res.status(400);
            res.send(`An error has occured: ${err}`);
            return Q.reject(err)
        });
}

export default handler
