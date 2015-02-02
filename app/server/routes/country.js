var http = require('http');

module.exports = function(router){

  
  router.get('/api/countries/:country_id', function(req, res) {
    console.log(req.params.country_id)
     var options = {
      host: 'd3automaps-topojson.s3.amazonaws.com',
      path: '/ABW_adm0.json'
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
