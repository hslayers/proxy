
// Listen on a specific host via the HOST environment variable
const host = '0.0.0.0';
// Listen on a specific port via the PORT environment variable
const port = process.env.PROXY_PORT || 8085;
const querystring = require('querystring');

const cors_proxy = require('cors-anywhere').createServer({
  originWhitelist: [], // Allow all origins
  //requireHeader: ['origin', 'x-requested-with'],
  //removeHeaders: ['cookie', 'cookie2']
});
const geonamesUsername = 'raitis';

require('http').createServer(function (req, res) {
  try {
    console.log('Start', req);
    req.url = req.url.replace('/mapproxy', '');
    if (req.url.indexOf('/search') > -1) {
      console.log('Search', req.url);
      const params = querystring.decode(req.url.split('?')[1]);
      console.log('Params', params);
      if (typeof params.provider == 'undefined' || params.provider == 'geonames')
        req.url = `/http://api.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(params.q)}&username=${geonamesUsername}`
    }
    if (req.url.indexOf(':/') > -1 && req.url.indexOf('://') == -1) {
      req.url = req.url.replace(':/', '://');
    }
    console.log(req.url);
    cors_proxy.emit('request', req, res);
  } catch (ex) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write('Invalid request');
    res.end();
  }
}).listen(port, host, function () {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
});