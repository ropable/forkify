import Search from "./models/Search"
import Recipe from "./models/Recipe"
import * as searchView from "./views/searchView"
import {elements, renderLoader, clearLoader} from "./views/base"

/* Global state
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Linked recipes
 */
const state = {}

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1) Get query from view.
  const query = searchView.getInput()

  if (query) {
    // 2) New search object and add it to state.
    state.search = new Search(query)

    // 3) Prepare UI for results.
    searchView.clearInput()
    searchView.clearResults()
    renderLoader(elements.searchRes)

    try {
      // 4) Search for recipes.
      await state.search.getResults()

      // 5) Render results on UI.
      clearLoader()
      searchView.renderResults(state.search.results)
    } catch (error) {
      clearLoader()
      console.log(error)
      alert("Something wrong with search!")
    }
  }
}

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault()
  controlSearch()
})

elements.searchResPages.addEventListener("click", e => {
  // No matter where we click in a pagination button, get the ancestor button element.
  const btn = e.target.closest(".btn-inline")
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10)  // Data attribute on the button element.
    // Clear previous results.
    searchView.clearResults()
    // Render next page of results.
    searchView.renderResults(state.search.results, goToPage)
    console.log(goToPage)
  }
})

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  // Get the ID from the URL
  const id = window.location.hash.replace("#", "")
  console.log(id)

  if (id) {
    // Prepare UI for changes.

    // Create recipe object.
    state.recipe = new Recipe(id)

    try {
      // Get recipe data.
      await state.recipe.getRecipe()

      // Calculate time and servings.
      state.recipe.calcTime()
      state.recipe.calcServings()

      // Render recipe.
      console.log(state.recipe)
    } catch (error) {
      console.log(error)
      alert("Error processing recipe!")
    }
  }
}

//window.addEventListener("hashchange", controlRecipe)
//window.addEventListener("load", controlRecipe)
// Below is a quick way to add a single function to multiple event listeners:
["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe))
