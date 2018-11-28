# Multer Proxy Storage Engine

This is a custom multer storage engine that proxy the received file into a remote server.
The proxy is forwarded as multipart/form-data.

## Install

```
npm install --save multer-proxy-storage-engine
```

## Usage

In this example we are forwarding user uploaded file into remote server http://www.example.com/upload, with the file
identified with the parameter 'file'.

``` javascript
const multer = require('multer')
const multerProxyStorage = require('multer-proxy-storage-engine')

this.routePost('/uploadFile',
  (req, res, next) => {
    multer({
      storage: multerProxyStorage(
        {
          serverPath: `http://www.example.com/upload`,
          fileParamName: 'file'     // OPTIONAL
        }),
      preservePath: true
    }).array('file')(req, res, next)
  }, (req, res, next) => {
    res.send('Success!')
  })
```

## License
Multer-Proxy-Storage-Engine is released under the [MIT](License) license.
