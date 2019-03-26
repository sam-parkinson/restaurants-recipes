'use strict';

// TODO, if possible: error code that returns different possibilities for three possible error states
// no recipe, but restaurant
// recipe, no restaurant
// neither of them

function getRecipe(food) {
  console.log('getting recipes...');
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`)
    .then(response => response.json())
    .then(responseJson => addRecipes(responseJson));
// maybe some kind of catching thing to prevent errors w/ recipe API?
// see TODO notes for logic on this
}

function getLocation(food) {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(`Latitude: ${lat}, longitude: ${lon}`);
    findNearbyRestaurants(lat, lon, food);
  });
}

function addRecipes(recipeJson) {
  $('#recipes ul').empty();
  const recData = recipeJson.meals;
  for (let i = 0; i < recData.length; i++) {
    $('#recipes ul').append(
      `<li id="${recData[i].strMeal}">${recData[i].strMeal}
        <p>${recData[i].strInstructions}</p>
        <ol id="recipes-${i}">Ingredients:</ol>
      </li>`
    );
  }
  // separate this into its own function before final rollout if unable to integrate into one loop
  for (let i = 0; i < recData.length; i++) {
    let j = 1;
    while (recData[i][`strIngredient${j}`] != '') {
      $(`#recipes-${i}`).append(
        `<li>${recData[i][`strIngredient${j}`]}: ${recData[i][`strMeasure${j}`]}</li>`
      );
      j++;
    }
  }
  // should be minimum necessary, maybe add image/url?
}

function findNearbyRestaurants(lat, lon, food) {

  console.log(`Searching for restaurants near lat ${lat} and lon ${lon}...`)
  const url = `https://developers.zomato.com/api/v2.1/search?lat=${lon}&lon=${lon}5&radius=1000`
  const options = {
    headers: new Headers({
      'user-key': `replace-with-actual-key`})
  }
  fetch(url, options)
    .then(response => response.json())
    .then(responseJson => checkMenus(responseJson, food));
}

function checkMenus(responseJson, food) {
  console.log(`Currently, functionality to check nearby restaurants' menus for ${food} is not fully implemented.`);
  console.log(responseJson.restaurants);
  const restIDs = [];
  for (let i = 0; i < responseJson.restaurants.length; i++) {
    restIDs.push(responseJson.restaurants[i].restaurant.id);
  }
  console.log(restIDs);
  // call function to go through res-id numbers, check menus for string matching typed item
}

function submitClicked() {
  $('form').submit(event => {
    event.preventDefault();
    console.log('submit clicked');
    const food = $(this).find('#searchbar').val();
    getRecipe(food);
    getLocation(food);
  })
}

$(submitClicked);