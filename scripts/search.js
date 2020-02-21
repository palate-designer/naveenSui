const recipeApp = {
    key: '0d411c50c97a49d5a155391721a6abea',
};

recipeApp.userDiet = '';
//150 points perday
// Sui's Key : baa233e2a8bc401a83b89ba0f32ef23c
//Sui's Secondary Key: 279c2442197649fa90e84de120dfa672
//Sui's Third Key : ffbaefcb24f942e3b26825d47ad292b0
// Sui's Fourth key: 03807c83cc6546a980c784079a8c2fd8 
// Sui's Fifth key: a8e92198263545bcb214ec6e78a03c7f 
//Naveen's Key : e429c44d3e5e48beacacf5b14cc993a2
//Naveen's Secondary Key : 0d411c50c97a49d5a155391721a6abea


// Get recipes with user ingredients input (Whatever they have)
recipeApp.getrecipes = function (ingredientInput) {

    // Ajax request 1 [will retrieve IDs needed for recipe info]
    $.ajax({
        url: `https://api.spoonacular.com/recipes/findByIngredients`,
        method: 'GET',
        dataType: 'json',
        data: {
            apiKey: recipeApp.key,
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
    recipeApp.getrecipes();

    // Function to get user input through the search box and pass that as an argument in the function recipeApp.getrecipes(ingredientInput);
    $('.searchBoxClass').on('submit', function (event) {
        event.preventDefault();
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
    })
}

$('.reloadAll').on('click', function (e) {
    e.preventDefault();
    location.reload(true);
})


// Recipe App Inititated on doc ready
$(function () {
    recipeApp.init();

});