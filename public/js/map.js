
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// console.log(coordinates);
// const marker1 = new mapboxgl.Marker({anchor: top, classname: "fa-solid fa-house marker", })
//         .setLngLat(coordinates) // listing.geometry.cordinates
//         .addTo(map);

// const marker2 = new mapboxgl.Marker()
//         .setLngLat(coordinates)
//         .addTo(map);

// create a HTML element for each feature
const el = document.createElement('div');
el.className = 'marker';
const marker = new mapboxgl.Marker(el)
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`))
        .addTo(map);