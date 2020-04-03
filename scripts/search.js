// Spoonacular API procides 150 points free, perday
// Sui's Key : baa233e2a8bc401a83b89ba0f32ef23c
// Sui's Secondary Key: 279c2442197649fa90e84de120dfa672
// Sui's Third Key : ffbaefcb24f942e3b26825d47ad292b0
// Sui's Fourth key: 03807c83cc6546a980c784079a8c2fd8 
// Sui's Fifth key: a8e92198263545bcb214ec6e78a03c7f 
// Naveen's Key : e429c44d3e5e48beacacf5b14cc993a2
// Naveen's Secondary Key : 0d411c50c97a49d5a155391721a6abea

// ** each key produces 7 clicks of functionality for this app. with 8 keys,we will be able to get 56 clicks per day, instead of 7. Add more keys for better functionality.

//function to loop through keys per click:
const recipeApp = {};
let keys = [
    "baa233e2a8bc401a83b89ba0f32ef23c",
    "279c2442197649fa90e84de120dfa672",
    "0d411c50c97a49d5a155391721a6abea",
    "ffbaefcb24f942e3b26825d47ad292b0",
    "03807c83cc6546a980c784079a8c2fd8",
    "a8e92198263545bcb214ec6e78a03c7f",
    "e429c44d3e5e48beacacf5b14cc993a2",
    "0d411c50c97a49d5a155391721a6abea"
    ],
    counter = 0;

console.log('initialkey', keys[counter]); //initial value

recipeApp.key= keys[counter];

recipeApp.keySwap = () => {
    counter = (counter + 1) % keys.length
    console.log('increment counter', keys[counter]); 
    //increment counter
    //modulus (%) operater resets the counter to 0 when it reaches the length of the array; thus restarting the count whenever the counter(index) reaches the end of the array.
    
    recipeApp.key = keys[counter];
    
    console.log("recipeApp.key", recipeApp.key); //key currently being used, 
};


recipeApp.userDiet = '';

// Get recipes with user ingredients input (Whatever they have)
recipeApp.getrecipes = function (ingredientInput) {
    // Ajax request 1 [will retrieve IDs needed for recipe info]
    $.ajax({
        url: `https://api.spoonacular.com/recipes/findByIngredients`,
        method: 'GET',
        dataType: 'json',
        data: {
            apiKey: recipeApp.key, //key grabbed from the function on click for the submit button.
            ingredients: ingredientInput
        }
    }).then(function (result) {

        if (result == false) {
        } else {
            $('li').hide()
            // Used forEach function to go through each array and append into li
            //Setting alert to false before foreach in its default state
            let alerted = false;

            result.forEach(function (eachRecipe) {

                // Capturing ID of all the recipes in a variable and popping it in the link
                const recipeId = eachRecipe.id;
                console.log('recipeId', recipeId)
                //Make ajax call with new end point with recipeID to gain recipe info on url, dietary restrictions, instructions and etc..
                //Ajax 2
                $.ajax({
                    url: `https://api.spoonacular.com/recipes/${recipeId}/information`,
                    method: 'GET',
                    dataType: 'json',
                    data: {
                        apiKey: recipeApp.key,
                        id: `${recipeId}`
                    }
                }).then(function (eachInfo) {

                    // if dietary restrictions have no input, run search without.
                    if (!recipeApp.userDiet) {
                        const recipeInstruction = eachInfo.sourceUrl;
                        const htmlToAppend = `
                                <li>
                                    <a href="${recipeInstruction}" target="_blank">
                                    <img src="${eachRecipe.image}" alt="${eachRecipe.title}">
                                    <p>${eachRecipe.title}</p>
                                    </a>
                                </li>`
                        $('ul.suggestedRecipes').append(htmlToAppend);
                    } else if (eachInfo.diets.includes(recipeApp.userDiet)) {
                        // if dietary restrictions selected, check against input value to match diets array input value in API
                        const recipeInstruction = eachInfo.sourceUrl;
                        const htmlToAppend = `
                                <li>
                                    <a href="${recipeInstruction}" target="_blank">
                                    <img src="${eachRecipe.image}" alt="${eachRecipe.title}">
                                    <p>${eachRecipe.title}</p>
                                    </a>
                                </li>`
                        $('ul.suggestedRecipes').append(htmlToAppend);
                    } else {
                        if (!alerted) {
                            // if no results come from both ingredient and dietary restriction input, then switch on first alert to true, and send alert. No other alerts should come up.
                            alerted = true;
                            // alert("Damnnnn !! We Rock");

                            swal("Sorry!", "Your selection didn't bring up any results! Please try again!", "error");
                            
                        }
                    }
                })
            });
        }
    });
}


recipeApp.init = function () {
    // recipeApp.getrecipes();

    // Function to get user input through the search box and pass that as an argument in the function recipeApp.getrecipes(ingredientInput);
    $('.searchBoxClass').on('submit', function (event) {
        event.preventDefault();
        $("ul")
            .removeClass("emptySuggestions")
            .addClass("suggestedRecipes");
        // on form submit, take value of ingredient from search input and search. This form will also include values from radio button inputs for dietary restrictions.
        const ingredientInput = $('.inputBox').val();
        recipeApp.userDiet = $('input[name="diet"]:checked').val();

        // input user input of ingredients to the function to get recipes.
        recipeApp.getrecipes(ingredientInput);

        // move from header to results section. ✔
        $('html, body').animate({
            scrollTop: $("main").offset().top
        },
            'slow');

        //swap key
        recipeApp.keySwap();
    })
}


//clear results and scroll to top
$('.reloadAll').on('click', function (e) {
    e.preventDefault();
    $('.searchBoxClass').trigger('reset'); //reset form inputs
    $('ul')
        .removeClass('suggestedRecipes') //hide placeholders
        .addClass('emptySuggestions');
    
})

$("a[href^='#']").click(function(e) {
    e.preventDefault();

    let position = $($(this).attr("href")).offset().top;

    $("body, html").animate(
        {
        scrollTop: position
        } /* speed */
    );
});


// Recipe App Inititated on doc ready
$(function () {
    recipeApp.init();

});