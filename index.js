'use strict';

const KeySSIResolver = require('./lib/KeySSIResolver');
const constants = require('./lib/constants');

/**
 * Create a new KeyDIDResolver instance
 * @param {object} options
 * @param {object} options.endpointsConfiguration
 * @param {Array<object>} options.endpointsConfiguration.brickEndpoints
 * @param {Array<object>} options.endpointsConfiguration.aliasEndpoints
 */
function factory(options) {
    options = options || {};
    const keySSIResolver = new KeySSIResolver(options);

    return keySSIResolver;
}

/**
 * Create a new KeyDIDResolver instance and append it to
 * global object $$
 *
 * @param {object} options
 * @param {object} options.endpointsConfiguration
 * @param {Array<object>} options.endpointsConfiguration.brick
 * @param {Array<object>} options.endpointsConfiguration.alias
 * @param {string} options.dlDomain
 */
function initialize(options) {
    return factory(options);
}

module.exports = {
    initialize,
    constants,
    DIDMixin: require('./lib/DID/DIDMixin'),
    KeySSIFactory: require('./lib/KeySSIs/KeySSIFactory')
};
