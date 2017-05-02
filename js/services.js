angular.module('PokedexServices', [])
// use $localStorage
.factory('SearchHistory', function(){
  var searchedPokemon = {};
  var nameToId ={};
  return {
    add: function(pokemon, pokemonSpecies){
      searchedPokemon[pokemon.id] = {};
      searchedPokemon[pokemon.id]["pokemon"] = pokemon;
      searchedPokemon[pokemon.id]["pokemonSpecies"] = pokemonSpecies;
      nameToId[pokemon.name] = pokemon.id;
    },
    get: function(){
      return {searchedPokemon: searchedPokemon, nameToId: nameToId};
    }
  }
})
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
}]);
