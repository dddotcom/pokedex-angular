angular.module("PokedexControllers", ['PokedexServices'])
.controller('HomeCtrl', ['$scope', '$http', 'Favorite', '$location', function($scope, $http, Favorite, $location) {
  $scope.favorites = Favorite.get();
  $scope.keys = Object.keys($scope.favorites);
  $scope.pokemon = {};
  $scope.error = {};
  $scope.pokemonSpecies = {};
  $scope.searchTerm = '';
  $scope.loadingMsg = '';

  $scope.searchAgain = function(){
    $scope.pokemon = {};
    $scope.pokemonSpecies = {};
    $scope.error = {};
    $scope.searchTerm = '';
    $scope.loadingMsg = '';
  }

  $scope.search = function() {

    $scope.loadingMsg = 'Loading...';

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
        $scope.loadingMsg = '';
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
    Favorite.add(id, pokemon, pokemonSpecies);
    $scope.favorites = Favorite.get();
    $scope.keys = Object.keys($scope.favorites);
    console.log($scope.keys);
    $location.path('/favorites');
  };

  $scope.deleteFavorite = function(id){
    Favorite.delete(id);
    $scope.favorites = Favorite.get();
    $scope.keys = Object.keys($scope.favorites);
    console.log($scope.keys);
  };

  $scope.go = function(path){
    $location.path(path);
  };

  $scope.showFavorite = function(index){
    $scope.favorites = Favorite.get();
    $scope.keys = Object.keys($scope.favorites);
    if($scope.keys[index]){
      $location.path('/favorites/' + $scope.favorites[$scope.keys[index]]["pokemon"].id)
    } else {
      console.log("nooooo");
    }
  };

}])
.controller('FavoriteCtrl', ['$scope', 'Favorite', '$stateParams', function($scope, Favorite, $stateParams){
  var pokemonid = $stateParams.id;
  var favorites = Favorite.get();
  $scope.pokemon = favorites[pokemonid]["pokemon"];
  $scope.pokemonSpecies = favorites[pokemonid]["pokemonSpecies"];
}]);
