/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);




        // When app`s getting killed by the GBC, and it resumes, this method is called:
       /* document.addEventListener('resume', function(evt) {
            if(evt.action === 'resume' && evt.pendingResult) {
                var r = evt.pendingResult;
                if(r.pluginServiceName === 'Camera' && r.pluginStatus === 'OK') {
                // r.result contains file:/// url or a base64 image.

                    $("#cameraTest").html("IN");
                    var smallImage = document.getElementById('smallImage');
                    smallImage.style.display = 'block';
                    smallImage.src = r.result;
                }
            }
        }, false);
    */


    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');


         $("#cameraTest").html("Readey");
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        googleMapApi.createMapInitial();

        console.log('Received Event: ' + id);
    }
};


// ############################ Camera ############################
var cameraApi = {

    takePicture: function() {

        $("#cameraTest").html("camera");

        if(lastLocation != null)
        {
            //alert("not null");
            googleMapApi.addMarkerImage();
        }
        else
        {
            alert("last location is null");
        }

        navigator.camera.getPicture( function( imageURI ) {

        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
        smallImage.src = imageURI;
        //$("#cameraTest").html(imageURI);
      },
      function( message ) {
        alert( message );
      },
      {
        quality: 20,
        destinationType: Camera.DestinationType.FILE_URI
      });


    }
    
};



// ############################ Geo Location ############################
var locationApi = {

    getLocation: function(){
        navigator.geolocation.getCurrentPosition(locationApi.onGetLocationSuccess, locationApi.onGetLocationError);
    },

    onGetLocationSuccess: function(position){
        //alert("GPS success");

        googleMapApi.addMarkerLocation(position);
       
        webApi.sendCoordinatesToServer(position);
    },
    
    onGetLocationError: function(error){
        //alert("index.js - the code is " + error.code + ". \n" + "message: " + error.message);

        switch(error.code)
        {
            case error.PERMISSION_DENIED: alert("User did not share geolocation data");break;  
            case error.POSITION_UNAVAILABLE: alert("Could not detect current position");break;  
            case error.TIMEOUT: alert("Retrieving position timed out");break;  
            default: alert("Unknown Error");break;  
        }
    },



    init_WatchLocation: function() {  

            $("#initWatch").toggleClass("active");
            $("#stopWatch").toggleClass("active");

            if(watchProcess == null){
            //alert("watch start");
            watchProcess = navigator.geolocation.watchPosition(locationApi.watchLocationSuccess, locationApi.watchLocationError);
            }
    },

    stop_WatchLocation: function() { 

            $("#initWatch").toggleClass("active");
            $("#stopWatch").toggleClass("active");

            if(watchProcess != null){
            navigator.geolocation.clearWatch(watchProcess);
            watchProcess = null;
           // alert("index.js - watch stopped");
            }
    },

    watchLocationSuccess: function(position){

        //alert("index.js - handle success");

        googleMapApi.addMarkerLocation(position);

        webApi.sendCoordinatesToServer(position);
    },

    watchLocationError: function(error){
        
        switch(error.code)
        {
            case error.PERMISSION_DENIED: alert("User did not share geolocation data");break;  
            case error.POSITION_UNAVAILABLE: alert("Could not detect current position");break;  
            case error.TIMEOUT: alert("Retrieving position timed out");break;  
            default: alert("Unknown Error");break;  
        }
    }
};


// ############################ Map ############################
var googleMapApi = {


    createMapInitial: function() {

            var mapContainer = $('#googleMap');

            var newLatLong = new google.maps.LatLng(41.9961439,21.4318572); // Skopje

            var mapProp= {
                center: newLatLong,
                zoom:16,
                draggable: false ,
                streetViewControl: false ,
                mapTypeControl: false,
                disableDoubleClickZoom: true,
                scrollwheel: false,
                backgroundColor: '#f2efe9',
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(mapContainer[0],mapProp);

            //var newMarker = new google.maps.Marker({ position: newLatLong, map:map });
    },


    // Adds a marker to the map and push to the array.
    addMarkerLocation: function(position) {

        var newLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        lastLocation = newLatLong; // Save last known location

        googleMapApi.clearMarkers(); // Delete/Clear all previous

        var marker = new google.maps.Marker({
          position: newLatLong,
          map: map
        });

        markersLocation.push(marker);
        map.panTo(newLatLong); 
      },


    addMarkerImage: function(/*position*/) {

       // var newLatLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var marker = new google.maps.Marker({
            position: lastLocation,
            map: map,
            icon: new google.maps.MarkerImage("https://cdn3.iconfinder.com/data/icons/humano2/48x48/mimetypes/image-x-photo-cd.png") 
        });


        markersImage.push(marker);
        map.panTo(newLatLong); 
    },

    // Sets the map on all location markers in the array.
    setLocationMarkersOnMap: function(mapObj) {
        for (var i = 0; i < markersLocation.length; i++) {
            markersLocation[i].setMap(mapObj);
        }
    },


    clearMarkers: function() {
        googleMapApi.setLocationMarkersOnMap(null);
    },

    
    deleteMarkers: function() {
        googleMapApi.clearMarkers();
        markersLocation = [];
    },


    createStaticMap: function(position) {
            var container = $('#googleMap');

            var latlon = position.coords.latitude + "," + position.coords.longitude;

            var imageUrl = "https://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false&key=AIzaSyCXWhC15jIOu95QuaTBvRHYkc6Npi0HBvw";

            //https://maps.googleapis.com/maps/api/staticmap?center=52.47433501832194,9.891406250000045&zoom=18&size=640x500&markers=color:blue|label:S|52.47433501832194,9.891406250000045&key=AIzaSyCXWhC15jIOu95QuaTBvRHYkc6Npi0HBvw
            //https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY        &zoom=13&size=600x300&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=YOUR_API_KEY

            $('<img/>',{
            src : imageUrl
            }).appendTo(container);
    }

};


// ############################ Web ############################
var webApi = {

    sendCoordinatesToServer: function(position){

            var longitude = position.coords.longitude;
            var latitude = position.coords.latitude;

            //alert("index.js - send coordinates to Server enter");

            // Send coordinates to server
            $.getJSON('http://maxbet.mk.azhar.arvixe.com/api/products/1/' + longitude + '/' + latitude + '/')
                    .done(function (data) {
                        //alert("Sucessfully send coord to server. long: " + longitude + " lat: " + latitude);
                    })
                    .fail(function (jqXHR, textStatus, err) {
                            //alert("Failed to send coord to server. " + textStatus);
                    });

    },

    sendDummyLocation: function(){

            alert("start dummy");
            $.getJSON('http://maxbet.mk.azhar.arvixe.com/api/products/1/333/333/')
                    .done(function (data) {
                        alert("sucessfully inserted coordinate to server");
                    })
                    .fail(function (jqXHR, textStatus, err) {
                            alert("fail gps 1 " + textStatus);
                    });
            alert("end dummy");
    }
};