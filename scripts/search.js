// 🧠🧠 LOGIC:
    // Set a variable to store the input of the search box on the header.
    // on click, search API with the string value.
    // return the ID.
    // console log to test.

// 📝DECLARE VARIABLES (GLOBAL SCOPE)
const myApp={
    apiKey: "baa233e2a8bc401a83b89ba0f32ef23c",
};

let searchValue;



// 📧 Ajax request for ingredients search
myApp.getInfo = function(userInput){

    // ajax search:
    $.ajax({
        url: 'https://api.spoonacular.com/recipes/findByIngredients',
        method: 'GET',
        dataType: 'json',
        data: {
            apiKey: myApp.apiKey,
            format: 'json',
            ingredients: userInput
        }
    }).then(function(searchResult){
        console.log('information returned: ', searchResult); //✔
        
        if (searchResult == false) {
            console.log('no results');
        } else {
            // using the forEach method to go through each array index without having to specify, and be able to search specifically for the id.
            searchResults.forEach(function(eachRecipe){
                console.log('results for: ', eachRecipe); //❌❌

                // Naveen's portion:
                const htmlToAppend = `
                    <li>
                        <a href="#">
                        <img src="${eachRecipe.image}" alt="${eachRecipe.title}">
                        </a>
                        <p>${eachRecipe.title}</p>
                    </li>`
                $('ul.suggestedRecipes').append(htmlToAppend);

                // Capturing ID of all the recipes in a variable and popping it in the link
                const recipeId = eachRecipe.id;
                console.log(recipeId);

                //Make ajax call with new end point with recipeID and go deep into how to make that recipe.
            }
        )}
    });
};

// ✨✨ FUNCTIONALITY INITIATION! ENGAGE!

    // retrieve user input through the search box and pass as parameter
    $('.searchBoxClass').on('submit', function (e) {
        e.preventDefault();
        const userInput = $('.inputBox').val();
        console.log('userInput: ', userInput);

        myApp.getInfo(userInput);
        

        // empty out the input for search once the string is collected. ✔
        // $('#searchBox').empty();

        // move from header to results section.
        // $('html, body').animate({
        //     scrollTop: $("section").offSet().top},
        //     'slow');
    });


myApp.init = function () {
    console.log('app started');
};    

$(function(){
    myApp.init();

    
});

$(document).ready(function(){
    console.log('document is ready');
})



