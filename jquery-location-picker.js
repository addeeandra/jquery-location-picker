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
			mapElement: null
		}, options);

		// setup latitude input field
		setting.latInput = $(document.createElement('input'))
			.attr('type', 'hidden')
			.attr('name', settings.latInputName)
			.addClass('location-picker-input-latitude')
			.val(settings.mapOptions.center.lng);

		// setup longitude input field
		setting.latInput = $(document.createElement('input'))
			.attr('type', 'hidden')
			.attr('name', settings.latInputName)
			.addClass('location-picker-input-longitude')
			.val(settings.mapOptions.center.lat);

		// setup map element
		settings.mapElement = $(document.createElement('div'))
			.css({ height: settings.height });

		// appending inputs and map element
		this.css({ height: settings.height })
			.append(settings.mapElement)
			.append(settings.latInput)
			.append(settings.lngInput);

		// setup map and marker
		settings.map = new google.maps.Map(settings.mapElement[0], settings.mapOptions);
		settings.marker = new google.maps.Marker({
			position: settings.mapOptions.center,
			map: settings.map,
			title: 'Picked Location'
		});

		settings.map.addListener('click', function (e) {
			settings.click({ lat: e.latLng.lat(), lng: e.latLng.lng() });
			
			settings.marker.setPosition(e.latLng);
			settings.latInput.val(e.latLng.lat());
			settings.lngInput.val(e.latLng.lng());
		});

		return this;
	};
});