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
    console.log("searchAgain called");
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
    $scope.searchTerm = $scope.searchTerm.toLowerCase();

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
    $scope.searchAgain();
    $location.path(path);
  };

  $scope.showFavorite = function(index){
    $scope.favorites = Favorite.get();
    $scope.keys = Object.keys($scope.favorites);
    if($scope.keys[index]){
      $location.path('/favorites/' + $scope.favorites[$scope.keys[index]]["pokemon"].id)
    } else {
      $location.path('/favorites/-1')
    }
  };

}])
.controller('FavoriteCtrl', ['$scope', 'Favorite', '$stateParams', '$location', function($scope, Favorite, $stateParams, $location){
  $scope.pokemon = {};
  $scope.pokemonSpecies = {};
  $scope.favorites = Favorite.get();
  $scope.keys = Object.keys($scope.favorites);
  var pokemonid = $stateParams.id;
  console.log("pokemonid is " + pokemonid);
  if(pokemonid < 0){
    $scope.errorMessage = "Invalid favorite shortcut.";
  }

  if(!$scope.errorMessage){
    var favorites = Favorite.get();
    $scope.pokemon = favorites[pokemonid]["pokemon"];
    $scope.pokemonSpecies = favorites[pokemonid]["pokemonSpecies"];
  }

  $scope.showFavorite = function(index){
    if($scope.keys[index]){
      $location.path('/favorites/' + $scope.favorites[$scope.keys[index]]["pokemon"].id)
    } else {
      $location.path('/favorites/-1')
    }
  };

  $scope.go = function(path){
    $location.path(path);
  };
}]);
