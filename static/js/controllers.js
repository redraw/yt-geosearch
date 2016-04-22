angular.module('app.controllers', [])

  .controller('SearchCtrl', function($scope, $http, NgMap) {
    $scope.debug = false;
    $scope.params = {};
    $scope.params.radius = 10;
    $scope.params.limit = 10;
    $scope.videos = [];
    $scope.markers = [];

    $scope.bounds = new google.maps.LatLngBounds();

    NgMap.getMap().then(function(map) {
      $scope.map = map;
    });

    $scope.placeChanged = function() {
      $scope.reset();
      $scope.place = this.getPlace();
      $scope.search();
    }

    $scope.search = function(action) {
      var config = {
        params: $scope.params
      }

      config.params.lat = $scope.map.center.lat()
      config.params.lng = $scope.map.center.lng()

      $http.get('/search', config).then(function(response) {
        $scope.raw_results = response.data;
        $scope.params.next = response.data.next;

        // center map
        $scope.map.setCenter($scope.place.geometry.location);

        // add videos
        $scope.addVideos(response.data.videos);
      })
    }

    $scope.addVideos = function(videos){
      videos.forEach(function(video) {
        var location = video.recordingDetails.location;
        var latlng = new google.maps.LatLng(location.latitude, location.longitude);

        $scope.videos.push(video);

        $scope.markers.push({
          'id': video.id,
          'title': video.snippet.title,
          'position': [location.latitude, location.longitude]
        });

        $scope.bounds.extend(latlng);
      })

      // fit bounds
      $scope.map.fitBounds($scope.bounds);
    }

    $scope.bounceMarker = function(id) {
      $scope.map.markers[id].setAnimation(google.maps.Animation.BOUNCE);
    }

    $scope.unbounceMarker = function(id) {
      $scope.map.markers[id].setAnimation(null);
    }

    $scope.reset = function() {
      $scope.videos = [];
      $scope.markers = [];
      $scope.params.next = undefined;
      $scope.bounds = new google.maps.LatLngBounds();
    }
  })