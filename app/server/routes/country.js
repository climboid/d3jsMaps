var http = require('http');

module.exports = function(router){

  
  router.get('/api/countries/:country_name', function(req, res) {
     var options = {
      host: 'd3automaps-topojson.s3.amazonaws.com',
      path: '/' + req.params.country_name + '.json'
    };

    callback = function(response) {
      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        res.send(200, str)
      });
    }

    http.request(options, callback).end();
    
  });

}
