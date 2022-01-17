// API references id at the end
var priorMeal = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="
var foodList = $("#previousrecipes");
var foodArray = [];
var btn = $("#recipebutton");

fetchMeal();
btn.on("click", fetchMeal);

function fetchMeal() {
  var mealDb = 'https:/www.themealdb.com/api/json/v1/1/random.php'

  fetch(mealDb)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      showRecipe(data);
      displayVideo(data);
      showList(data);
      previousFood(data);
      displayCountry(data);
      console.log(data);
    })
}

function displayCountry(data) {
  var country = data.meals[0].strArea;
  console.log(country);
  var countryName = $("#country");
  countryName = countryName.text(country);
}

//embeds youtube videos in the iframe
function displayVideo(data) {
  var video = $("#video");
  var fetchedURL = data.meals[0].strYoutube;
  if (fetchedURL === "") {
    video.remove();
    return;
  }
  var firstSplit = fetchedURL.split("watch");
  var secondSplit = firstSplit[1].split("=");
  videoURL = firstSplit[0] + "embed/" + secondSplit[1];
  video.attr("src", videoURL);
}

//displays recipe instructions
function showRecipe(data) {
  $("#recipetext").empty();
  var recipeDiv;
  var recipeName = $("#recipename");
  var name = data.meals[0].strMeal;
  var instructions = data.meals[0].strInstructions;
  recipeName = recipeName.text(name);
  recipeDiv = $("<p>").text(instructions);
  $("#recipetext").append(recipeDiv);
}

//displays recipe ingredients
function showList(data) {
  $("#shoppinglist").empty();
  //cycles through JSON array object looking for strIngredient1-20 and strMeasure keys, then appends them to a list as a pair 
  for (i = 1; i < 21; i++) {
    var ingredientKey = "strIngredient" + i;
    var measureKey = "strMeasure" + i;
    var meal = data.meals[0];
    if (!meal[ingredientKey]) {
      break;
    }
    var recipeLi = $("<li>").text(meal[ingredientKey] + " " + meal[measureKey]);
    $("#shoppinglist").append(recipeLi);
  }
}

function previousFood(data) {
  storedArray = JSON.parse(localStorage.getItem("foodItem"));

  if (storedArray) {
    foodArray = storedArray;
    foodList.textContent = "";
  }



  foodArray.push({
    "foodItem": data.meals[0].strMeal,
    "id": data.meals[0].idMeal
  });
  localStorage.setItem("foodItem", JSON.stringify(foodArray));



  for (i = 0; i < foodArray.length; i++) {
    var newDiv = $("<div>");
    var newBtn = $("<button>");
    var id = foodArray[i].id;
    //makes new button have a unique id and value matching meal Id
    newBtn.attr("value", id);
    newBtn.attr("id", "btn-recipe" + id)
    newBtn.text(foodArray[i].foodItem);
    foodList.append(newDiv);
    newDiv.append(newBtn);
    newBtn.css({
      "border-radius": "5px",
      "padding": "5px",
      "margin": "5px",
      "background-color": "#556B2F",
      "width": "40%",
      "color": " #FFFFF0"
    });

    // when value is clicked, it takes the value from the clicked button id
    $("#btn-recipe" + id).on("click", function (event) {
      event.preventDefault();
      id = $(this).val()
      // replace id value with button value
      fetch(priorMeal + id)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // runs showRecipe function using new api generated from ID
          showRecipe(data);
          showList(data);
          displayVideo(data);
        })
    });
  }
  
  function reset() {
    localStorage.removeItem("foodItem");
    $("#previousrecipes").remove();
  }
  $("#reset").on("click", function (event) {
    event.preventDefault();
    reset();
  })
}