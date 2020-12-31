import _ from 'lodash';
import assert from 'assert';
import Q from 'q';
import getBox from './../src/api';
import testConfig from './test-config';

describe('OSM API', () => {
    const randomPair = (name, size, min, max) => {
        const first = Math.random() * (max - min) + min;
        let result = {};
        result[`min${name}`] = first;
        result[`max${name}`] = first + size;

        return result;
    };

    const testCases = [
        {
            ...randomPair('Lat', 0.001, -90, 90),
            ...randomPair('Lon', 0.001, -180, 180),
            empty: true,
        },
        {
            ...randomPair('Lat', 0.01, -90, 90),
            ...randomPair('Lon', 0.01, -180, 180),
            empty: true,
        },
        {
            ...randomPair('Lat', 0.1, -90, 90),
            ...randomPair('Lon', 0.1, -180, 180),
            empty: true,
        },
        {
            minLon: 13.3819,
            maxLon: 13.393,
            minLat: 52.5021,
            maxLat: 52.514,
            empty: false
        },
        {
            minLon: 0.0062928,
            maxLon: 0.1073928,
            minLat: 52.2490255,
            maxLat: 53.2700455,
            empty: false,
        },
        {
            minLon: 7.0191821,
            maxLon: 7.037485,
            minLat: 49.1785426,
            maxLat: 49.2793101,
            empty: false,
        }
    ];

    _.forEach(testCases, testCase => {
        it(`should return elements`, () => {
            return Q()
                .then(() => getBox({ ...testConfig, ...testCase }))
                .then(actual => {
                    assert.equal(_.isEmpty(actual.elements), testCase.empty, `Expected array of elements to be empty: ${testCase.empty}, but was: \n${actual.elements.length}\ntestCase params: ${JSON.stringify(testCase)}`);
                });
        });
    });
});
