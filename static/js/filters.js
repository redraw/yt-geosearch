angular.module('app.filters', [])

  .filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow();
    }
  })

  .filter('ytVideoLink', function() {
    return function(id) {
      return "https://www.youtube.com/watch?v=" + id
    }
  })

  .filter('ytChannelLink', function() {
    return function(id) {
      return "https://www.youtube.com/channel/" + id
    }
  })