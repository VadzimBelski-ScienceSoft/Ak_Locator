(function (window, $$) {
    "use strict";

    var Locator = window.Locator = {};

    Locator.Form = Class.create({

        initialize: function (el, search) {

            this.settings = {
                selectors : {
                    loader : '.loc-loader'
                }
            };

            this.el = el;
            this.search = search;
            var self = this;

            Event.observe(el, 'submit', function (event) {
                if ("" !== el.serialize().toQueryParams().s) {
                    self.startLoader();
                    self.search.findLocations(el.serialize(), function () {
                        self.stopLoader();
                    });
                }
                Event.stop(event);
            });
        },

        startLoader: function () {
            this.el.select(this.settings.selectors.loader).each(function (el) {
                el.addClassName('is-loading');
            });
        },

        stopLoader: function () {
            this.el.select(this.settings.selectors.loader).each(function (el) {
                el.removeClassName('is-loading');
            });
        }
    });

    Locator.Map = Class.create({
        initialize: function (el) {
            this.el = el;
            this.defaults = {
                zoom: 15,
                scrollwheel : false,
                mapTypeId : google.maps.MapTypeId.ROADMAP,
                mapTypeControl : false,
                mapTypeControlOptions : {
                    style : google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position : google.maps.ControlPosition.BOTTOM_CENTER,
                    mapTypeIds : [google.maps.MapTypeId.ROADMAP, 'locator']
                },
                streetViewControl : false,
                streetViewControlOptions : {
                    position : google.maps.ControlPosition.LEFT_TOP
                }
            };
            this.map = new google.maps.Map(el, this.defaults);
            this.markers = [];
            this.infowindows = [];

            this.markerTypes = {

                'default': new google.maps.MarkerImage(
                    '/skin/frontend/base/default/locator/images/pin.png',
                    new google.maps.Size(40, 50),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(20, 50)
                )
            };

            this.stoppers = [];

            this.settings = {
                maxZoom : 15
            };
        },

        renderLocations: function (locations) {

            var latlngbounds = new google.maps.LatLngBounds(),
                show = 0,
                self = this;

            this.clearOverlays();

//            if (this.settings.theme) {
//                var styledMap = new google.maps.StyledMapType(this.settings.theme, { name: "Locator" });
//                self.map.mapTypes.set('locator', styledMap);
//                self.map.setMapTypeId('locator');
//            }

            for (var key in locations) {
                if (locations.hasOwnProperty(key)) {

                    var l = locations[key];
                    var loc = new google.maps.LatLng(l.latitude, l.longitude);

                    self.infowindows[l.id] = new google.maps.InfoWindow({
                        content: self.renderMarker(l)
                    });
                    self.markers[l.id] = new google.maps.Marker({
                        position: loc,
                        map: self.map,
                        title: l.title,
                        icon: self.markerTypes.default,
                        // shadow: shadow,
                        // shape: shape,
                        animation: google.maps.Animation.DROP
                    });


                    self.markers[l.id].id = l.id;

                    google.maps.event.addListener(self.markers[l.id], 'click', function() {
                        self.hideInfoWindows();
                        self.infowindows[this.id].open( self.map, self.markers[this.id]);
                    });

                    latlngbounds.extend( loc );
                    show = 1
                }
            }

            self.map.fitBounds( latlngbounds );

            if(self.settings.maxZoom){
                //when the map loads, make sure it hasn't zoomed in to far, if it has zoom out
                //@todo, configure the zoom level in admin
                var listener = google.maps.event.addListener(self.map, "idle", function() {
                    if (self.map.getZoom() > self.settings.maxZoom) self.map.setZoom(self.settings.maxZoom);
                    google.maps.event.removeListener(listener);
                });
            }


            google.maps.event.trigger(self.map, 'resize');
        },

        clearOverlays: function(){
            for (var key in this.markers) {
                if (this.markers.hasOwnProperty(key)) {
                    this.markers[key].setMap(null);
                }
            }
        },

        hideInfoWindows: function(){
            for (var key in this.infowindows) {
                if (this.infowindows.hasOwnProperty(key)) {
                    this.infowindows[key].close();
                }
            }
        },

        showInfoWindow: function(id){
            this.hideInfoWindows();
            this.infowindows[id].open(this.map,this.markers[id]);
        },

        renderMarker: function(l){
            return '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h2 id="firstHeading" class="firstHeading">'+l.title+'</h2>'+
                '<div id="bodyContent">'+
                '<p>Approx '+l.distance+'km from you</p>'+
                '</div>'+
                '<p><a href="'+l.directions+'" target="_blank">Get Directions</a></p>'+
                '</div>';
        },

        highlightMarker: function(id){
            var self = this;
            console.log('here');
            if(self.markers[id].getAnimation() === null){
                console.log('setting animation');
                self.markers[id].setAnimation(google.maps.Animation.BOUNCE);
                self.stoppers[id] = setTimeout(function(){
                    self.markers[id].setAnimation(null);
                }, 720);
            }
        }
    });

    Locator.List = Class.create({

        initialize: function (el) {
            this.el = el;
        },

        update: function (text) {
            this.el.update(text);
        }
    });

    Locator.Search = Class.create({

        initialize: function(el) {
            this.settings = {
                selectors : {
                    map : '.loc-map',
                    list : '.loc-list',
                    teaser : '.loc-teaser',
                    form : '.loc-srch-form',
                    loader : '.loc-loader',
                    trigger : '.loc-trigger',
                    results : '.loc-results'
                }
            };

            this.el = el;
            this.map = new Locator.Map($$(this.settings.selectors.map).first());
            this.list = new Locator.List($$(this.settings.selectors.list).first());
            this.forms = [];

            var self = this;

            $$(this.settings.selectors.form).each(function (el) {
                self.forms.push(new Locator.Form(el, self));
            });


            $$(this.settings.selectors.trigger).invoke('observe', 'click', function(event){
                var href = Event.element(event).readAttribute('href');

                self.forms[0].startLoader();
                self.findLocations( href.toQueryParams(), function () {
                    self.forms[0].stopLoader();
                });
                Event.stop(event);
            });


            //Bind map rendering to StateChange Event
            window.History.Adapter.bind(window, 'statechange', function () {

                var State = History.getState();

                if (State.data.locations.length) {
                    self.list.update(State.data.output);
                    self.map.renderLocations(State.data.locations);
                    self.initEvents();
                }
            });
        },

        initState: function(locations){
            //inject a random parameter to query string so state always changes on first load
            var href = window.location.href+'&rand='+Math.random();
            var locations = this.parseLocationsJson(locations);

            History.replaceState(
                {
                    locations: locations,
                    output: this.list.el.innerHTML,
                    search: href.toQueryParams()
                 },
                this.getSearchTitle(locations),
                window.location.search
            );
        },

        findLocations: function (query, callback) {

            var self = this;
            var href;

            if(typeof (query) === 'object') {
                query = $H(query).toQueryString();
            }

            href = window.location.pathname + '?' + query;

            new Ajax.Request(window.location.pathname + '?' + query, {

                method : 'get',
                onFailure: function () {
                    alert('search failed');
                },
                onSuccess: function (t) {
                    var result = self.parseSearchJson(t.responseText);
                    result.search = href.toQueryParams();

                    self.toggleNoResults(0);
                    if(result.error === true) {
                        if (result.error_type === 'noresults') {
                            self.toggleNoResults(1)
                        } else {
                            alert(result.message);
                        }
                    } else if (result.locations.length) {
                        History.pushState(result, self.getSearchTitle(result.locations), '?' + query);
                    }else{
                        alert('an error occured');
                    }

                    if (typeof callback === "function") {
                        callback.call();
                    }
                }
            });
        },

        parseSearchJson: function (string) {
            var search = JSON.parse(string);
            if (search.locations) {
                search.locations = this.parseLocationsJson(search.locations);
            }
            return search;
        },

        parseLocationsJson: function (string) {

            var locations = JSON.parse(string);
            var temp = Array();

            for (var key in locations) {
                if (locations.hasOwnProperty(key) && locations[key] != 'undefined') {
                    temp.push(locations[key]);
                }
            }
            return temp;
        },

        toggleNoResults: function (show) {
            var els = $$('.loc-results');
            if(show){
                els.each(function(el){
                    el.addClassName('is-no-results');
                });
            }else{
                els.each(function(el){
                    el.removeClassName('is-no-results');
                });
            }
        },

        initEvents: function(){
            var self = this;
            $$(this.settings.selectors.teaser).invoke('observe', 'click', function(event){
                var id = this.readAttribute('data-id');
                self.map.showInfoWindow(id);
            });

            $$(this.settings.selectors.teaser).invoke('observe', 'mouseover', function(event) {
                var id = this.readAttribute('data-id');
                self.map.highlightMarker(id);
            });
        },

        getSearchTitle:function (locations){
            return "Search: " + locations.length + " Locations";
        }
    });

})(window, $$);

