init();
///////////////////////////////////////////////////////////
// THIS CODE IS JUST FOR THE TEXT INSIDE DOUGHNUT GRAPH////
///////////////////////////////////////////////////////////
Chart.pluginService.register({
  beforeDraw: function(chart) {
    if (chart.config.options.elements.center) {
      // Get ctx from string
      var ctx = chart.chart.ctx;

      // Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = centerConfig.text;
      var color = centerConfig.color || '#000';
      var maxFontSize = centerConfig.maxFontSize || 75;
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
      // Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
      var minFontSize = centerConfig.minFontSize;
      var lineHeight = centerConfig.lineHeight || 25;
      var wrapText = false;

      if (minFontSize === undefined) {
        minFontSize = 20;
      }

      if (minFontSize && fontSizeToUse < minFontSize) {
        fontSizeToUse = minFontSize;
        wrapText = true;
      }

      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      if (!wrapText) {
        ctx.fillText(txt, centerX, centerY);
        return;
      }

      var words = txt.split(' ');
      var line = '';
      var lines = [];

      // Break words up into multiple lines if necessary
      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > elementWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }

      // Move the center up depending on line height and number of lines
      centerY -= (lines.length / 2) * lineHeight;

      for (var n = 0; n < lines.length; n++) {
        ctx.fillText(lines[n], centerX, centerY);
        centerY += lineHeight;
      }
      //Draw text in center
      ctx.fillText(line, centerX, centerY);
    }
  }
});
/////END OF CODE FOR DOUGHNUT TEXT

////////////////////////////////
//      TABLE BUILDING        //
//                            //
////////////////////////////////
// Builds the HTML Table out of myList.
function buildHtmlTable(selector, apicall) {

    jsonurl = apicall;
    d3.json(jsonurl).then((data) => {
     var myList0 = data;
    // for (let i = 0; i < data.length; i++) {
    //   myList.push(data.result[i])
           
    // }
   
    var myList = (myList0.slice(0,10))
    // var myList = [
    //   { "name": "abc", "age": 50 },
    //   { "age": "25", "hobby": "swimming" },
    //   { "name": "xyz", "hobby": "programming" }
    // ];

    var columns = addAllColumnHeaders(myList, selector);
  
    for (var i = 0; i < myList.length; i++) {
      var row$ = $('<tr/>');
      for (var colIndex = 0; colIndex < columns.length; colIndex++) {
        var cellValue = myList[i][columns[colIndex]];
        if (cellValue == null) cellValue = "";
        row$.append($('<td/>').html(cellValue));
      }
      $(selector).append(row$);
      }
    });
  }
  
  // Adds a header row to the table and returns the set of columns.
  // Need to do union of keys from all records as some records may not contain
  // all records.
  function addAllColumnHeaders(myList, selector) {
    var columnSet = [];
    var headerTr$ = $('<tr/>');
  
    for (var i = 0; i < myList.length; i++) {
      var rowHash = myList[i];
      for (var key in rowHash) {
        if ($.inArray(key, columnSet) == -1) {
          columnSet.push(key);
          headerTr$.append($('<th/>').html(key));
        }
      }
    }
    $(selector).append(headerTr$);
  
    return columnSet;
  }



/////////////////////////////////
//                             // 
//      MAPPING                //
//                             //
/////////////////////////////////

function plotMap(api_call3){
  
  var jsonurl = api_call3
  
  d3.json(jsonurl).then((data) => {
    JSONItems = data.result;
    revenue = []
    lat = []
    lng = []
    city = []
    avgprice = []

    for (let i = 0; i < JSONItems.length; i++) {
        lat.push(JSONItems[i].lat)
        lng.push(JSONItems[i].lng)
        city.push(JSONItems[i].city)
        revenue.push(JSONItems[i].sum)
        avgprice.push(JSONItems[i].avg)

      L.circle([JSONItems[i].lat, JSONItems[i].lng], {
        radius: 2*JSONItems[i].sum,
        color:'green',
        fillcolor: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      })
    .bindPopup("<h3> City " + JSONItems[i].city + "<br/>Revenue: " + JSONItems[i].sum + "<br/>Avg Unit Price:" + JSONItems[i].avg)
    .addTo(mymap);
    }    
  });

  var mymap = L.DomUtil.get('mapid');

  if  (mymap != null) {
    mymap._leaflet_id = null;
    mymap = L.map('mapid').setView([37.09, -95.71], 4);
  } else {
    mymap = L.map('mapid').setView([37.09, -95.71], 4);
  }

  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
  }).addTo(mymap);

  var popup = L.popup();

}
/////////////////////////////////
//                             // 
//      PIE DOUGHNUT           //
//                             //
/////////////////////////////////

