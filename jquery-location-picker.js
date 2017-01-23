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
			latInput: $(document.createElement('input')).attr('type', 'hidden').attr('name', 'latitude').addClass('location-picker-input-latitude'),
			lngInput: $(document.createElement('input')).attr('type', 'hidden').attr('name', 'longitude').addClass('location-picker-input-longitude'),
			mapElement: $(document.createElement('div')),
			click: function () {}
		}, options);

		settings.mapElement.css({ height: settings.height });
		this.css({ height: settings.height })
			.append(settings.mapElement)
			.append(settings.latInput)
			.append(settings.lngInput);

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

		settings.latInput.val(settings.mapOptions.center.lat);
		settings.lngInput.val(settings.mapOptions.center.lng);

		return this;
	};
});