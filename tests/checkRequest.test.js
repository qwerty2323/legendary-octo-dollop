import _ from 'lodash';
import assert from 'assert';
import Q from 'q';
import checkRequest from '../src/checkRequest';

describe('checkRequest', () => {
    const randomValue = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    const latCut = randomValue(-90, 90);
    const lonCut = randomValue(-180, 180);

    describe('#valid input', () => {
        const params = {
            body: {
                minLat: randomValue(-90, latCut),
                maxLat: randomValue(latCut, 90),
                minLon: randomValue(-180, lonCut),
                maxLon: randomValue(lonCut, 180)
            }
        };

        it('should return params unchanged after check', () => {
            return Q()
                .then(() => checkRequest(params))
                .then(actual => {
                    assert.equal(params, actual);
                });
        });
    });

    describe('#invalid input', () => {
        const testCases = [
            {
                params: {
                    body: {
                        minLat: randomValue(-360, -90.1),
                        maxLat: randomValue(latCut, 90),
                        minLon: randomValue(-180, lonCut),
                        maxLon: randomValue(lonCut, 180)
                    }
                },
                expectedMessage: 'Latitude must be more than -90.0 and less than 90.0. Please check the parameters you\'re passing'
            },
            {
                params: {
                    body: {
                        minLat: randomValue(-90, latCut),
                        maxLat: randomValue(latCut, 90),
                        minLon: randomValue(-180, lonCut),
                        maxLon: randomValue(lonCut, 180)
                    }
                },
                expectedMessage: 'Latitude must be more than -90.0 and less than 90.0. Please check the parameters you\'re passing'
            },
            {
                params: {
                    body: {
                        minLat: randomValue(-90, latCut),
                        maxLat: randomValue(latCut, 90),
                        minLon: randomValue(-360, -180.1),
                        maxLon: randomValue(lonCut, 180)
                    }
                },
                expectedMessage: 'Longitude must be more than -180.0 and less than 180.0. Please check the parameters you\'re passing'
            },
            {
                params: {
                    body: {
                        minLat: randomValue(-90, latCut),
                        maxLat: randomValue(latCut, 90),
                        minLon: randomValue(-180, lonCut),
                        maxLon: randomValue(180.1, 360)
                    }
                },
                expectedMessage: 'Longitude must be more than -180.0 and less than 180.0. Please check the parameters you\'re passing'
            },
            {
                params: {
                    body: {
                        minLat: randomValue(latCut, 90),
                        maxLat: randomValue(-90, latCut),
                        minLon: randomValue(lonCut, 180),
                        maxLon: randomValue(-180, lonCut)
                    }
                },
                expectedMessage: 'minLat must be less than maxLat'
            },
            {
                params: {
                    body: {
                        minLat: randomValue(-90, latCut),
                        maxLat: randomValue(latCut, 90),
                        minLon: randomValue(lonCut, 180),
                        maxLon: randomValue(-180, lonCut)
                    }
                },
                expectedMessage: 'minLon must be less than maxLon'
            },
        ];

        const invalidInputTestCases = [{
            params: {
                body: {
                    maxLat: randomValue(latCut, 90),
                    minLon: randomValue(-180, lonCut),
                    maxLon: randomValue(lonCut, 180)
                }
            }},{
                params: {
                    body: {
                        minLat: randomValue(-90, latCut),
                        minLon: randomValue(-180, lonCut),
                        maxLon: randomValue(lonCut, 180)
                    }
                }},{
                    params: {
                        body: {
                            minLat: randomValue(-90, latCut),
                            maxLat: randomValue(latCut, 90),
                            maxLon: randomValue(lonCut, 180)
                        }
                    }},{
                        params: {
                            body: {
                                minLat: randomValue(-90, latCut),
                                maxLat: randomValue(latCut, 90),
                                minLon: randomValue(-180, lonCut)

                            }
                        }}
                                      ];

        _.forEach(invalidInputTestCases, testCase => {
            const expectedMessage =
                  "Please check the parameters you're passing.\n" +
                  `minLat: ${testCase.params.body.minLat}\n` +
                  `maxLat: ${testCase.params.body.maxLat}\n` +
                  `minLon: ${testCase.params.body.minLon}\n` +
                  `maxLon: ${testCase.params.body.maxLon}\n`;
            it(`should throw an error: ${expectedMessage}`, () => {
                return Q()
                    .then(() => checkRequest(testCase.params))
                    .catch(err => {
                        assert.equal(expectedMessage, err);
                    });
            });
        });



        _.forEach(testCases, testCase => {
            it(`should throw an error: ${testCase.expectedMessage}`, () => {
                return Q()
                    .then(() => checkRequest(testCase.params))
                    .catch(err => {
                        assert.equal(testCase.expectedMessage, err);
                    });
            });
        });
    });
});
