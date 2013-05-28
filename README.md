HarvardShuttle: Pure HTML5 + JS
===============================================

HarvardShuttle is a responsive web application designed for desktop, tablet, and mobile devices.  The latest version can be accessed at HarvardShuttle.org.

Usage
=====

Once you visit HarvardShuttle.org, you will be prompted to share your location information.  If you provide your location data, HarvardShuttle will automatically determine the closest shuttle stop near you.  Once a shuttle stop is determined, HarvardShuttle will automatically provide the next shuttle arrival times and route information.  You can change or refine arrival time infomation by either changing the origin stop or adding an optional destination stop.  If both an origin and destination stop is selected, alternative walking route and time information is provided.  The web application refreshes shuttle information every 20 seconds.

Web Technologies
================

HarvardShuttle.org is purely based on HTML5 + JS.  All scripts and rendering are completed on client-side for speed and efficiency.  JQuery was used frequently for writing JS.  Most custom JS resides in harvardshuttle.js file.

Frameworks
==========

Like almost every modern website on the internet, HarvardShuttle.org uses the Bootstrap by Twitter framework.  A modified version of bootstrap-select was used to stylize HTML select elements like dropdown menus.  Overall, very little customization was done on the framework.

APIs
====

HarvardShuttle employs the Transloc Open API and Bing Maps API.  Transloc provides the latest GPS data and shuttle information.  Bing Maps was used to visualize geolocation as well as provide walking time estimates.

Design Flow
===========

1. Cache Stop and Route Information
2. Request Arrival Estimates When Shuttle Stops Selected
3. Provide Walking Estimates, if necessary

FAQ
===

What makes HarvardShuttle different from Shuttleboy?

HarvardShuttle uses real-time GPS data to calculate and provide arrival time information.  Real-time information is more accurate and relevant than a scheduled time-table.  HarvardShuttle's interface is also designed to be navigated faster and more intuitively.

What's next for HarvardShuttle?

Right now, you can access HarvardShuttle as a web application at HarvardShuttle.org.  However, it is far more convenient to access a native application when using a mobile device.  HarvardShuttle Windows 8, Windows Phone, Android, and iOS applications will be coming soon.  ETA January 2013, in time for the start of spring seme
