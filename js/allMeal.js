// its make a favourites meal array if its not exist in local storage
if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// its fetch meals from api and return it
async function fetchMealsFromApi(url, value) {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}


// its show's all meals card in main acording to search input value
function showMealList() {
    let inputValue = document.getElementById("my-search").value;
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    let meals = fetchMealsFromApi(url, inputValue);
    meals.then(data => {
        if (data.meals) {
            data.meals.forEach((element) => {
                let isFav = false;
                for (let index = 0; index < arr.length; index++) {
                    if (arr[index] == element.idMeal) {
                        isFav = true;
                    }
                }
                if (isFav) {
                    html += `
                <div id="card" class="card mb-5" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light more-de" onclick="showMealDetails(${element.idMeal})" id="show-recipe">More Details</button>
                        <i class="fa-solid fa-heart " id="main${element.idMeal}" onclick="addRemoveToFavList(${element.idMeal})" style="color:red"></i>
                        </div>
                    </div>
                </div>
                `;
                } else {
                    html += `
                <div id="card" class="card mb-5" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light more-de" onclick="showMealDetails(${element.idMeal})" >More Details</button>
                            <i class="fa-solid fa-heart " id="main${element.idMeal}" onclick="addRemoveToFavList(${element.idMeal})" style="color:gray"></i>
                        </div>
                    </div>
                </div>
                `;
                }
            });
        } else {
            html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                The meal you are looking for was not found.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        document.getElementById("main").innerHTML = html;
    });
}




//its adds and remove meals to favourites list
function addRemoveToFavList(id) {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let contain = false;
    for (let index = 0; index < arr.length; index++) {
        if (id == arr[index]) {
            contain = true;
        }
    }
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("Meal removed from favourites list");
    } else {
        arr.push(id);
        alert("Meal added to favourites list");
    }
    localStorage.setItem("favouritesList", JSON.stringify(arr));
    showMealList();
    showFavMealList();
}



// its shows all favourites meals in favourites body
async function showFavMealList() {
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    if (arr.length == 0) {
        html = html + `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    } else {
        for (let index = 0; index < arr.length; index++) {
            await fetchMealsFromApi(url, arr[index]).then(data => {
                html += `
                <div id="card" class="card m-3 " style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body d-flex">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between ">
                        <i class="fa-solid fa-heart mt-1 mx-3"  id="main${data.meals[0].idMeal}" onclick="addRemoveToFavList(${data.meals[0].idMeal})"></i>
                        </div>
                    </div>
                </div>
               
                `;
            });
        }
    }
    document.getElementById("favourites-body").innerHTML = html;
}


// show all details of meal 

async function showMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    await fetchMealsFromApi(url, id).then(data => {
        html += `
        <div class="container">
    <div id="meal-details" class="mb-5 row">
        <div id="meal-header" class="d-flex col-lg-6 col-sm-12">
                <div id="meal-thumbail">
                    <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="">
                </div>
        </div>
            <div class="col-lg-6 col-sm-12 ">
                <div id="details">
                    <h1>${data.meals[0].strMeal}</h1>
                    <h2>Category : ${data.meals[0].strCategory}</h2>
                    <h2>Area : ${data.meals[0].strArea}</h2>
                </div>
            </div>
    </div>
    <div class="text-center col-lg-12 ">
        <h5 class="text-center">Instruction :</h5>
        <p>${data.meals[0].strInstructions}</p>
        <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
    </div>
</div>
        `;
    });
    document.getElementById("main").innerHTML = html;
}
