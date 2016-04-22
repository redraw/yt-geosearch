angular.module('app.controllers', [])

  .controller('SearchCtrl', function($http, NgMap) {
    var vm = this;
    
    vm.debug = false;

    vm.params = {};
    vm.params.radius = 10;
    vm.params.limit = 10;

    vm.reset = function() {
      vm.videos = [];
      vm.markers = [];
      vm.params.next = undefined;
      vm.bounds = new google.maps.LatLngBounds();
    }

    NgMap.getMap().then(function(map) {
      vm.reset();
      vm.map = map;
      vm.search();
    }, function(err) { console.log(err)});

    vm.placeChanged = function() {
      vm.reset();
      vm.place = this.getPlace();
      vm.search();
    }

    vm.search = function() {
      var config = {
        params: vm.params
      }

      if (vm.place) {
        config.params.lat = vm.place.geometry.location.lat()
        config.params.lng = vm.place.geometry.location.lng()
      } else {
        config.params.lat = vm.map.center.lat()
        config.params.lng = vm.map.center.lng()
      }

      $http.get('/search', config).then(function(response) {
        vm.raw_results = response.data;
        vm.params.next = response.data.next;

        // center map
        if (vm.place) {
          vm.map.setCenter(vm.place.geometry.location);
        }

        // add videos
        vm.addVideos(response.data.videos);
      })
    }

    vm.addVideos = function(videos){
      videos.forEach(function(video) {
        var location = video.recordingDetails.location;
        var latlng = new google.maps.LatLng(location.latitude, location.longitude);

        vm.videos.push(video);

        vm.markers.push({
          'id': video.id,
          'title': video.snippet.title,
          'position': [location.latitude, location.longitude]
        });

        vm.bounds.extend(latlng);
      })

      // fit bounds
      vm.map.fitBounds(vm.bounds);
    }

    vm.bounceMarker = function(id) {
      vm.map.markers[id].setAnimation(google.maps.Animation.BOUNCE);
    }

    vm.unbounceMarker = function(id) {
      vm.map.markers[id].setAnimation(null);
    }
  })