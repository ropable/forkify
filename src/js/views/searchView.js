import {elements} from "./base"

export const getInput = () => elements.searchInput.value
/*
 * Alternatively:
 * export const getInput = function() {
 *   let searchInput = document.querySelector(".search__field")
 *   return searchInput.value;
 * }
 */

export const clearInput = () => {
  // Function should not return anything, so we wrap this is curly braces.
  elements.searchInput.value = ""
}

export const clearResults = () => {
  elements.searchResList.innerHTML = ""
}

const renderRecipe = recipe => {
  // Private function
  const markup = `
<li>
    <a class="results__link results__link--active" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${recipe.title}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>
  `
  elements.searchResList.insertAdjacentHTML("beforeend", markup)
}

export const renderResults = recipes => {
  recipes.forEach(renderRecipe)
}
