//=====================
//start page load with map layer
const tile =  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  // layers: [baseMaps, ]
  accessToken: API_KEY
});
const baseMaps = {
   "Portland Map": tile
 };
// deprecated try to call using multiple files
//const neighborhoods = {
//     "Neighborhoods":
// }

// troubleshooting for CORS error
// setTimeout(function(){
//     // can assign to const heat
//      L.heatLayer(heatArray, {
//       radius: 20,
//       blur: 15
//   }).addTo(heatMap)
// },9500);
// =====================
// declare API url links for promise
const census= "/api/censusdata/"
const neighborhoodURL = "https://opendata.arcgis.com/datasets/9f50a605cf4945259b983fa35c993fe9_125.geojson"
const treesURL = "https://opendata.arcgis.com/datasets/fd1d618ac3174ad5be730524a4dd778e_26.geojson"

// Grab data with d3 promise

Promise.all([d3.json(neighborhoodURL), d3.json(treesURL), d3.json(census)]).then(([neighborhoods, trees, ucb]) => {

console.log(neighborhoods)
console.log(trees)
console.log(ucb);
console.log(trees.features[0].properties);

const markers= L.markerClusterGroup();
for (let i = 0; i < trees.features.length; i++) {
  const location = trees.features[i].properties;
  // console.log(location)
  if (location.LAT) {
    markers.addLayer(L.marker([location.LAT, location.LON])
    .bindPopup(`<br><strong>Year Designated: </strong>${location.YEAR_Designated}</br>\
        <br><strong>Spread: </strong>${location.SPREAD} feet</br>\
        <br><strong>Diameter: </strong>${location.DIAMETER} feet</br>\
        <br><strong>Height: </strong> ${location.HEIGHT} feet</br>\
        <br><strong>Details: </strong>${location.NOTES}</br>`));
  }
}
// console.log(location);
// console.log(heatArray);
map.addLayer(markers)
 L.geoJson(neighborhoods, {
  style: function(feature) {
    return{
      color: "white",
      fillColor:"lightblue",
      fillOpacity: 0.5,
      weight: 1.5
    };
  },
  onEachFeature: function(feature, layer) {
    layer.on({
      mouseover: function(event) {
        layer = event.target;
        layer.setStyle({
          fillOpacity:0.9
        });
      },
      mouseout: function(event) {
        layer = event.target;
        layer.setStyle({
          fillOpacity: 0.5
        });
      },
      click: function(event) {
        map.fitBounds(event.target.getBounds());
      }
    });
  layer.bindPopup(
    `<h4>${feature.properties.NAME}</h4>`
  );
  },
  }


).addTo(map)
// .addTo(map)
//empty arrays to push data to
const zip = [];
const medianIncome = [];
const medianAge= [];
const medianHome= [];
const population= [];
const bachelorsRate = [];
const mastersRate = [];
const city= [];
const latCensusArray= [];
const longCensusArray= [];

for (let i = 0; i < ucb.length; i++) {
        zip.push(ucb[i].Zipcode)
        medianIncome.push(ucb[i].MedianHouseholdIncome)
        medianAge.push(ucb[i].MedianAge)
        medianHome.push(ucb[i].MedianHomeValue)
        population.push(ucb[i].Population)
        bachelorsRate.push(ucb[i].BachelorsRate)
        mastersRate.push(ucb[i].MastersRate)
        city.push(ucb[i].City)
        latCensusArray.push(ucb[i].Lat)
        longCensusArray.push(ucb[i].Lng)

}
// ==================================
// High chart plotting
console.log(zip);
console.log(medianHome);
Highcharts.chart('chart2', {
    chart: {
       type: 'scatter',
       zoomType: 'xy'
   },

    title: {
        text: 'U.S. Census Bureau Data for Portland, 2019'
    },

    subtitle: {
        text: 'Source: census.gov/data'
    },

    yAxis: {
        title: {
            text: 'Median Home Value'
        }
    },

    xAxis: {
        accessibility: {
            rangeDescription: 'Zipcode'
        }
    },

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x}, ${point.y} '
                }
            }
        },

    series: [{
        name: 'Median Income',
        color: 'rgba(223, 83, 83, .5)',
        data: medianHome
    }, {
        name: 'Zipcode',
        color: 'rgba(119, 152, 191, .5)',
        data: zip
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

})
});

const map= L.map("map", {
 center: [45.5051, -122.6754],
 zoom: 12,
 layers: tile
});


// const neighbors = {
//     "Neighborhoods": neigh
// }
L.control.layers(baseMaps).addTo(map);
