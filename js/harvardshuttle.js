/* harvardshuttle.js
 * By: Kenny Lei
 * Requires jquery.transloc.js and Bing Maps script
 */

!function($){
    //map display
    var map = new Microsoft.Maps.Map(document.getElementById("mapContainer"), 
                           {credentials: "Au_jWk_Qb6NBEsBFa4A97J8FbJ6zvY5IfGYoW6N32o-AAonat2ZklhAh77RNB4lf", enableClickableLogo: false, enableSearchLogo: false,
                            center: new Microsoft.Maps.Location(42.3735, -71.1191),
                            mapTypeId: Microsoft.Maps.MapTypeId.road,
                            zoom: 15});
 


    //shuttle display
    //harvard agency #52
	var $harvard = 52;

	var $fromStops = $('#fromStops');
	var $toStops = $('#toStops');

	var $arrivals = $('.arrivals');

    // data cache variables
    var $route_names = new Array();
    var $route_stops = new Array();

    var $stop_lat = new Array();
    var $stop_lng = new Array();

    var $pins = new Array();

    // display and cache stop information
	$.transloc('stops', {
		agencyIds: [$harvard],
		success: function(stops){
			$.each(stops, function(i, stop){
				$fromStops.append('<option value="'+stop.stop_id+'">'+stop.name+'</option>');
				$toStops.append('<option value="'+stop.stop_id+'">'+stop.name+'</option>');
                $stop_lat[stop.stop_id] = stop.location.lat;
                $stop_lng[stop.stop_id] = stop.location.lng;
                $pins[stop.stop_id] = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(stop.location.lat, stop.location.lng), null); 
			});
		}
	});

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            
            map.dispose();
            // new map if geolocation data is present
            map = new Microsoft.Maps.Map(document.getElementById("mapContainer"), 
                           {credentials: "Au_jWk_Qb6NBEsBFa4A97J8FbJ6zvY5IfGYoW6N32o-AAonat2ZklhAh77RNB4lf", enableClickableLogo: false, enableSearchLogo: false,
                            center: new Microsoft.Maps.Location(latitude, longitude),
                            mapTypeId: Microsoft.Maps.MapTypeId.road,
                            zoom: 15});

            // Add a pin to the center of the map, using a custom icon
            var pin = new Microsoft.Maps.Pushpin(map.getCenter(), null); 

            map.entities.push(pin);

            // find closest shuttle stop
            var closest_distance = Number.MAX_VALUE;
            var closest_stop = null;
            for (var i in $stop_lat){
                var temp_distance = distance(latitude, longitude, $stop_lat[i], $stop_lng[i]);
                if (temp_distance < closest_distance){
                    closest_stop = i;
                    closest_distance = temp_distance;
                }
            }
            // update that in the select form
            $('#fromStops').val(closest_stop);
            updateTimes();

            $('.btn-group').remove();
            $('select').removeAttr("style");
            $('select').selectpicker();
        });
    }

    // place shuttle stop pushpins
    for (var i in $pins){
            map.entities.push($pins[i]);
    }

    // cache route information
    $.transloc('routes', {
        agencyIds: [$harvard],
        success: function(routes){
            var routes = routes[$harvard];
            $.each(routes, function(i, route){
                $route_names[route.route_id] = route.long_name;
                $route_stops[route.route_id] = new Array();
                $.each(route.stops, function(j, stop){
                    $route_stops[route.route_id][stop] = true;
                });
            });
        },
    });

    // helper functions
    function updateTimes(){
        $fromStop = $('#fromStops').val();
        $toStop = $('#toStops').val();

        $arrivals.empty();
        if ($fromStop != 0){
            $.transloc('arrival-estimates', {
                agencyIds: [$harvard],
                stopIds: [$fromStop],
                success: function(arrival_estimates){
                    //$arrivals.append('<h4>Next Shuttles:</h4>');
                    $.each(arrival_estimates, function(i, stop){
                        $.each(stop.arrivals, function(j, arrival){
                           if ($toStop == 0 || ($toStop != 0 && $route_stops[arrival.route_id][$toStop]))
                            {
                                var rawDate = arrival.arrival_at.substring(0, arrival.arrival_at.length-6);
                                var formattedDate = rawDate.replace(/-/g,'/').replace(/T/g, ' ');
                                var minutes = Math.round(Math.abs(new Date(formattedDate) - new Date())/(1000*60));
                                $arrivals.append('<div class="well"><h4><img src="img/bus.png" alt="Walk"> '+$route_names[arrival.route_id]+'</h4> <p>'+minutes+' minutes</p></div>');
                            }
                        });
                    });
                }

            });

            if ($toStop != 0){
                //walking times using maps api
                Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { callback: function(){
                    var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
                    
                    Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', displayWalkTime);
                    var startWaypoint = new Microsoft.Maps.Directions.Waypoint({location: new Microsoft.Maps.Location($stop_lat[$fromStop], $stop_lng[$fromStop])});
                    var endWaypoint = new Microsoft.Maps.Directions.Waypoint({location: new Microsoft.Maps.Location($stop_lat[$toStop], $stop_lng[$toStop])});
                    
                    directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.walking });
                    directionsManager.addWaypoint(startWaypoint);
                    directionsManager.addWaypoint(endWaypoint);

                    directionsManager.calculateDirections();
                }   
                });
            }
        }
    }

    function displayWalkTime(e){
        $arrivals.prepend('<div class="well"><h4><img src="img/walk.png" alt="Walk">Walk</h4><p>'+Math.round(e.routeSummary[0].time/60) + ' minutes</p></div>');
    }

    function hasStop(route_id, stop_id){
        $.each($route_stops[route_id], function(i, stop){
            if (stop == null) return true;
        });
        return false;
    }

    function distance(from_lat, from_lng, to_lat, to_lng){
        return ((from_lat-to_lat)*(from_lat-to_lat)) + ((from_lng-to_lng)*(from_lng-to_lng));
    }

    // event handlers
    $('#switch').click(function(){
        var fromStopId = $('#fromStops').val();
        var toStopId = $('#toStops').val();
        // remove old selection
        $('#fromStops').val(toStopId);
        $('#toStops').val(fromStopId);
        updateTimes();

        $('.btn-group').remove();
        $('select').removeAttr("style");
        $('select').selectpicker();
    });

    $('#fromStops').change(function(){
        updateTimes()
    });

    $('#toStops').change(function(){
        updateTimes();
    });

    setInterval(function(){updateTimes()}, 20000);

    setTimeout(function(){$('select').selectpicker()}, 300);

}(window.jQuery);
