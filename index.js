'use strict';

function getRecipe(food) {
  console.log('getting recipes...');
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`)
    .then(response => response.json())
    .then(responseJson => addRecipes(responseJson));
// maybe some kind of catching thing to prevent errors w/ recipe API?
}

function getRestaurant(food) {
  console.log(`Currently, functionality to find restaurants serving ${food} is not implemented.`)
  // go to restaurant API, get nearby restaurants
  // call function to check restaurant menus
  // write out logic for how this works
}

function submitClicked() {
  $('form').submit(event => {
    event.preventDefault();
    console.log('submit clicked');
    const food = $(this).find('#searchbar').val();
    getRecipe(food);
    getRestaurant(food);
  })
}

$(submitClicked);