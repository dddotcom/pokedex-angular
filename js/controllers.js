angular.module("PokedexControllers", ['PokedexServices'])
.controller('HomeCtrl', ['$scope', '$http', 'Favorite', '$location', 'SearchHistory', function($scope, $http, Favorite, $location, SearchHistory) {
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
    $scope.searchTerm = $scope.searchTerm.toLowerCase();

    //check if we have already cached the data
    //serach by id
    if(SearchHistory.get()["searchedPokemon"][$scope.searchTerm]){
      console.log("we've already searched this by id");
      $scope.loadingMsg = '';
      $scope.pokemon = SearchHistory.get()["searchedPokemon"][$scope.searchTerm]["pokemon"];
      $scope.pokemonSpecies = SearchHistory.get()["searchedPokemon"][$scope.searchTerm]["pokemonSpecies"];
      return;
    } else if (SearchHistory.get()["nameToId"][$scope.searchTerm]){ //searched by name
      console.log("we've already searched this by name");
      var id = SearchHistory.get()["nameToId"][$scope.searchTerm]
      $scope.loadingMsg = '';
      $scope.pokemon = SearchHistory.get()["searchedPokemon"][id]["pokemon"];
      $scope.pokemonSpecies = SearchHistory.get()["searchedPokemon"][id]["pokemonSpecies"];
      return;
    } else if ($scope.favorites[$scope.searchTerm]){ //we've favorited it in a previous session
      console.log("we've favorited it in a previous session");
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
      $scope.error = {};
      $scope.pokemon = res.data;
      $http(req2).then(function success(res2){
        $scope.pokemonSpecies = res2.data;
        $scope.loadingMsg = '';
        SearchHistory.add($scope.pokemon, $scope.pokemonSpecies);
      }, function error(res2){
        $scope.loadingMsg = '';
        $scope.error = res2.data;
      });
    }, function error(res){
      $scope.loadingMsg = '';
      $scope.error = res.data;
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
