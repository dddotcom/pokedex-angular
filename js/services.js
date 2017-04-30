angular.module('PokedexServices', [])
// use $localStorage
.factory('Favorite', ["$window", function($window){
  return {
    add: function(id, pokemon, pokemonSpecies){
      console.log("Adding " + pokemon.name + " to list of local storage favorites");
      temp = $window.localStorage["favorites"] ? JSON.parse($window.localStorage["favorites"]) : {}
      if( !(id in temp) ){
        temp[id] = {};
        temp[id]["pokemon"] = pokemon;
        temp[id]["pokemonSpecies"] = pokemonSpecies;
        $window.localStorage["favorites"] = JSON.stringify(temp);
        console.log("Added " + pokemon.name + " to list of local storage favorites!");
      }
      return this.get();
    },
    get: function(){
      console.log("Retrieving favorites from local storage");
      if($window.localStorage["favorites"]){
        return JSON.parse($window.localStorage["favorites"]);
      } else {
        return {};
      }
    },
    delete: function(id){
      console.log("Deleting pokemon at index " + index + " from local storage");
      if($window.localStorage["favorites"]){
          var temp = JSON.parse($window.localStorage["favorites"]);
          delete temp[id];
          $window.localStorage["favorites"] = JSON.stringify(temp);
      }
      return this.get();
    }
  };
}])
