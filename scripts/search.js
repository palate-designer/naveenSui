
const recipeApp = {
    key: '279c2442197649fa90e84de120dfa672',
};

// Get recipes with user ingredients input (Whatever they have)
recipeApp.getrecipes = function (ingredientInput) {

    // Ajax request 1
    $.ajax({
        url: `https://api.spoonacular.com/recipes/findByIngredients`,
        method: 'GET',
        dataType: 'json',
        data: {
            apiKey: recipeApp.key,
            ingredients: ingredientInput
        }
    }).then(function (result) {
        // console.log('input related all the recipies are here', result);

        if (result == false) {
            // console.log('nothing to show');
        } else {
            $('li').hide() &&
                // Used forEach function to go through each array and append into li
                result.forEach(function (eachRecipe) {
                    // console.log(eachRecipe);

                    // Capturing ID of all the recipes in a variable and popping it in the link
                    const recipeId = eachRecipe.id;
                    console.log(recipeId);

                    //Make ajax call with new end point with recipeID and go deep into how to make that recipe.
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
                        console.log('Worked our ID', eachInfo);
                        const recipeInstruction = eachInfo.sourceUrl;
                        const htmlToAppend = `
                        <li>
                            <a href="${recipeInstruction}" target="_blank">
                            <img src="${eachRecipe.image}" alt="${eachRecipe.title}">
                            </a>
                            <p>${eachRecipe.title}</p>
                        </li>`
                        $('ul.suggestedRecipes').append(htmlToAppend);
                        
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
        const ingredientInput = $('.inputBox').val();
        // console.log(ingredientInput); 
        recipeApp.getrecipes(ingredientInput);

        // empty out the input for search once the string is collected. ✔
        // $('#searchBox').empty();

        // move from header to results section. ✔
        $('html, body').animate({
            scrollTop: $("main").offset().top},
            'slow');
    })
}


// Recipe App Inititated on doc ready
$(function () {
    recipeApp.init();
});