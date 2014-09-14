// Create by Ryan Gerety, 2008; 2013

// The marker list and category list are both stored in a ZOHO Creator Project
//    and are pulled in as JSON feeds.


// quick lookups for the address search
var lookup = [];
lookup["HOME"] = new google.maps.LatLng(38.892091, -77.024055);
lookup["WARD 1"] = new google.maps.LatLng(38.9257710173114,-77.03307754656279);
lookup["WARD 2"] = new google.maps.LatLng(38.8933366812273, -77.04199925795371);
lookup["WARD 3"] = new google.maps.LatLng(38.9365491952121, -77.07964531779101);
lookup["WARD 4"] = new google.maps.LatLng(38.9638185581296, -77.0341455359444);
lookup["WARD 5"] = new google.maps.LatLng(38.9254345782814, -76.985473859373);
lookup["WARD 6"] = new google.maps.LatLng(38.8859430922697, -76.9991942796747);
lookup["WARD 7"] = new google.maps.LatLng(38.8866743538472, -76.9473423019187);
lookup["WARD 8"] = new google.maps.LatLng(38.8398806314691, -77.0069472722281);


// INIT GLOBAL VARS
var origin = lookup["HOME"];   //starting point of reference
var zoom = 11;
var includeType = [];  //types currently selected
var markerCategories = [];
var markerColors = []; //category type to color
var mylist_html = [];  //list of locations

var markers = [];      //array of markers coming from data
var google_markers = [];     //google markers displayed on map

var selectedMarkers = [];  //markers with specified type

var geocoder = new google.maps.Geocoder();  //geocode object for address search

// Set default category set in the map page;
if( find != "" ){  includeType[find] = true; }

// defines the green arrow used for home
var home_icon =  "markers/arrow.png";

// leters used to identify the locations
var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

// Loads the data from zoho
function load(){
    // First load the categories, the callback function will then load markers
    var jScript = document.createElement('script');
    jScript.type = 'text/javascript';
    jScript.src = 'https://creator.zoho.com/dcfoodfinder/json/2/callback=loadCategories/Xutqty6zu5Kqns541PmVj488VfKEDBXG7T4YnYs6W9UGvEhOXhCT96HKx9rEtw0OuDvGwArwgKy4xxRpBh0H9kZjr8MEhwsKe0u5'
    document.getElementsByTagName("head")[0].appendChild(jScript);
}

// Load categories from Zoho 
function loadCategories(root) {
    markerCategories = root.Resource_Services || [];
    for( var i in markerCategories ){      // Set marker colors
       markerColors[markerCategories[i].service] = markerCategories[i].color;
    } 
    createMarkerCategoryCheckboxes();

    // Load the markers
    var jScript = document.createElement('script');
    jScript.type = 'text/javascript';
    jScript.src = 'https://creator.zoho.com/dcfoodfinder/json/3/callback=loadMarkers/';
    document.getElementsByTagName("head")[0].appendChild(jScript);
 
}

// Create the the items from the data feed
function loadMarkers(root) {
	var page = window.location.href;
	var patt = /index2/;
	var language = page.search(patt);
	
    var entries = root.Resources || [];
    for (var i = 0; i < entries.length; ++i) {
	var entry = entries[i];
	markers.push({name:entry["organization"],
		      address:entry["address"],
		      point:new google.maps.LatLng(entry["latitude"],entry["longitude"]),
		      latitude: entry["latitude"],
		      longitude: entry["longitude"],
		      distance:9999,
		      isLocation:false,
		      hours:notNull(entry["hours"]),
		      phone:notNull(entry["phone"]),
		      website:toURL(entry["website"]),
		      description:entry["description"],
		      primaryType:entry["primaryResourceService"],
		      types:entry["resourceServices"]});
	// If a valid point was not created then this is not a location marker.
	if( markers[i].point.lat() ){
	    markers[i].isLocation = true;
	}
    }
    setDistance(markers);
    setSelectedMarkers();
    reload(0);
}

