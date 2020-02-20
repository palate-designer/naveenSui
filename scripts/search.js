const recipeApp = {
    key: 'ffbaefcb24f942e3b26825d47ad292b0',
};

recipeApp.userDiet = '';
//150 points perday
// Sui's Key : baa233e2a8bc401a83b89ba0f32ef23c
//Sui's Secondary Key: 279c2442197649fa90e84de120dfa672
//Sui's Third Key : ffbaefcb24f942e3b26825d47ad292b0
//Naveen's Key : e429c44d3e5e48beacacf5b14cc993a2
//Naveen's Secondary Key : 0d411c50c97a49d5a155391721a6abea


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
        console.log('input related all the recipies are here', result);

        if (result == false) {
            // console.log('nothing to show');
        } else {
            $('li').hide()
            // Used forEach function to go through each array and append into li
            //Setting alert to false before foreach in its default state
            let alerted = false;

            result.forEach(function (eachRecipe) {
                // console.log(eachRecipe);

                // Capturing ID of all the recipes in a variable and popping it in the link
                const recipeId = eachRecipe.id;
                // console.log(recipeId);

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
                    console.log('Worked our ID', eachInfo.diets);

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
                            // alert("Damnnnn !! We Rock");
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Hey! Your choice is inappropriate',
                            })
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
        const ingredientInput = $('.inputBox').val();
        console.log(ingredientInput); 
        recipeApp.userDiet = $('input[name="diet"]:checked').val();
        console.log(recipeApp.userDiet);
        // console.log(dietButton);

        recipeApp.getrecipes(ingredientInput);

        // empty out the input for search once the string is collected. ✔
        // $('#searchBox').empty();

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