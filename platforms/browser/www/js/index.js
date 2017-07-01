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

        document.addEventListener('resume', function(evt) {
            if(evt.action === 'resume' && evt.pendingResult) {
                var r = evt.pendingResult;
                if(r.pluginServiceName === 'Camera' && r.pluginStatus === 'OK') {
                // r.result contains file:/// url or a base64 image.

                    $("#cameraTest").html("IN");
                    var smallImage = document.getElementById('smallImage');

                    $("#cameraTest").html("go22");
                smallImage.style.display = 'block';

                    $("#cameraTest").html("go33");
                smallImage.src = r.result;


                }
            }
        }, false);

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
       /* var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
*/

        googleMapApi.drawMapInitial();

        console.log('Received Event: ' + id);
    }
};


// ############################ Camera ############################
var cameraApi = {

    takePicture: function() {

         $("#cameraTest").html("ZZZZZZZ");
       // alert("camera");
      navigator.camera.getPicture( function( imageURI ) {


    $("#cameraTest").html("HIT " + imageURI);

          /*setTimeout(function() { 
            
          alert('ddd');
        alert( imageURI );
         }, 0);*/



         $("#cameraTest").html("go1");
      var smallImage = document.getElementById('smallImage');

         $("#cameraTest").html("go2");
      smallImage.style.display = 'block';

         $("#cameraTest").html("go3");
      smallImage.src = imageURI;

         $("#cameraTest").html("go4");


      },
      function( message ) {
        alert( message );
      },
      {
        quality: 10,
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
        googleMapApi.drawMap(position);

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

        googleMapApi.drawMap(position);

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


    drawMapInitial: function() {

            var mapContainer = $('#googleMap');

            var newLatLong = new google.maps.LatLng(41.9961439,21.4318572); // Skopje

            var mapProp= {
                center: newLatLong,
                zoom:16,
                //draggable: false ,
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


    drawMap: function(position) {


           // alert("index.js - google map Api- draw poi lat: " + position.coords.latitude + ";;" + position.coords.longitude);

            var newLatLong = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

            var newMarker = new google.maps.Marker({ position: newLatLong, map:map });

            map.panTo(newLatLong); // move to the next marker

            //alert("1");
            //googleMapApi.clearMarkers();
            //googleMapApi.addMarker(newLatLong);
    },


    drawStaticMap: function(position) {
            var container = $('#googleMap');
            var imageUrl = "https://maps.googleapis.com/maps/api/staticmap?sensor=false&center=" + position.coords.latitude + "," +  
                        position.coords.longitude + "&zoom=18&size=640x500" + "&key=AIzaSyCXWhC15jIOu95QuaTBvRHYkc6Npi0HBvw";  

            //https://maps.googleapis.com/maps/api/staticmap?center=52.47433501832194,9.891406250000045&zoom=18&size=640x500&markers=color:blue|label:S|52.47433501832194,9.891406250000045&key=AIzaSyCXWhC15jIOu95QuaTBvRHYkc6Npi0HBvw
            //https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY        &zoom=13&size=600x300&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=YOUR_API_KEY

            $('<img/>',{
            src : imageUrl
            }).appendTo(container);
    }/*,


    // Sets the map on all markers in the array.
      setMapOnAll: function (map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      },

      // Removes the markers from the map, but keeps them in the array.
      clearMarkers: function() {
        //alert("2");
        setMapOnAll(null);
      },

      // Adds a marker to the map and push to the array.
      addMarker: function (location) {
          alert("add marker");
        var marker = new google.maps.Marker({
          position: location,
          map: map
        });
        markers.push(marker);
      }*/

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