function createMarkerCategoryCheckboxes() {
    var markerCategorySelect = [];
    var page = window.location.href;
    var patt = /index2/;
    var language = page.search(patt);
    
    for (var i in markerCategories) {
	if( includeType[markerCategories[i].service]  ){
	    checked = "checked";
	} else {
	    checked = "";
	}
	
	var newDescription = "";
	var serviceName = "";
	
	if(language == -1) {
	    serviceName = markerCategories[i].service;
	    newDescription = markerCategories[i].description;
	} else {
	    serviceName = markerCategories[i].service_spanish;
	    newDescription = markerCategories[i].description_spanish;
	}
	
	var html = "<tr><td width='25' valign='middle'><img src='markers/" + markerCategories[i].color + ".png' align='center' vspace='2'></td><td valign='middle' width='180' class='selectMarkerCategories'><a class='info' href='#'>" + serviceName + "<span>" +  newDescription + "</span></a></td><td valign='middle'><input type='checkbox' name='" + markerCategories[i].service + "' onclick='changeSelectedTypes(); return true' " +  checked + "/></td></tr>";
	markerCategorySelect.push(html);
    }
 
    document.getElementById("markerCategorySelect").innerHTML = "<table width='210' cellpadding='0' cellspacing='0' border='0'>" + markerCategorySelect.join("\n") + "</table>";
}

// Select the markers associated the the checked categories
function setSelectedMarkers() {
    selectedMarkers = [];
    for (var i = 0; i < markers.length; i++) {
	var found = false;
	for (var j = 0; j < markers[i].types.length && found == false; j++) {
	    if( includeType[markers[i].types[j]] == true ){
		selectedMarkers.push(markers[i]);
		found = true;
	    }
	}   
    }
}


// (re)write the map and list
// runs on load, when address changed, or when selection changes
// A limited number of markers is shown at a time
// firstMarkerIndex specifies at which marker we should start 

function reload(firstMarkerIndex) {
    startIndex = firstMarkerIndex || 0;

    var map = new google.maps.Map (
	document.getElementById('map'), {
	    center: origin,
	    zoom: zoom,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	});

    // place home marker
    var marker = new google.maps.Marker({
	position: origin,
	map: map,
	icon: home_icon
    });
    
    // initialize pop-up info on the maps when you click the markers
    var google_infowindow = new google.maps.InfoWindow ({
	content: "loading..."
    });

    mylist_html = []; 
    marker_count = selectedMarkers.length;
    endIndex = startIndex;
    
    for(var i=0; i + startIndex < selectedMarkers.length && i < 26; ++i){
	marker = selectedMarkers[i+startIndex];

	if( selectedMarkers[i+startIndex].isLocation ){
	    icon = createIcon(i, markerColors[marker.primaryType], marker.isLocation);	    
	    html = markerHTMLinfo(marker)

	    google_markers[i] = new google.maps.Marker({
		position:marker.point,
		map: map,
		icon: icon,
		html: '<div class="infobox">' + html + '</div>'
	    });
	    
	    // infowindow when marker is clicked
	    google.maps.event.addListener(google_markers[i], 'click', function(){
		google_infowindow.setContent(this.html);
		google_infowindow.open(map,this);
	    });
	    
	    // Adds the marker to the list
	    mylist_html.push(createListItem(i, icon, html));
	}
	endIndex = i+startIndex;

	// create this list
	document.getElementById("mylist").innerHTML = mylist_html.join("\n");
	if( marker_count > 0 ){
	    document.getElementById("current").innerHTML = (startIndex+1) + " to " + (endIndex+1);
	    document.getElementById("count").innerHTML = marker_count;
  	    document.getElementById("printLink").style.visibility = "visible";
	} else {
	    document.getElementById("current").innerHTML = "";
	    document.getElementById("printLink").style.visibility = "hidden";
	}
	
	if( startIndex == 0 ){
	    document.getElementById("back").style.visibility = "hidden";
	} else {
	    document.getElementById("back").style.visibility = "visible";
	}
	
	if( startIndex + 26 >= selectedMarkers.length ){
	    document.getElementById("forward").style.visibility = "hidden";
	} else {
	    document.getElementById("forward").style.visibility = "visible";
	}
      } 
}

function changeSelectedTypes() {
  for (var i in markerCategories ) {
      type = markerCategories[i].service;
      includeType[type] = document.typeform[type].checked;
  }    
  setSelectedMarkers();
  reload(0);
}


// Adjust the origin to entered address
// this function will first try to use the locations defined above (lookup)
// and otherwise geocode it.
function adjust(address) {
  if( !lookup[address.toUpperCase()] ){
      geocoder.geocode({'address': address, 'location': origin}, resetOrigin);
  } else {
    resetOrigin(lookup[address.toUpperCase()]);
  }   
}