function plotPie(apicall){
  var jsonurl = apicall;

  d3.json(jsonurl).then((data) => {
    JSONItems = data.result;
    product = [];
    sold = [];
    for (let i = 0; i < JSONItems.length; i++) {
        product.push(JSONItems[i].product)
        sold.push(JSONItems[i].sum)
    }
      
    var ctx = document.getElementById("myChart2");
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Product A', 'Product B', 'Product C'],
        datasets: [{
          label: 'Revenue Sources',
          data: sold,
          backgroundColor: [
            "#4FA03D","#E1542B","#5388BE"
          ],
          borderColor: [
            "#ffffff","#ffffff","#ffffff"
          ],
          borderWidth: 1
           }]
         },
        
        options: {
          responsive:true,
          legend: {
            position:'bottom'
          },
          elements: {
            center: {
              text: 'Units Sold',
              color: '#FF6384', // Default is #000000
              fontStyle: 'Arial', // Default is Arial
              sidePadding: 20, // Default is 20 (as a percentage)
              minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
              lineHeight: 25 // Default is 25 (in px), used for when text wraps
            }
          }
        }
     });
  });
};

/////////////////////////////////
//                             // 
//       STACKED BAR           //
//                             //
/////////////////////////////////
function plotstack(apicall2, apicall3, apicall4) {
  let proda = [];
  let prodb = [];
  let prodc = [];
  
  jsonurl = apicall2;
  d3.json(jsonurl).then((data) => {
    JSONItems = data.result;

    for (let i = 0; i < JSONItems.length; i++) {
      proda.push(JSONItems[i].sum)  
    }
  });

  jsonurl = apicall3;
  d3.json(jsonurl).then((data) => {
    JSONItems = data.result;

    for (let i = 0; i < JSONItems.length; i++) {
      prodb.push(JSONItems[i].sum)
           
    }
   });

  jsonurl = apicall4;
  d3.json(jsonurl).then((data) => {
    JSONItems = data.result;

    for (let i = 0; i < JSONItems.length; i++) {
      prodc.push(JSONItems[i].sum)
    }

    drawstack(proda,prodb,prodc);
   });
   
  function drawstack(proda,prodb,prodc) {
    var barData = {
      labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],
      datasets : [{
          label : 'Product A',
          backgroundColor : '#4FA03D',
          data : proda,
      }, {
        label : 'Product B',
        backgroundColor : '#E1542B',
        data : prodb,
      }, {
        label : 'Product C',
        backgroundColor : '#5388BE',
        data : prodc,
      }]
    
    };

    var context = document.getElementById('myChart3').getContext('2d');
    var clientsChart = new Chart(context, {
      type : 'bar',
      data : barData,
      options : {
        legend: {
          position:'bottom'
        },
          scales : {
              xAxes : [{
                  stacked : true,
              }],
              yAxes : [{
                  stacked : true,
                  beginAtZero:false
              }]
          }
      }
    });
  }
}

/////////////////////////////////
//                             // 
//      LINE CHART             //
//                             //
/////////////////////////////////
function plotChart(apicall) {
  var jsonurl = apicall
  
  d3.json(jsonurl).then((data) => {
    JSONItems = data.result;
    month = []
    revenue = []
    for (let i = 0; i < JSONItems.length; i++) {
        month.push(JSONItems[i].month)
        revenue.push(JSONItems[i].sum.toFixed(2))
    }

    var ctx = document.getElementById('myChart');

    var revenue = revenue;
    var frameworks = month;

    var myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],
        datasets: [
        {
            label: "Revenue",
            data: revenue,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1",
            borderWidth: 1 }]},
            
        options: {
          legend: {
            display:true,
            position:'bottom'
          },
          responsive: true
          
        }
    });
  });
}  


/////////////////////////////////
//                             // 
//      THE PLOTTLY BARS       //
//                             //
/////////////////////////////////

function top10countries(apicall) {
  var jsonurl = apicall
  let topten = document.getElementById("country");

  d3.json(jsonurl).then((data) => {
    JSONItems = data.result;

    let country = [];
    let revenue = []

    for (let i = 0; i < JSONItems.length; i++) {
      country.push(JSONItems[i].country)
      revenue.push(JSONItems[i].revenue)
      
    }
  
    var trace1= {
      x: revenue.slice(0,10),
      y: country.slice(0,10),
      type: "bar",
      orientation: 'h',
    };

    var layout = {
      title: "Top 10 countries by Revenue"

    };

    var data = [trace1];

    Plotly.newPlot("country", data,layout);
  }
)};

