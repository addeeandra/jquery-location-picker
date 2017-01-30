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
			addressInputName: 'address',
			click: function () {},
			change: function () {},

			map: null,
			latInput: null,
			lngInput: null,
			addressInput: null,
			searchInput: null,
			mapElement: null,
			showInfo: false,
			changeLocation: function (lat, lng) {
				var that = this;
				if (that.latInput && that.lngInput) {
					if (that.marker) {
						that.marker.setMap(null);
					}

					that.marker = null;
					that.marker = new google.maps.Marker({
						map: that.map,
						position: { lat: lat, lng: lng },
						title: 'Picked Location'
					});

					that.latInput.val(lat);
					that.lngInput.val(lng);
					that.change({ lat: lat, lng: lng });

					$.get(
						'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng,
						function (data) {
							that.addressInput.val(data.results[0].formatted_address);
						}
					);

					// http://maps.googleapis.com/maps/api/geocode/json?latlng=44.4647452,7.3553838&sensor=true
				}
			}
		}, options);

		this.css({ MinHeight: settings.height });

		// setup map element
		settings.mapElement = $(document.createElement('div'))
			.css({ height: settings.height });
		this.append(settings.mapElement);

		// setup latitude input field
		if (settings.latInput == null) {
			settings.latInput = $(document.createElement('input'))
				.attr('type', settings.showInfo ? 'text' : 'hidden')
				.attr('name', settings.latInputName)
				.attr('readonly', '')
				.css({ borderRadius: 0, display: 'inline-block', width: "50%" })
				.addClass('location-picker-co-input-latitude form-control');
			this.append(settings.latInput);
		}

		// setup longitude input field
		if (settings.lngInput == null) {
			settings.lngInput = $(document.createElement('input'))
				.attr('type', settings.showInfo ? 'text' : 'hidden')
				.attr('name', settings.lngInputName)
				.attr('readonly', '')
				.css({ borderRadius: 0, display: 'inline-block', width: "50%" })
				.addClass('location-picker-co-input-longitude form-control');
			this.append(settings.lngInput);
		}

		// setup longitude input field
		if (settings.addressInput == null) {
			settings.addressInput = $(document.createElement('input'))
				.attr('type', settings.showInfo ? 'text' : 'hidden')
				.attr('name', settings.addressInputName)
				.attr('readonly', '')
				.css({ borderRadius: 0 })
				.addClass('location-picker-input-address form-control')
		}
		this.append(settings.addressInput);

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
		this.append(settings.searchInput);

		// setup map & searchbox
		settings.map = new google.maps.Map(settings.mapElement[0], settings.mapOptions);
		var searchBox = new google.maps.places.SearchBox(settings.searchInput[0]);
		settings.map.controls[google.maps.ControlPosition.TOP_LEFT].push(settings.searchInput[0]);

		settings.map.addListener('bounds_changed', function () {
			searchBox.setBounds(settings.map.getBounds());
		});

		settings.map.addListener('click', function (e) {
			var location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
			settings.click(location);
			settings.changeLocation(location.lat, location.lng);
		});

		searchBox.addListener('places_changed', function () {
			var places = searchBox.getPlaces();

			// if no places, do nothing
			if (places.length == 0)
				return;
			
			var bounds = new google.maps.LatLngBounds();
			var place = places[0]; // get only one place result

			settings.changeLocation(place.geometry.location.lat(), place.geometry.location.lng());

			if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }

            settings.map.fitBounds(bounds);
		});

		// first initialie
		settings.changeLocation(settings.mapOptions.center.lat, settings.mapOptions.center.lng);

		return this;
	};
});