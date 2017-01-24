$(function ( $ ) {
	var settings;

	$.fn.locationPicker = function (mapOptions, options) {
		settings = $.extend({
			mapOptions: $.extend({
				center: { lat: -7.259258, lng: 112.7931297 },
				scrollwheel: true,
				zoom: 17
			}, mapOptions),
			height: 320,
			latInputName: 'latitude',
			lngInputName: 'longitude',
			click: function () {},

			map: null,
			latInput: null,
			lngInput: null,
			searchInput: null,
			mapElement: null
		}, options);

		// setup map element
		settings.mapElement = $(document.createElement('div'))
			.css({ height: settings.height });

		// setup latitude input field
		settings.latInput = $(document.createElement('input'))
			.attr('type', 'hidden')
			.attr('name', settings.latInputName)
			.addClass('location-picker-input-latitude')
			.val(settings.mapOptions.center.lat);

		// setup longitude input field
		settings.lngInput = $(document.createElement('input'))
			.attr('type', 'hidden')
			.attr('name', settings.lngInputName)
			.addClass('location-picker-input-longitude')
			.val(settings.mapOptions.center.lng);

		// setup searchbox
		settings.searchInput = $(document.createElement('input'))
			.attr('type', 'text').attr('placeholder', 'Search location, city, address ..')
			.addClass('location-picker-input-search')
			.css({
				margin: '10px 0',
				padding: '8px',
				width: '50%',
				border: '#f0f0f0',
				borderRadius: '2px',
				boxShadow: '0px 2px 1px #c0c0c0'
			});

		// appending inputs and map element
		this.css({ height: settings.height })
			.append(settings.searchInput)
			.append(settings.mapElement)
			.append(settings.latInput)
			.append(settings.lngInput);

		// setup map and marker
		settings.map = new google.maps.Map(settings.mapElement[0], settings.mapOptions);
		settings.marker = new google.maps.Marker({
			map: settings.map,
			position: settings.mapOptions.center,
			title: 'Picked Location'
		});

		var searchBox = new google.maps.places.SearchBox(settings.searchInput[0]);
		settings.map.controls[google.maps.ControlPosition.TOP_LEFT].push(settings.searchInput[0]);

		settings.map.addListener('bounds_changed', function () {
			searchBox.setBounds(settings.map.getBounds());
		});

		settings.map.addListener('click', function (e) {
			var selectedLocation = { lat: e.latLng.lat(), lng: e.latLng.lng() };
			settings.click(selectedLocation);
			
			// reset marker position
			settings.marker.setMap(null);
			settings.marker = null;
			settings.marker = new google.maps.Marker({
				map: settings.map,
				position: selectedLocation,
				title: 'Picked Location'
			});

			// set value of input
			settings.latInput.val(e.latLng.lat());
			settings.lngInput.val(e.latLng.lng());
		});

		searchBox.addListener('places_changed', function () {
			var places = searchBox.getPlaces();

			// if no places, do nothing
			if (places.length == 0)
				return;
			
			var bounds = new google.maps.LatLngBounds();
			var place = places[0]; // get only one place result

			// reset marker position
			settings.marker.setMap(null);
			settings.marker = null;
			settings.marker = new google.maps.Marker({
				map: settings.map,
				position: place.geometry.location,
				title: place.name
			});

			if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }

            settings.map.fitBounds(bounds);
		});

		return this;
	};
});