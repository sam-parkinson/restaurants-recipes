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

function getRestaurant(food) {
  console.log(`Currently, functionality to find restaurants serving ${food} is not implemented.`)
  // go to restaurant API, get nearby restaurants
  // call function to check restaurant menus
  // write out logic for how this works
}

function addRecipes(recipeJson) {
  const recData = recipeJson.meals;
  console.log(recData);
  for (let i = 0; i < recData.length; i++) {
    console.log(recData[i].strMeal);
    console.log(recData[i].strInstructions);
    let j = 1;
    while (recData[i][`strIngredient${j}`] != '') {
      console.log(recData[i][`strIngredient${j}`]);
      console.log(recData[i][`strMeasure${j}`]);
      j++;
    }
  }
  // add the recipes to the DOM
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