'use strict';

function noResults(food, cont) {
  $(`#${cont} ul`).append(
    `<p>No ${cont} were found matching ${food}.</p>`
  );
}

function recError(logger, food) {
  if (logger.length == 2) {
    const cont = 'recipes';
    noResults(food, cont);
  }
}

function addRecipes(mealJson) {
  $('#recipes ul').append(
    `<li>${mealJson.meals[0].strMeal}
      <p>${mealJson.meals[0].strInstructions}</p>
      <ol class="ingred" id="${mealJson.meals[0].idMeal}">Ingredients:</ol>
    </li>`
  );
  let j = 1;
    while (mealJson.meals[0][`strIngredient${j}`] != '' && mealJson.meals[0][`strIngredient${j}`] != null) {
      $(`#${mealJson.meals[0].idMeal}`).append(
        `<li>${mealJson.meals[0][`strIngredient${j}`]}: ${mealJson.meals[0][`strMeasure${j}`]}</li>`
      );
      j++;
    }
}

function getRecipes(responseJson) {
  $('#recipes ul').empty();
  for (let i = 0; i < responseJson.meals.length; i++) {
    fetch (`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${responseJson.meals[i].idMeal}`)
      .then(meal => meal.json())
      .then(mealJson => addRecipes(mealJson))
      .catch(err => console.log('Recipes not found:', err));
  }
}

function getCategory(food) {
  console.log('getting recipes...');
  const logger = [];
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${food}`)
    .then(response =>response.json())
    .then(responseJson => getRecipes(responseJson))
    .catch(err => {
      console.log(`Category ${food} not found:`, err);
      logger.push(err);
      recError(logger, food);
    });
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${food}`)
    .then(response => response.json())
    .then(responseJson => getRecipes(responseJson))
    .catch(err => {
      console.log(`Area ${food} not found:`, err);
      logger.push(err);
      recError(logger, food);
    });
}

function addRestaurants(responseJson) {
  $('#restaurants ul').empty();
  for (let i = 0; i < responseJson.restaurants.length; i++) {
    const rest = responseJson.restaurants[i].restaurant;
    $('#restaurants ul').append(
      `<li>
        <a href="${rest.url}">${rest.name}</a>
        <p>${rest.location.address}</p>
      </li>`
    );
  }
}

function getRestaurants(lat, lon, cuisineID, food) {
  const url = `https://developers.zomato.com/api/v2.1/search?lat=${lat}&lon=${lon}&radius=10000&cuisines=${cuisineID}&sort=real_distance`;
  fetch(url, options)
    .then(response => response.json())
    .then(responseJson => addRestaurants(responseJson))
    .catch(err => {
      console.log('No restaurants found in your area:', err);
      const cont = 'restaurants';
      noResults(food, cont);
    });
}

function getCuisineID(responseJson, food, lat, lon) {
  for (let i = 0; i < responseJson.cuisines.length; i++) {
    if (responseJson.cuisines[i].cuisine.cuisine_name == food) {
      const cuisineID = responseJson.cuisines[i].cuisine.cuisine_id;
      getRestaurants(lat, lon, cuisineID, food);
    }
  }
  const cont = 'restaurants';
  noResults(food, cont);
}

function findCuisines(lat, lon, food) {
  console.log(`Searching for restaurants near lat ${lat} and lon ${lon}...`);
  const url = `https://developers.zomato.com/api/v2.1/cuisines?lat=${lat}&lon=${lon}`;
  fetch(url, options)
    .then(response => response.json())
    .then(responseJson => getCuisineID(responseJson, food, lat, lon))
    .catch(err => {
      console.log('Unable to retrieve cuisine list:', err);
      const cont = 'restaurants';
      noResults(food, cont);
    });
}

function getLocation(food) {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    findCuisines(lat, lon, food);
  });
}

function submitClicked() {
  $('form').submit(event => {
    event.preventDefault();
    $('.container').removeClass('focused unfocused hidden').addClass('default');
    $('.container ul').empty().append(
      '<p>Finding food...</p>'
    );
    const input = $(this).find('#searchbar').val();
    const food = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    getCategory(food);
    getLocation(food);
    divClicked();
  })
}

function divClicked() {
  $('.container').click(function() {
    $('.container').removeClass('default focused').addClass('unfocused');
    $(this).removeClass('unfocused').addClass('focused');
  })
}

$(submitClicked);