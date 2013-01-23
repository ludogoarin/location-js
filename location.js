//      Location.js 0.5
//      http://locationjs.org
//      (c) 2009-2013 Ludo Goarin.
//      LocationJS may be freely distributed under the MIT license.
//      requires jQuery and Google Maps JS API

if (!locjs) var locjs = {};
if (!locjs.geo) locjs.geo = {};

/* Classes
 -----------------------------------*/

locjs.geo.location = function() {
    this.latitude = new Number();
    this.longitude = new Number();
    this.postal_code = "";
    this.city = "";
    this.state_region = "";
    this.country = "";
    this.location_type = "";
    this.formatted_address = "";
    this.location_url_format = "";
    this.raw_input = "";
}


/* Services
 -----------------------------------*/

locjs.geo.gmapsService = function () {
    var geocoder;
    var map;

    // get top category list
    var getGeoData_Error = function (xhr) {
        locjs.utils.processAjaxError(xhr);
    };

    var getGeoData_Result = function (result) {
        var openHtml = "";
        var closeHtml = "";
        var selCatTemplate = "location address: {0} - {1}";
        var FullListHtml = "";
        var newLine = "\n";

        // Send Result
        var returnData = result;
        if (returnData != null) {

            // Add result info to the element
            alert(returnData.results.formatted_address);
        }
        else {
            alert("is null");
        }
    }

    this.getGeoDataFromAddress = function (address, fn_callback, command) {
        if (!geocoder) geocoder = new google.maps.Geocoder();
        if (geocoder) {
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log(results);
                    var resObject = results[0];
                    var loc = resObject.geometry.location;
                    var formatted_address = resObject.formatted_address;

                    // get longitude and latitude
                    var lat = loc.lat();
                    var lng = loc.lng();

                    var postal_code = "";
                    var city = "";
                    var neighborhood = "";
                    var country = "";
                    var state_region = "";
                    var location_type = "";

                    $.each(resObject.address_components, function (index, value) {
                        var types = value.types;
                        if (types[0] == "postal_code") {
                            postal_code = value.short_name;
                        } else if (types[0] == "locality") {
                            city = value.short_name;
                        } else if (types[0] == "country") {
                            country = value.short_name;
                        } else if (types[0] == "administrative_area_level_1") {
                            state_region = value.short_name;
                        }
                    });

                    var new_location = new locjs.geo.location();
                    new_location.latitude = lat;
                    new_location.longitude = lng;
                    new_location.postal_code = postal_code;
                    new_location.city = city;
                    new_location.state_region = state_region;
                    new_location.country = country;
                    new_location.formatted_address = formatted_address;
                    new_location.raw_input = address;

                    // callback
                    fn_callback(new_location, command);

                } else {
                    console.log("Location not found (" + status + ")");

                    var new_location = new locjs.geo.location();
                    new_location.latitude = 0;
                    new_location.longitude = 0;
                    new_location.postal_code = "";
                    new_location.city = "";
                    new_location.state_region = "";
                    new_location.country = "";
                    new_location.formatted_address = "";
                    new_location.raw_input = "";

                    // callback
                    fn_callback(new_location, command);
                }
            });
        }
    }

    this.getUserLocation = function () {
        // get user location
        var userLoc = new user_location();
        var userLocFound = false;
        if (google.loader.ClientLocation) {
            userLocFound = true;
            var uposition = google.loader.ClientLocation;
            userLoc.latitude = uposition.latitude;
            userLoc.longitude = uposition.longitude;
            userLoc.city = uposition.address.city;
            userLoc.country = uposition.address.country_code;
            userLoc.state_region = uposition.address.region;
        }

        return userLoc;
    }

    this.addMarker = function (location) {
        initGMapsAPI(location);

        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
    }

    this.setGeoLocation = function (coordinates) {
        var latlng = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);
        if (!geocoder) geocoder = new google.maps.Geocoder();
        if (geocoder) {
            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log(results);
                    var resObject = results[0];
                    var loc = resObject.geometry.location;
                    var formatted_address = resObject.formatted_address;

                    // get longitude and latitude
                    var lat = loc.b;
                    var lng = loc.c;

                    // can also be called thru lat and lng functions (presumably slower)
                    //var lat = loc.lat();
                    //var lng = loc.lng();

                    var postal_code = "";
                    var city = "";
                    var neighborhood = "";
                    var country = "";
                    var state = "";

                    $.each(resObject.address_components, function (index, value) {
                        var types = value.types;
                        if (types[0] == "postal_code") {
                            postal_code = value.short_name;
                        } else if (types[0] == "locality") {
                            city = value.short_name;
                        } else if (types[0] == "country") {
                            country = value.short_name;
                        } else if (types[0] == "administrative_area_level_1") {
                            state_region = value.short_name;
                        }
                    });

                } else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });
        }
    }

    this.addMarkerByAddress = function (address) {

        if (geocoder) {
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    alert("This location could not be found (" + status + ")");
                }
            });
        }
    }

    this.addMarkerByCoordinates = function (latitude, longitude) {
        var latlng = new google.maps.LatLng(-34.397, 150.644);

        if (geocoder) {
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    alert("This location could not be found (" + status + ")");
                }
            });
        }
    }

    this.createMapMarkerByCoordinates = function (lat, lng, html, primary_key, targetMap) {
        var point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
        var markerOption = {
            draggable: false,
            map: targetMap,
            position: point,
            title: html,
            visible: true
        };
        var marker = new google.maps.Marker(markerOption);
        marker.primary_key = primary_key
        return marker;
    }

    this.initGMapsAPI = function (lat, lng, zoomLevel, targetElement) {
        if (!targetElement) {
            targetElement='map_canvas';
        }

        if ($('#' + targetElement).length > 0) {
            if (!geocoder) geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat, lng);
            var myOptions = {
                zoom: zoomLevel,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map(document.getElementById(targetElement), myOptions);
            return map;
        } else {
            return null;
        }
    }
}

