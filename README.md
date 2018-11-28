# Multer Proxy Storage Engine

This is a custom multer storage engine that proxy the received file into a remote server.
The proxy is forwarded as multipart/form-data.

## Install

```
npm install --save multer multer-proxy-storage-engine
```

## Usage

In this example we are forwarding user uploaded file into remote server http://www.example.com/upload, with the file
identified with the parameter 'file'.

Axios (https://www.npmjs.com/package/axios)[https://www.npmjs.com/package/axios] library is used for proxy request.
multer-proxy-storage-engine can foward all options for Axios request (https://www.npmjs.com/package/axios#request-config)[https://www.npmjs.com/package/axios#request-config]  

``` javascript
const multer = require('multer')
const multerProxyStorage = require('multer-proxy-storage-engine')

this.routePost('/uploadFile',
  (req, res, next) => {
    multer({
      storage: multerProxyStorage(
        {
          url: 'http://www.example.com/upload',   // REQUIRED
          method: 'post',           // OPTIONAL (if not set, deafult value is 'post') 
          fileParamName: 'file'     // OPTIONAL (if not set, deafult value is 'file') - this is a outgoing proxy file param name 
          timeout: 5000             // in ms, OPTIONAL (if not set, deafult value is 5000)
          // **** in addtion, you can set all (Axios configurations)[https://www.npmjs.com/package/axios#request-config] here 
        }),
      preservePath: true
    }).array('file')(req, res, next);   // 'file' is a incoming request param name for the multer configuration
  }, (req, res, next) => {
    res.send('Success!')
  })
```
Or it can be used as following

``` javascript
const multer = require('multer')
const multerProxyStorage = require('multer-proxy-storage-engine')
const upload = multer({
  storage: multerProxyStorage(
    {
      url: 'http://www.example.com/upload',   // REQUIRED
      method: 'post',           // OPTIONAL (if not set, deafult value is 'post') 
      fileParamName: 'file',    // OPTIONAL (if not set, deafult value is 'file') - this is a outgoing proxy file param name
      timeout: 5000,            // in ms, OPTIONAL (if not set, deafult value is 5000)
      // **** in addtiona, you can set all (Axios configurations)[https://www.npmjs.com/package/axios#request-config] here 
      headers: {'X-Requested-With': 'XMLHttpRequest'}   // an example of Axios configuration usage
    }),
  preservePath: true
}).array('file'); // NOTE: you can use .single('file') instead of .array('file') if you are expecting only one file
    
upload(req, res, (err, responseData) => {
  if (err) {
    res.send('ERROR');
    console.error(err);
  } else {
    res.send('SUCCESS');
    console.llog(responseData);
  }
});
```

## License
Multer-Proxy-Storage-Engine is released under the [MIT](License) license.