// set origin to new point
function resetOrigin(geocoder_result, status){ 
    if( status == google.maps.GeocoderStatus.OK ){
      origin=geocoder_result[0].geometry.location;
      zoom = 13;
      setDistance(markers);
      sortMarkers(selectedMarkers);
      reload(0);
    } else {
	alert("Sorry, address not found.");
    }
}

// changes page back or foward by 26;
function setPage(forwardBack) {
    startIndex = startIndex + (forwardBack * 26);
    if( startIndex < 0 || startIndex > selectedMarkers.length ){ 
	startIndex = 0; 
    }
    reload(startIndex);
}

// calculates the distance for the markerset to the map origin and sorts the list;
function setDistance(markerset) {
  for (var i = 0; i < markerset.length; ++i) {
	markerset[i].distance = distanceFromOrigin(markerset[i].point);
  }
  sortMarkers(markerset);
}

// sorts a markerset using distance;
function sortMarkers(markerset) {
    markerset.sort(function(a,b){return a.distance - b.distance});
}

// calculates the distance from a point to the map origin;
function distanceFromOrigin(point){
    if( point.lat() ) {
	return Math.round(100 * google.maps.geometry.spherical.computeDistanceBetween(point, origin) / 1609.344)/100;
    } else { 
	return 9999;
    }
}

function notNull(item) {
    if( item == null ){ item=""; }
    return item;
}

// in case the links were entered www.x.com and not http://www.x.com
function toURL(link){	
    if (link.match("http:")) {
	return link;	
    } else if( link != "" ) {
	return "http://" + link;
    } else {
	return "";
    }
}

function markerHTMLinfo(marker) {
    if( marker.website == "" ){
	name = marker.name;
    } else {
        name = "<a href='" + marker.website + "' target='_blank'>"  + marker.name + "</a>";
    }   
    listing = "<div class='marker'>\n"
	+ "<div class='marker_title'>" + name + "</div>\n" ;
    if( marker.distance < 9999 ) {
	listing = listing + "(" + marker.distance + " miles)\n"; 
    }
    listing = listing
	+ "<div class='marker_address'>" + marker.address + "</div>\n"
	    + "<div class='marker_phone'>" + marker.phone + "</div>\n"
	    + "<div class='marker_hours'>" + marker.hours + "</div>\n"
	    + "<div class='marker_desc'>" + marker.description + "</div>\n"
	    + "<div class='marker_website'>" + marker.website + "</div>\n"
	    + "</div>\n\n";
     return listing;
}



// This is the new window print page
function openlist(){
    outputWindow=window.open();
  // make a valid html page
  outputWindow.document.open("text/html", "replace");
  outputWindow.document.write("<HTML><HEAD><TITLE>Healthy Affordable Food For All: DC Food Finder</TITLE>\n");
  outputWindow.document.write("<link rel='stylesheet' type='text/css' href='style.css' />\n"); 
  outputWindow.document.write("<link rel='stylesheet' type='text/css' href='list.css' />\n"); 
  outputWindow.document.write("</HEAD><BODY>\n");
  outputWindow.document.write("<div class='markers'>\n");
  for(var i=0; i < selectedMarkers.length; i++){
     outputWindow.document.write(markerHTMLinfo(selectedMarkers[i]));
  } 
  outputWindow.document.write("</div>\n");
  outputWindow.document.write("</BODY></HTML>\n");
  outputWindow.document.close();  
}

// open bubble on google maps from the list.
function openMapInfo(number){
    if( google_markers[number] ){
	google.maps.event.trigger(google_markers[number], 'click');
    }
}

function createIcon(number, color, isLocation){
    var icon = "";
    if( isLocation ){
	icon = "markers/" + color + "_Marker" + letters[number] + ".png"; 
    } else {
	icon = "markers/circle-green-static.png";
    }
    return icon;
}

// when the side markers are clicked the infowindow on the map appears.
function createListItem(number, icon, html) {
    return "<div style='float:left;' id='marker_" + number + "'>" + "<img src='" + icon + "' onclick='openMapInfo(" + number + ");'>" + "</div><div style='margin-left: 25px; margin-bottom: 10px;'>" + html + "</div>";
}


google.maps.event.addDomListener(window, 'load', reload);
