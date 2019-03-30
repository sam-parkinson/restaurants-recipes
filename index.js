'use strict';

// TODO, if possible: error code that returns different possibilities for three possible error states
// no recipe, but restaurant
// recipe, no restaurant
// neither of them

function divClicked() {

  // resize the divs based on which was clicked and which wasn't
}

function submitClicked() {
  $('form').submit(event => {
    event.preventDefault();
    $('.container').removeClass('focused unfocused').addClass('default');
    const food = $(this).find('#searchbar').val();
    getCategory(food);
    getLocation(food);
    
    // return divs to their default sizes, maybe toggle categories for this?
  })
}

function getCategory(food) {
  console.log('getting recipes...');
  $('#recipes ul').empty();
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${food}`)
    .then(response => response.json())
    .then(responseJson => getRecipes(responseJson));
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${food}`)
    .then(response => response.json())
    .then(responseJson => getRecipes(responseJson));
// maybe some kind of catching thing to prevent errors w/ recipe API?
// see TODO notes for logic on this
}

function getRecipes(responseJson) {
  for (let i = 0; i < responseJson.meals.length; i++){
    fetch (`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${responseJson.meals[i].idMeal}`)
      .then(meal => meal.json())
      .then(mealJson => addRecipes(mealJson));
  }
}

function addRecipes(mealJson) {
  $('#recipes ul').append(
    `<li>${mealJson.meals[0].strMeal}
      <p>${mealJson.meals[0].strInstructions}</p>
      <ol id="${mealJson.meals[0].idMeal}">Ingredients:</ol>
    </li>`
  );
  let j = 1;
    while (mealJson.meals[0][`strIngredient${j}`] != '') {
      $(`#${mealJson.meals[0].idMeal}`).append(
        `<li>${mealJson.meals[0][`strIngredient${j}`]}: ${mealJson.meals[0][`strMeasure${j}`]}</li>`
      );
      j++;
    }
}

function getLocation(food) {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    findNearbyRestaurants(lat, lon, food);
  });
}

function findNearbyRestaurants(lat, lon, food) {
  console.log(`Searching for restaurants near lat ${lat} and lon ${lon}...`)
  const url = `https://developers.zomato.com/api/v2.1/cuisines?lat=${lat}&lon=${lon}`
  const options = {
    headers: new Headers({
      'user-key': `fake-api-key`})
  }
  fetch(url, options)
    .then(response => response.json())
    .then(responseJson => getCuisineID(responseJson, food));
}

function getCuisineID(responseJson, food, lat, lon) {
  for (let i = 0; i < responseJson.cuisines.length; i++) {
    if (responseJson.cuisines[i].cuisine.cuisine_name == food) {
      const cuisineID = responseJson.cuisines[i].cuisine.cuisine_id;
      getRestaurants(lat, lon, cuisineID);
    }
  }
}

function getRestaurants(lat, lon, cuisineID) {
  const url = `https://developers.zomato.com/api/v2.1/search?lat=${lat}&lon=${lon}&radius=10000&cuisines=${cuisineID}`
  const options = {
    headers: new Headers({
      'user-key': `fake-api-key`})
  }
  fetch(url, options)
    .then(response => response.json())
    .then(responseJson => addRestaurants(responseJson));
}

function addRestaurants(responseJson) {
  for (let i = 0; i < responseJson.restaurants.length; i++) {
    const rest = responseJson.restaurants[i].restaurant;
    $('#restaurants ul').append(
      `<li>
        <a href="${rest.url}">${rest.name}</a>
        <p>${rest.location.address}
        ${rest.location.city} ${rest.location.zipcode}</p>
      </li>`
    )
  }
}

$(submitClicked);