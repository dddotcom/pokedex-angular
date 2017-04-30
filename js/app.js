var app = angular.module('PokedexAngularApp', []);

app.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.pokemon = {};
  $scope.pokemonSpecies = {};
  $scope.searchTerm
  $scope.search = function() {
    var req = {
      url: 'https://pokeapi.co/api/v2/pokemon/' + $scope.searchTerm,
      method: 'GET'
    };

    var req2 = {
      url: 'https://pokeapi.co/api/v2/pokemon-species/' + $scope.searchTerm,
      method: 'GET'
    };

    $http(req).then(function success(res){
      console.log(res.data);
      $scope.pokemon = res.data;
      $http(req2).then(function success(res2){
        console.log(res2.data);
        $scope.pokemonSpecies = res2.data;
      }, function error(res2){
        console.log('error', res2);
      });
    }, function error(res){
      console.log("error", res);
    });
  };


}]);
