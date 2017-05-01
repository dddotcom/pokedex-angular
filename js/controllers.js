angular.module("PokedexControllers", ['PokedexServices'])
.controller('HomeCtrl', ['$scope', '$http', 'Favorite', '$location', 'SharedProperties', function($scope, $http, Favorite, $location, SharedProperties) {
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
    //if empty show a message
    if($scope.searchTerm === ''){
      $scope.error.detail = "Please enter a search term";
      return;
    }

    $scope.loadingMsg = 'Loading...';

    //check if we have already cached the data
    if($scope.favorites[$scope.searchTerm]){
      $scope.loadingMsg = '';
      $scope.pokemon = $scope.favorites[$scope.searchTerm]["pokemon"];
      $scope.pokemonSpecies = $scope.favorites[$scope.searchTerm]["pokemonSpecies"];
      return;
    }

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
        $scope.loadingMsg = '';
        $scope.error = res2.data;
        console.log('error', res2);
      });
    }, function error(res){
      $scope.loadingMsg = '';
      $scope.error = res.data;
      console.log("error", res);
    });
  };

  $scope.addFavorite = function(id, pokemon, pokemonSpecies){
    Favorite.add(id, pokemon, pokemonSpecies);
    $scope.favorites = Favorite.get();
    $scope.keys = Object.keys($scope.favorites);
    $location.path('/favorites');
  };

  $scope.deleteFavorite = function(id){
    Favorite.delete(id);
    $scope.favorites = Favorite.get();
    $scope.keys = Object.keys($scope.favorites);
  };

  $scope.go = function(path){
    $location.path(path);
  };

  $scope.showFavorite = function(index){
    $scope.favorites = Favorite.get();
    $scope.keys = Object.keys($scope.favorites);
    if($scope.keys[index]){
      SharedProperties.setErrorMessage('');
      $location.path('/favorites/' + $scope.favorites[$scope.keys[index]]["pokemon"].id)
    } else {
      SharedProperties.setErrorMessage('Invalid favorite shortcut.');
      $location.path('/favorites/-1')
    }
  };

}])
.controller('FavoriteCtrl', ['$scope', 'Favorite', '$stateParams', 'SharedProperties', function($scope, Favorite, $stateParams, SharedProperties){
  $scope.errorMessage = SharedProperties.getErrorMessage();
  $scope.pokemon = {};
  $scope.pokemonSpecies = {};
  var pokemonid = $stateParams.id;
  var favorites = Favorite.get();
  if(!$scope.errorMessage){
    $scope.pokemon = favorites[pokemonid]["pokemon"];
    $scope.pokemonSpecies = favorites[pokemonid]["pokemonSpecies"];
  }
}]);
