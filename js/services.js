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
      temp = $window.localStorage["favoritePokemon"] ? JSON.parse($window.localStorage["favoritePokemon"]) : {}
      if( !(id in temp) ){
        temp[id] = {};
        temp[id]["pokemon"] = pokemon;
        temp[id]["pokemonSpecies"] = pokemonSpecies;
        $window.localStorage["favoritePokemon"] = JSON.stringify(temp);
      }
      return this.get();
    },
    get: function(){
      if($window.localStorage["favoritePokemon"]){
        return JSON.parse($window.localStorage["favoritePokemon"]);
      } else {
        return {};
      }
    },
    delete: function(id){
      if($window.localStorage["favoritePokemon"]){
          var temp = JSON.parse($window.localStorage["favoritePokemon"]);
          delete temp[id];
          $window.localStorage["favoritePokemon"] = JSON.stringify(temp);
      }
      return this.get();
    }
  };
}]);
