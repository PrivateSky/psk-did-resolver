'use strict';
const testUtils = require('./utils');
const dc = require("double-check");
const assert = dc.assert;

const constants = require('../lib/constants');
const dsuRepresentations = constants.builtinDSURepr;
const brickMapStrategies = constants.builtinBrickMapStrategies;

let keyDidResolver;
let favouriteEndpoint;

const FILE_PATH = '/something/something/darkside/my-file.txt';
const FILE_CONTENT =  'Lorem Ipsum';

testUtils.didResolverFactory({testFolder: 'diff_brickmap_strategy_test', testName: 'Diff BrickMapStrategy test'}, (err, result) => {
    assert.true(err === null || typeof err === 'undefined', 'Failed to initialize test');
    keyDidResolver = result.keyDidResolver;
    favouriteEndpoint = result.favouriteEndpoint

    runTest(result.doneCallback);
});

function runTest(callback) {
    keyDidResolver.createDSU(dsuRepresentations.BAR, {
        favouriteEndpoint,
        brickMapStrategy: brickMapStrategies.DIFF
    }, (err, dsu) => {
        assert.true(typeof err === 'undefined', 'No error while creating the DSU');

        writeAndReadTest(dsu, callback);
    });
}

function writeAndReadTest(dsu, callback) {
    dsu.writeFile(FILE_PATH, FILE_CONTENT, (err, hash) => {
        assert.true(typeof err === 'undefined', 'DSU is writable');

        dsu.readFile(FILE_PATH, (err, data) => {
            assert.true(typeof err === 'undefined', 'DSU is readable');
            assert.true(data.toString() === FILE_CONTENT, 'File was read correctly');

            loadTest(dsu.getDID(), callback);
        })
    })
}

function loadTest(did, callback) {
    keyDidResolver.loadDSU(did, dsuRepresentations.BAR, {
        brickMapStrategy: brickMapStrategies.DIFF
    }, (err, dsu) => {
        assert.true(typeof err === 'undefined', 'No error while loading the DSU');

        dsu.readFile(FILE_PATH, (err, data) => {
            assert.true(typeof err === 'undefined', 'No error while reading file from DSU');

            assert.true(data.toString() === FILE_CONTENT, 'File has the correct content');
            deleteTest(dsu, callback);
        });
    });
}

function deleteTest(dsu, callback) {
    dsu.delete(FILE_PATH, (err) => {
        assert.true(typeof err === 'undefined', 'File was deleted without error');

        dsu.readFile(FILE_PATH, (err, data) => {
            assert.true(typeof err !== 'undefined', 'File still exists');

            renameTest(dsu.getDID(), callback);
        })
    })
}

function renameTest(did, callback) {
    keyDidResolver.loadDSU(did, dsuRepresentations.BAR, {
        brickMapStrategy: brickMapStrategies.DIFF
    }, (err, dsu) => {
        assert.true(typeof err === 'undefined', 'No error while loading the DSU');

        dsu.writeFile(FILE_PATH, FILE_CONTENT, (err, data) => {
            assert.true(typeof err === 'undefined', 'No error while write file in DSU');

            dsu.rename(FILE_PATH, '/my-file.txt', (err) => {
                assert.true(typeof err === 'undefined', 'No error while renaming file in DSU');

                renameTestAfterLoad(dsu.getDID(), callback);
            })

        });
    });
}

function renameTestAfterLoad(did, callback) {
    keyDidResolver.loadDSU(did, dsuRepresentations.BAR, {
        brickMapStrategy: brickMapStrategies.DIFF
    }, (err, dsu) => {
        assert.true(typeof err === 'undefined', 'No error while loading the DSU');

        dsu.readFile(FILE_PATH, (err, data) => {
            assert.true(typeof err !== 'undefined', 'File still exists');

            dsu.readFile('/my-file.txt', (err, data) => {
                assert.true(typeof err === 'undefined', 'No error while reading file from DSU');
                assert.true(data.toString() === FILE_CONTENT, 'File has the correct content');
                callback();
            })
        })
    });
}
