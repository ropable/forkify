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

const limitRecipeTitle = (title, limit=17) => {
  if (title.length > limit) {
    const newTitle = []
    title.split(" ").reduce((accumulator, currentValue) => {
      // Callback function called for each member of the title array.
      if (accumulator + currentValue.length <= limit) {
        // If the accumulator + current word length is <= the limit, add the word
        // to the newTitle array.
        newTitle.push(currentValue)
      }
      return accumulator + currentValue.length
    }, 0)
    // Return the result, joined as a string.
    return `${newTitle.join(" ")} ...`
  }
  return title
}

const renderRecipe = recipe => {
  // Private function to render a single recipe result.
  const markup = `
<li>
    <a class="results__link results__link--active" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>
  `
  elements.searchResList.insertAdjacentHTML("beforeend", markup)
}

// type can be 'prev' or 'next'
const createButton = (page, type) => `
      <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
          <svg class="search__icon">
              <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
          </svg>
          <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
      </button>
`

const renderButtons = (page, numResults, resPerPage) => {
  // Render the pagination buttons.
  const pages = Math.ceil(numResults / resPerPage)
  let button

  if (page === 1) {
    // Button for next page.
    button = createButton(page, 'next')
  } else if (page < pages) {
    // Both buttons.
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `
  }
  else if (page === pages && pages > 1) {  // Last page
    // Only button for prev page.
    button = createButton(page, 'prev')
  }

  elements.searchResPages.insertAdjacentHTML("afterbegin", button)
}

export const renderResults = (recipes, page=1, resPerPage=10) => {
  // Render results of current page.
  const start = (page - 1) * resPerPage
  const end = page * resPerPage

  recipes.slice(start, end).forEach(renderRecipe)

  // Render pagination buttons.
  renderButtons(page, recipes.length, resPerPage)
}
