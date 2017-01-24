# jquery-location-picker
Pick latitude and longitude using [GoogleMap](https://maps.google.com) with [JQuery](https://jquery.com/)

## Usage
Create a div inside `form` element
```html
<form method="POST" action="/">
  <div id="a_map"></div>
  <submit>Send Location</submit>
</form>
```

include `jquery-location-picker.min.js` with `jquery` and `gmap`
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=your_gapi_key"></script>
<script src="jquery-location-picker.min.js"></script>
```

initialize `location-picker` to your `div`
```js
$('#a_map').locationPicker(mapOptions, options);
```
and voila! (Read below about mapOptions and options)

## Info
The default names of latitude input and longitude input is `latitude` and `longitude`
```html
<input type="hidden" name="latitude">
<input type="hidden" name="longitude">
```

MapOptions is optional, read more at [GoogleMap JS API](https://developers.google.com/maps/documentation/javascript/)
```js
{
  center: {
    lat: -7.259258,
    lng: 112.7931297
   },
   scrollwheel: true,
   zoom: 17
}
```

Options :
```js
{
  height: 320,
  click: function (latlng) {
    console.log(latlng);
  }
}
```

## Demo
To use demo, replace 'your_api_key_here' with your API Key.
Read more [GoogleMap API](https://developers.google.com/maps/)
