import Q from 'q';

const checkRequest = req => {
    const { minLat, minLon, maxLat, maxLon } = req.body;

    if (minLat == null ||
        minLon == null ||
        maxLat == null ||
        maxLon == null) {
        return Q.reject(
            `Please check the parameters you're passing.
minLat: ${minLat}
maxLat: ${maxLat}
minLon: ${minLon}
maxLon: ${maxLon}
`);
    }

    if (!isValidLat(minLat) || !isValidLat(maxLat)) {
        return Q.reject('Latitude must be more than -90.0 and less than 90.0. Please check the parameters you\'re passing');
    }

    if (!isValidLon(minLon) || !isValidLon(maxLon)) {
        return Q.reject('Longitude must be more than -180.0 and less than 180.0. Please check the parameters you\'re passing');
    }

    if (!isValidPair(minLat, maxLat)) {
        return Q.reject('minLat must be less than maxLat');
    }

    if (!isValidPair(minLon, maxLon)) {
        return Q.reject('minLon must be less than maxLon');
    }
    return Q.resolve(req);
}

const isValidPair = (min, max) => min <= max;
const isValidLat = lat => -90.0 <= lat && lat <= 90.0;
const isValidLon = lon => -180.0 <= lon && lon <= 180.0;

export default checkRequest;
