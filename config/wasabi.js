/**
 * this file will be used to export functions for other
 * JavaScript files to upload raw files like zip and p-
 * -ng files to a public Wasabi instance
 */

require('dotenv').config()

/** const SolidBucket = require('solid-bucket') */
const apiKey = process.env.WASABI_API_KEY
const secretKey = process.env.WASABI_SECRET_KEY
const bucketName = process.env.WASABI_BUCKET_NAME

/**
 * const provider = new SolidBucket('wasabi', {
 *     accessKeyId: apiKey,
 *     secretAccessKey: secretKey,
 * })
 */

const uploadFile = (filePath) => {
    provider.uploadFile(bucketName, filePath).then((resp) => {
        if (resp.status === 200) {
            console.log(resp)
        }
    }).catch((resp) => {
        if (resp.status === 400) {
            console.log(resp)
        }
    })
}

module.exports = {
    uploadFile
}