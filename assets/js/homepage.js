var homeBtn = $("#recipebutton");
//Fucntion that creates a click event for the home button and switches to page2.html
function handleButton() {
    document.location.assign("./page2.html");
}

homeBtn.on("click", handleButton);