var app = angular.module('PokedexAngularApp', ['ui.router', 'PokedexControllers'])

.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider){
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('home', {
    url:'/',
    templateUrl: './views/home.html',
    controller: 'HomeCtrl'
  })
  .state('favorites', {
    url:'/favorites',
    templateUrl: './views/favorites.html',
    controller: 'HomeCtrl'
  })
  .state('404', {
    url:'/404',
    templateUrl: './views/404.html'
  })
  .state('showFavorite', {
    url:'/favorites/:id',
    templateUrl: './views/show.html',
    controller: 'FavoriteCtrl'
  });
}]);
