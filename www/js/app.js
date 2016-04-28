(function(){
var app = angular.module('androidnews', ['ionic', 'angularMoment']);

app.controller('AndroidNewsCtrl', function($http, $scope){
  
  $scope.stories = [];

  function loadStories(params, callback){
    $http.get('https://www.reddit.com/r/android/new/.json', {params:params})
      .success(function(response){
        var stories = [];
        angular.forEach(response.data.children, function(child){
          var story = child.data;
          if(!story.thumbnail || story.thumbnail === 'self' || story.thumbnail === 'default'){
              story.thumbnail = 'https://camo.githubusercontent.com/b13830f5a9baecd3d83ef5cae4d5107d25cdbfbe/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f3732313033382f313732383830352f35336532613364382d363262352d313165332d383964312d3934376632373062646430332e706e67';
          }
          stories.push(child.data);
        });
      callback(stories);
    });
  }

  $scope.loadOlderStories = function(){
    var params = {};
    if($scope.stories.length > 0){
      params['after'] = $scope.stories[$scope.stories.length - 1].name;
    }

    loadStories(params, function(olderStories){
      $scope.stories = $scope.stories.concat(olderStories);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.loadNewStories = function(){
    var params = {'before': $scope.stories[0].name};
    loadStories(params, function(newStories){
      $scope.stories = newStories.concat($scope.stories);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.openLink = function(url){
    window.open(url, '_blank');
  };
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.cordova && window.cordova.InAppBrowser){
      window.open = cordova.InAppBrowser.open;
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
}());