
$(document).ready(function() {
//   var visqueryURL= "http://www.n2yo.com/rest/v1/satellite/visualpasses/25544/30.2672/-97.7431/0/2/300/&apiKey=LME2C6-YYCFP8-NGPFAZ-3TA8"; 
    var visqueryURL= " ";
//    var radqueryURl="https://www.n2yo.com/rest/v1/satellite/radiopasses/25544/30.2672/-97.7431/0/2/40/&apiKey=LME2C6-YYCFP8-NGPFAZ-3TA8";
    var radqueryURl=" ";
    var tlequeryURL="https://www.n2yo.com/rest/v1/satellite/tle/25544&apiKey=LME2C6-YYCFP8-NGPFAZ-3TA8" ;
   // var tlequeryURL="";
   var elevationURL="http://maps.googleapis.com/maps/api/elevation/json?locations=30.2672,-97.7431&key=AIzaSyDoQLe8s7JUbTZ_ubXhGY4cUmLiNqWvQxw";
//   var elevationURL=" ";
    var elevation=0;
    var entrylat=0;
    var entrylong=0;
    var exitlat=0;
    var exitlong=0;
    var tlestring="";
    var tle1="";
    var tle2="";

    var startUTC=1526901635;
    var endUTC=1526912400;

    

    if (visqueryURL!==" "){
        $.ajax({
            url: visqueryURL,
            method: "GET"
        }).then(function(response) {

            console.log(response);
            startUTC=response.passes[5].startUTC;
            endUTC=response.passes[5].endUTC;
         
            console.log("Startutc: "+startUTC+" endutc: "+endUTC);
         //   var  test1_time=moment(startUTC,"x").toDate();
         //   console.log("starting test time:  "+test1_time.getTime());
         //   var  test2_time=moment(endUTC,"x").toDate();
         //   console.log("starting test time:  "+test2_time.getTime());
     
        }).fail(function(err) {
            console.log("Fail:  "+err);
            throw err;

        });
    }

    if (radqueryURl!==" "){
        $.ajax({
            url: radqueryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            for (var i=0; i<response.passes.length; i++){
                console.log("pass: "+i);
               // entrylat=response.passes[1].satlatitude;
              //  entrylong=response.passes[1].satlongitude;
               // exitlat=response.passes[1].satlatitude;
               // exitlong=response.passes[1].satlongitude;
              //  console.log("entry lat: "+entrylat+" entrylong: "+entrylong+" exit lat: "+exitlat+" exitlong: "+exitlong);
                
              //  var entry={lat: entrylat , lng: entrylong };
               // console.log("entry: "+entry);
              //  var marker_entry = new google.maps.Marker({
              //      position: entry,
               //     title: "entry"+i
               // });
              //  marker_entry.setMap(map);
              //  var exit={lat: exitlat, lng: exitlong};
               // console.log("exit: "+exit);
              //  var marker_exit = new google.maps.Marker({
              //      position: exit,
              //      title: "exit"+i
              //  });
              //  marker_exit.setMap(map);  
            };     
        }).fail(function(err) {
            console.log("Fail:  "+err);
            throw err;

        });
    }   
    if(elevationURL!==" "){
    
     //   var elevator = new google.maps.ElevationService;
     //   elevator.LocationElevationRequest(30.2672, -97.7431);
        $.ajax({
            url: elevationURL,
            method: "GET",
            headers: {"Access-Control-Allow-Origin": "localhost"}
            //"Origin": "github.io"
        }).then(function(response) {
            console.log(response);
            elevation=response.elevation;
            console.log("This is the google elevation: "+elevation);
        }).fail(function(err) {
            console.log("Fail:  "+err);
            throw err;
        });
    }

    if(tlequeryURL!==" "){
        $.ajax({
            url: tlequeryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response.tle);
            tlestring=response.tle;
            tle1=tlestring.split("\r\n")[0];
            tle2=tlestring.split("\r\n")[1];
            console.log("tle1: "+tle1+" tle2: "+tle2);

            //sattelite object ititalized
            var satrec = satellite.twoline2satrec(tle1, tle2);

            //entry point code

            var starttime=moment(startUTC,"x").toDate();


            var positionAndVelocity = satellite.propagate(satrec, starttime);

            var positionEci = positionAndVelocity.position;
            var velocityEci = positionAndVelocity.velocity;

            var gmst = satellite.gstime(starttime);

            var positionGd = satellite.eciToGeodetic(positionEci, gmst);

            var longitude = positionGd.longitude;
            var    latitude  = positionGd.latitude;

            var longitudeStr = satellite.degreesLong(longitude);
            var latitudeStr  = satellite.degreesLat(latitude);
            console.log("entry sat long: "+longitudeStr+" entry sat lat: "+latitudeStr);

            var enter={lat: latitudeStr, lng: longitudeStr };
            console.log("entry: "+enter);
            var marker_enter = new google.maps.Marker({
                position: enter,
                title: "enter"
            });
            marker_enter.setMap(map); 


            //exit point code

            var endtime=moment(endUTC,"x").toDate();

            var exit_positionAndVelocity = satellite.propagate(satrec, endtime);

            var exit_positionEci = exit_positionAndVelocity.position;
            var exit_velocityEci = exit_positionAndVelocity.velocity;

            var exit_gmst = satellite.gstime(endtime);

            var exit_positionGd = satellite.eciToGeodetic(exit_positionEci, exit_gmst);

            var exit_longitude = exit_positionGd.longitude;
            var exit_latitude = exit_positionGd.latitude;

            var exit_longitudeStr = satellite.degreesLong(exit_longitude);
            var exit_latitudeStr  = satellite.degreesLat(exit_latitude);
            console.log("exit sat long: "+exit_longitudeStr+" exitsat lat: "+exit_latitudeStr);

            var exit={lat: exit_latitudeStr , lng: exit_longitudeStr};
            console.log("exit: "+exit);
            var marker_exit = new google.maps.Marker({
                position: exit,
                title: "exit"
            });
            marker_exit.setMap(map);   

            //draw line
            var satPathCoordinates = [
                {lat: latitudeStr, lng: longitudeStr},
                {lat: exit_latitudeStr, lng: exit_longitudeStr},
              ];
            var satPath = new google.maps.Polyline({
                path: satPathCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
              });
            satPath.setMap(map);


            var roll_LineCoord=[];
              
            // for(var i=0; i<100; i++){
            //    var rolltime=moment((startUTC+(i*10000)),"x").toDate();
            //    console.log(rolltime.getTime());
            //     var roll_positionAndVelocity = satellite.propagate(satrec, rolltime);
    
            //     var roll_positionEci = roll_positionAndVelocity.position;
            //     var roll_velocityEci = roll_positionAndVelocity.velocity;
    
            //    var roll_gmst = satellite.gstime(rolltime);
    
            //     var roll_positionGd = satellite.eciToGeodetic(roll_positionEci, roll_gmst);
    
            //     var roll_longitude = roll_positionGd.longitude;
            //     var roll_latitude  = roll_positionGd.latitude;
    
            //      var roll_longitudeStr = satellite.degreesLong(longitude);
            //      var roll_latitudeStr  = satellite.degreesLat(latitude);
            //     roll_LineCoord.push({lat: roll_latitudeStr, lng: roll_longitudeStr});
            // }
            // console.log(roll_LineCoord);

            // var roll_satPath = new google.maps.Polyline({
            //     path: satPathCoordinates,
            //     geodesic: true,
            //     strokeColor: '#0000FF',
            //     strokeOpacity: 1.0,
            //     strokeWeight: 2
            //   });
            // roll_satPath.setMap(map);

            
        
        
        }).fail(function(err) {
        console.log("Fail:  "+err);
        throw err;
        });
    }
        
    

});