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
  const url = `https://developers.zomato.com/api/v2.1/search?lat=${lat}&lon=${lon}&radius=1000`
  const options = {
    headers: new Headers({
      'user-key': `fake-api-key`})
  }
  fetch(url, options)
    .then(response => response.json())
    .then(responseJson => getMenus(responseJson, food, options));
}

function getMenus(responseJson, food, options) {
  console.log(`Currently, functionality to check nearby restaurants' menus for ${food} is not fully implemented.`);
  console.log(responseJson.restaurants);
  const menus = [];
  for (let i = 0; i < responseJson.restaurants.length; i++) {
    const url = `https://developers.zomato.com/api/v2.1/dailymenu?res_id=${responseJson.restaurants[i].restaurant.id}`;
    fetch(url, options)
      .then(response => response.json())
      .then(responseJson => menus.push(responseJson));
  }
  console.log(menus);
  // call function to go through res-id numbers, check menus for string matching typed item
}

function checkMenus(menus) {
  for (let i = 0; i < menus.length; i++) {
    const dishes = [];
    if (menu[i].daily_menus == true) {
      for (let j = 0; j < daily_menus.length; j++) {
        dishes.append(menu[i].daily_menus[j].daily_menu[0].dishes)
      }
    }
    console.log(dishes)
    // go through dishes on the menu
    // check to make sure food item is in food array
    // match similar string somehow
    // if food matches, add to DOM
  }
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