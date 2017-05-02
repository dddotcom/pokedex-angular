angular.module('PokedexServices', [])
// use $localStorage
.factory('SearchHistory', [ 'Favorite', function(Favorite){
  var searchedPokemon = {};
  var nameToId ={};

  if(Object.keys(searchedPokemon).length === 0){
    sync();
  }

  function sync(){
    //sync from favorites
    console.log("initial load: populating searched pokemon with stuff from favorites")
    searchedPokemon = Favorite.get();
    for(var id in searchedPokemon){
      var name = searchedPokemon[id]["pokemon"].name;
      nameToId[name] = id;
    }
  }

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
}])
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
