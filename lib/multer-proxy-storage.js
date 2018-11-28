const axios = require('axios')
const concat = require('concat-stream')
const formData = require('form-data')

// support all axios config (https://www.npmjs.com/package/axios#request-config)
const defaultAxiosConfig = {
  method: 'post',     // the request method to be used when making the request
  timeout: 5000       // Maximum time to upload to the server
};

/*
  This is a custom multer storage engine that orxy the received data into a remote server.
  The data is forwarded as multipart/form-data.

  opts: 
    fileParamName: 'file', // [OPTIONAL] If left blank, this defaults to 'file'
    url: 'http://www.example.com/upload', // [REQUIRED]
    metod: 'post', // [OPTIONAL] If left blank, this defaults to 'post'
    ...
    // support all other axios config (https://www.npmjs.com/package/axios#request-config)
  }


  The receiving server is expected to return:
    HTTP Code 200
      or
    HTTP Code Non-200, which is considered an error
*/
class MulterProxyStorage {
  constructor (opts) {
    this.opts = opts
  }

  _handleFile (req, file, cb) {
    try {
      const fileParamName = this.opts.fileParamName || 'file';
      delete this.opts.fileParamName;   // fileParamName is not a standard axios package's config

      var form = new formData()
      // Use filepath to specify the file's fullpath. If we use filename, it'll be cut down into only the filename
      form.append(fileParamName, file.stream, {filepath: file.originalname})
      form.pipe(concat({encoding: 'buffer'}, data => {
        const axiosConfig = Object.assign({}, defaultAxiosConfig, this.opts, { data: data });

        axios(axiosConfig)
          .then(response => {
            cb(null, response.data);
          })
          .catch(err => {
            cb(err)
          });
      }))
    } catch(err) {

    }
  }

  _removeFile (req, file, cb) {
    cb(null)
  }
}

module.exports = (opts) => {
  return new MulterProxyStorage(opts)
}