locjs.geo.locationService = function() {

    var currentPosition = new locjs.geo.location();

    var handleNoGeolocation = function (errorFlag, error) {
        if (errorFlag == true) {
            // should have worked but service failed
            //alert(error.message + " / " + error.code);
        } else {
            //alert(error.message + " / " + error.code);
        }
        ipLoc();
    }

    // IP based
    var ipLoc = function () {
        if (google.loader.ClientLocation) {
            var position = google.loader.ClientLocation;
            currentPosition.latitude = position.latitude;
            currentPosition.longitude = position.longitude;
            setLocationQuery(currentPosition);
            return currentPosition;
        }
    }

    // Google Gears Geolocation
    var gearsLoc = function () {
        browserSupportFlag = true;
        var geo = google.gears.factory.create('beta.geolocation');
        geo.getCurrentPosition(function (position) {
            currentPosition.latitude = position.latitude;
            currentPosition.longitude = position.longitude;
            return currentPosition;
        }, function (error) {
            handleNoGeoLocation(browserSupportFlag, error);
        });
    }

    // W3C Geolocation (Preferred)
    var navigatorGeoLoc = function () {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function (position) {
            currentPosition.latitude = position.coords.latitude;
            currentPosition.longitude = position.coords.longitude;
            return currentPosition;
        }, function (error) {
            handleNoGeolocation(browserSupportFlag, error);
        });
    }

    this.getLocation = function () {
        // IP based
        ipLoc();
    }

    this.getLocationSequence = function () {
        if (navigator.geolocation) {
            // Try W3C Geolocation (Preferred)
            navigatorGeoLoc();
        } else if (google.gears) {
            // Try Google Gears Geolocation
            gearsLoc();
        } else {
            // IP based
            ipLoc();
        }
    }
}


/* Utils
 -----------------------------------*/

locjs.utils = {

    processAjaxError: function (xhr) {
        // implement code to log errors
        console.log(xhr);

        return;
    },

    // old school debugging useful for mobile browser: reveals all properties of an object through confirm method (ok/cancel)
    dumpProps: function (obj, parent) {
        // Go through all the properties of the passed-in object
        for (var i in obj) {
            // if a parent (2nd parameter) was passed in, then use that to
            // build the message. Message includes i (the object's property name)
            // then the object's property value on a new line
            if (parent) { var msg = parent + "." + i + "\n" + obj[i]; } else { var msg = i + "\n" + obj[i]; }
            // Display the message. If the user clicks "OK", then continue. If they
            // click "CANCEL" then quit this level of recursion
            if (!confirm(msg)) { return; }
            // If this property (i) is an object, then recursively process the object
            if (typeof obj[i] == "object") {
                if (parent) { dumpProps(obj[i], parent + "." + i); } else { dumpProps(obj[i], i); }
            }
        }
    },

    getGoogleMapsUrl: function (address) {
        var formatted_address = escape(address.replace(' ', '+'));
        return 'https://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=' + formatted_address + '&amp;aq=0&amp;ie=UTF8&amp;z=12&amp;output=embed';
    },

    getDistance: function () {
        var rad = function (x) { return x * Math.PI / 180; }

        this.distHaversine = function (p1, p2) {
            var R = 6371; // earth's mean radius in km
            var dLat = rad(p2.lat() - p1.lat());
            var dLong = rad(p2.lng() - p1.lng());

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;

            return d.toFixed(3);
        }
    }
};
