(function() {
    var viz = d3.charts.viz();

    var rand = function() {
      return Math.floor((Math.random() * 10) + 1)
    };

    var data = function() {
      return [1,2,3].map(function(d,i) {
        var cost = rand();
        var sales = rand();

        return {
          category: 'category-'+i,
          cost: cost,
          sales: cost + sales
        };
      });
    };

    d3.select("#chart").datum(data()).call(viz.draw);

    var id = setInterval(function() {
      d3.select("#chart").datum(data()).call(viz.draw);
    }, 2000);

    setTimeout(function() {
      clearInterval(id);
    }, 10000);

})();