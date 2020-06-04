var mymap = L.map('mapid').setView([37.09, -95.71], 4);

//L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?{access_token}', {
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: API_KEY
}).addTo(mymap);
//#####
var jsonurl = "/api/mapsales";    
  
 
  d3.json(jsonurl).then((data) => {
    JSONItems = data;
    
    //console.log(JSONItems)
    revenue = []
    lat = []
    lng = []
    city = []
    for (let i = 0; i < JSONItems.length; i++) {
        lat.push(JSONItems[i].lat)
        lng.push(JSONItems[i].lng)
        city.push(JSONItems[i].city)
        revenue.push(JSONItems[i].revenue)
 
    
    
    L.circle([JSONItems[i].lat, JSONItems[i].lng],{
      radius: 1.5*JSONItems[i].revenue,
      //color: getColor(features[i].properties.mag),
      color:'blue',
      fillcolor: 'black',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    })
    .bindPopup("<h3> City " + JSONItems[i].city + "<br/>Revenue: " + JSONItems[i].revenue )
    .addTo(mymap);
    
    }    
  });
//#####



// L.marker([51.5, -0.09]).addTo(mymap)
//   .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

// L.circle([51.508, -0.11], 500, {
//   color: 'red',
//   fillColor: '#f03',
//   fillOpacity: 0.5
// }).addTo(mymap).bindPopup("I am a circle.");

// L.polygon([
//   [51.509, -0.08],
//   [51.503, -0.06],
//   [51.51, -0.047]
// ]).addTo(mymap).bindPopup("I am a polygon.");


var popup = L.popup();

// function onMapClick(e) {
//   popup
//     .setLatLng(e.latlng)
//     .setContent("You clicked the map at " + e.latlng.toString())
//     .openOn(mymap);
// }

// mymap.on('click', onMapClick);
