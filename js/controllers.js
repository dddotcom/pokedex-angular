angular.module("PokedexControllers", ['PokedexServices'])
.controller('HomeCtrl', ['$scope', '$http', 'Favorite', '$location', function($scope, $http, Favorite, $location) {
  $scope.favorites = Favorite.get();
  $scope.numFavs = Object.keys($scope.favorites).length;
  $scope.pokemon = {};
  $scope.error = {};
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
      $scope.error = {};
      $scope.pokemon = res.data;
      $http(req2).then(function success(res2){
        console.log(res2.data);
        $scope.pokemonSpecies = res2.data;
      }, function error(res2){
        $scope.error = res2.data;
        console.log('error', res2);
      });
    }, function error(res){
      $scope.error = res.data;
      console.log("error", res);
    });
  };

  $scope.addFavorite = function(id, pokemon, pokemonSpecies){
    $scope.favorites = Favorite.add(id, pokemon, pokemonSpecies);
  };

  $scope.deleteFavorite = function(id){
    $scope.favorites = Favorite.delete(id);
  };

  $scope.go = function(path){
    console.log("go here " + path);
    $location.path(path);
  };

}])
.controller('FavoriteCtrl', ['$scope', 'Favorite', '$stateParams', function($scope, Favorite, $stateParams){
  var pokemonid = $stateParams.id;
  var favorites = Favorite.get();
  $scope.pokemon = favorites[pokemonid]["pokemon"];
  $scope.pokemonSpecies = favorites[pokemonid]["pokemonSpecies"];
}]);
