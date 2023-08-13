
// Get the data attributes
const scriptElement = document.getElementById('campground-data');
const mapToken = scriptElement.getAttribute('data-map-token');
const campgroundData = JSON.parse(scriptElement.getAttribute('data-campground'));

// Now you can use the mapToken and campgroundData variables in your JavaScript code

console.log(campgroundData.geometry);


mapboxgl.accessToken = mapToken // this is for using the .env file in development
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campgroundData.geometry.coordinates,
    zoom: 4

});

var marker = new mapboxgl.Marker()
    .setLngLat(campgroundData.geometry.coordinates)
    .addTo(map);