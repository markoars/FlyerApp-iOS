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
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }






};



var cameraApi = {


    // ############################ Camera #################################
    takePicture: function() {
        alert("camera");
      navigator.camera.getPicture( function( imageURI ) {
        alert( imageURI );
      },
      function( message ) {
        alert( message );
      },
      {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
      });
    }
    
};



// ############################ Geo Location ############################
var locationApi = {


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
    },

    getLocation: function(){


        alert("start");
        navigator.geolocation.getCurrentPosition(locationApi.onGeoLocationSuccess, locationApi.onGeoLocationError);
        alert("end");
    },

    onGeoLocationSuccess: function(position){

        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;


        locationApi.drawMap(position);

        // Send coordinates to server
        $.getJSON('http://maxbet.mk.azhar.arvixe.com/api/products/1/' + longitude + '/' + latitude + '/')
                .done(function (data) {
                    alert("sucessfully inserted coordinate to server");
                })
                .fail(function (jqXHR, textStatus, err) {
                        alert("fail gps 1 " + textStatus);
                 });

    },
    
    onGeoLocationError: function(error){
        alert("the code is " + error.code + ". \n" + "message: " + error.message);

        switch(error.code)
        {
            case error.PERMISSION_DENIED: alert("user did not share geolocation data");
            break;

            case error.POSITION_UNAVAILABLE: alert("could not detect current position");
            break;

            case error.TIMEOUT: alert("retrieving position timed out");
            break;

            default: alert("unknown error");
            break;
        }
    },





    initiate_watchlocation: function() {  


        if(!$("#initWatch").hasClass("active"))
        {
            $("#initWatch").addClass("active");
            $("#stopWatch").removeClass("active");
        }
        
        

        if(watchProcess == null){
        alert("watch process starting");
        watchProcess = navigator.geolocation.watchPosition(locationApi.watchLocationSuccess,locationApi.watchLocationError);
        }
    },

    stop_watchlocation: function() { 


        if(!$("#stopWatch").hasClass("active"))
        {
            $("#stopWatch").addClass("active");
            $("#initWatch").removeClass("active");
        }

        if(watchProcess != null){
        alert("watch process stopping");
        navigator.geolocation.clearWatch(watchProcess);
        }
    },

    watchLocationSuccess: function(position){
            //alert("handle success");
            locationApi.drawMap(position);
    },

     watchLocationError: function(error){
        
        switch(error.code)
        {
            case error.PERMISSION_DENIED: alert("User did not share geolocation data");break;  
            case error.POSITION_UNAVAILABLE: alert("Could not detect current position");break;  
            case error.TIMEOUT: alert("Retrieving position timed out");break;  
            default: alert("Unknown Error");break;  
        }
    },

    drawMap: function(position) {
        // alert("draw poi");
            var container = $('#map_canvas');
            //var zoomLevel = $('#zoomLevel');
            var myLatLong = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            var mapOptions = {
            center: myLatLong,
            zoom: 19,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(container[0],mapOptions);
            container.css('display','block');
            var marker = new google.maps.Marker({ 
            position: myLatLong,
            map:map,
            title:"My Position (Accuracy of Position: " + position.coords.accuracy + " Meters), Altitude: " 
                + position.coords.altitude + ' Altitude Accuracy: ' + position.coords.altitudeAccuracy
            });
    }


    
};
