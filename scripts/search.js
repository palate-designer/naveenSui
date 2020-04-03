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

recipeApp.key= keys[counter];

recipeApp.keySwap = () => {
    counter = (counter + 1) % keys.length
    recipeApp.key = keys[counter];
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
            apiKey: recipeApp.key, 
            ingredients: ingredientInput
        }
    }).then(function (result) {

        if (result == false) {
        } else {
            $('li').hide()
            let alerted = false;

            result.forEach(function (eachRecipe) {

                const recipeId = eachRecipe.id;
                console.log('recipeId', recipeId)
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
                            alerted = true;
                            swal("Sorry!", "Your selection didn't bring up any results! Please try again!", "error");
                            
                        }
                    }
                })
            });
        }
    });
}


recipeApp.init = function () {
    $('.searchBoxClass').on('submit', function (event) {
        event.preventDefault();
        $("ul")
            .removeClass("emptySuggestions")
            .addClass("suggestedRecipes");
        const ingredientInput = $('.inputBox').val();
        recipeApp.userDiet = $('input[name="diet"]:checked').val();

        recipeApp.getrecipes(ingredientInput);

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
    $('.searchBoxClass').trigger('reset'); 
    $('ul')
        .removeClass('suggestedRecipes') 
        .addClass('emptySuggestions');
    
})

$("a[href^='#']").click(function(e) {
    e.preventDefault();

    let position = $($(this).attr("href")).offset().top;

    $("body, html").animate(
        {
        scrollTop: position
        } 
    );
});


// Recipe App Inititated on doc ready
$(function () {
    recipeApp.init();

});