function top10cities(apicall) {
    var jsonurl = apicall
    let topten = document.getElementById("city");
  
    d3.json(jsonurl).then((data) => {
      JSONItems = data.result;
  
      let city = [];
      let revenue = []
  
      for (let i = 0; i < JSONItems.length; i++) {
        city.push(JSONItems[i].city)
        revenue.push(JSONItems[i].revenue)
        
      }
      
      var trace1= {
        x: revenue.slice(0,10),
        y: city.slice(0,10),
        type: "bar",
        orientation: 'h',
      };
  
      var layout = {
        title: "Top 10 cities by Revenue"
    
      };
      var data = [trace1];
      Plotly.newPlot("city", data,layout);
    
  }
)};


function clean(){
  var table = document.getElementById("summarytable")
  table.innerHTML = ""

  document.getElementById("myChart2").remove();
  let canvas2 = document.createElement('canvas');
  canvas2.setAttribute('id','myChart2');
  document.getElementById("chart2div").appendChild(canvas2); 

  document.getElementById("myChart").remove();
  let canvas = document.createElement('canvas');
  canvas.setAttribute('id','myChart');
  document.getElementById("chartdiv").appendChild(canvas);

  document.getElementById("myChart3").remove();
  let canvas3 = document.createElement('canvas');
  canvas3.setAttribute('id','myChart3');
  document.getElementById("chart3div").appendChild(canvas3);

}
/////////////////////////////////
//                             // 
//     INTERACTIVE FUNCTIONS   //
//                             //
/////////////////////////////////

  function optionChanged(id){
  clean();
  
    if (id == 2020) {
      plotChart("/api/sales/2020");
      plotPie("/api/sales/2020/byproducts");
      plotMap("/api/sales/2020/map");
      populateHeadlines(id)
      plotstack("/api/sales/2020/producta","/api/sales/2020/productb","/api/sales/2020/productc");
      buildHtmlTable("#summarytable","/api/sales/2020/topcountries");
    } else if (id == 2019) {
      plotChart("/api/sales/2019");
      plotPie("/api/sales/2019/byproducts")
      plotMap("/api/sales/2019/map")
      populateHeadlines(id)
      plotstack("/api/sales/2019/producta","/api/sales/2019/productb","/api/sales/2019/productc");
      buildHtmlTable("#summarytable","/api/sales/2019/topcountries");
    }  else  {
      plotChart("/api/sales/2018");
      plotPie("/api/sales/2018/byproducts")
      plotMap("/api/sales/2018/map")
      populateHeadlines(id)
      plotstack("/api/sales/2018/producta","/api/sales/2018/productb","/api/sales/2018/productc");
      buildHtmlTable("#summarytable","/api/sales/2018/topcountries");
  }
  }

  let headlineApiCalls = ["revenue", "avg_revenue", "bestproduct", "bestcountry"];
  let headlineTitle = ["Total Revenue", "Avg Monthly Revenue", "Best Selling Product", "Most Profitable Country"];


  function headline(apicall, index){
      let jsonurl = apicall;
      let divID = document.getElementById(headlineApiCalls[index]);
            
      d3.json(jsonurl).then((data) =>  {
        JSONItems = data.result;

        if (index === 2) {
          headlineData = JSONItems[0].product;
        } else if (index === 3) {
          headlineData = JSONItems[0].country.toString() + "<br>$" + JSONItems[0].revenue.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
          headlineData = "$" + JSONItems[0].revenue.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
              
        divID.innerHTML = `<h4>${headlineTitle[index]}</h4><h3 class="mb-2">${headlineData}</h3>`;
    }); 
  };

  function populateHeadlines(id) {
    for (let i = 0; i < headlineApiCalls.length; i++) {
      headline("/api/sales/" + id + "/" + headlineApiCalls[i], i);
    };
  }

function init() {
        //myChart.destroy();
        var jsonurl = "/api/getyear"
        let selectyear = document.getElementById("selDataset");
        //the section of the webpage were the dropdown code is located.

        //d3 json the file file, and old school loop it
        
        d3.json(jsonurl).then((data) =>  {
          JSONItems = data.result;

          for (let i = 0; i < JSONItems.length; i++) 
          {
              var option = `<option>${JSONItems[i].year}</option>`
              year = JSONItems[i].year;
              if (year == 2020) {
               selectyear.innerHTML += `<option selected>${year}</option>`;
               plotChart("/api/sales/2020");
               plotPie("/api/sales/2020/byproducts")
               plotMap("/api/sales/2020/map")
               populateHeadlines(2020)
               plotstack("/api/sales/2020/producta","/api/sales/2020/productb","/api/sales/2020/productc");
               buildHtmlTable("#summarytable","/api/sales/2020/topcountries");
              } else {
              selectyear.innerHTML += option;
              }
          }
      }); 
};


    







