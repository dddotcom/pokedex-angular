angular.module('PokedexServices', [])
// use $localStorage
.factory('Favorite', ["$window", function($window){
  return {
    add: function(id, pokemon, pokemonSpecies){
      temp = $window.localStorage["favorites"] ? JSON.parse($window.localStorage["favorites"]) : {}
      if( !(id in temp) ){
        temp[id] = {};
        temp[id]["pokemon"] = pokemon;
        temp[id]["pokemonSpecies"] = pokemonSpecies;
        $window.localStorage["favorites"] = JSON.stringify(temp);
      }
      return this.get();
    },
    get: function(){
      if($window.localStorage["favorites"]){
        return JSON.parse($window.localStorage["favorites"]);
      } else {
        return {};
      }
    },
    delete: function(id){
      if($window.localStorage["favorites"]){
          var temp = JSON.parse($window.localStorage["favorites"]);
          delete temp[id];
          $window.localStorage["favorites"] = JSON.stringify(temp);
      }
      return this.get();
    }
  };
}])
.factory('SharedProperties', function(){
  var errorMessage = '';
  return {
    setErrorMessage: function(msg){
      errorMessage = msg;
    },
    getErrorMessage: function(){
      return errorMessage;
    }
  };
});
