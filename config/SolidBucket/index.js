"use strict";

const awsProvider = require("./providers/aws");
const wasabiProvider = require("./providers/wasabi");

class SolidBucket {
    constructor(provider, options) {
        if (provider === "aws") {
            if (!options.accessKeyId || !options.secretAccessKey) {
                throw new Error({
                    status: 400,
                    message: "Missing Auth options"
                });
            }
            return awsProvider.getAWS(options);
        } else if (provider === "wasabi") {
            if (!options.accessKeyId || !options.secretAccessKey) {
                throw new Error({
                    status: 400,
                    message: "Missing Auth options"
                });
            }
            return wasabiProvider.getWasabi(options);
        } else {
            throw new Error({
                status: 400,
                message: "Missing bucket type"
            });
        }
    }
}

module.exports = SolidBucket;