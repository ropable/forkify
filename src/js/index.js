import Search from "./models/Search"
import Recipe from "./models/Recipe"
import List from "./models/List"
import Likes from "./models/Likes"
import * as searchView from "./views/searchView"
import * as recipeView from "./views/recipeView"
import * as listView from "./views/listView"
import * as likesView from "./views/likesView"
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
  }
})

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  // Get the ID from the URL
  const id = window.location.hash.replace("#", "")

  if (id) {
    // Prepare UI for changes.
    recipeView.clearRecipe()
    renderLoader(elements.recipe)

    // Highlight selected search item.
    if (state.search) {
      searchView.highlightSelected(id)
    }

    // Create recipe object.
    state.recipe = new Recipe(id)
    window.r = state.recipe  // Expose the recipe to as a global var.

    try {
      // Get recipe data and parse ingredients.
      await state.recipe.getRecipe()
      state.recipe.parseIngredients()

      // Calculate time and servings.
      state.recipe.calcTime()
      state.recipe.calcServings()

      // Render the recipe.
      clearLoader()
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      )

    } catch (error) {
      console.log(error)
      alert("Error processing recipe!")
    }
  }
}

/*
 * LIST CONTROLLER
 */
const controlList = () => {
  // Create an empty list in the state object.
  if (!state.list) {
    state.list = new List()
  }

  // Add each ingredient to the list.
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient)
    listView.renderItem(item)
  })
}

/*
 * LIKES CONTROLLER
 */
const controlLike = () => {
  // ES6 if-then style:
  if (!state.likes) state.likes = new Likes()
  const currentID = state.recipe.id

  // User has not yet liked the recipe.
  if (!state.likes.isLiked(currentID)) {
    // Add new like to the state.
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    )
    // Toggle the like button.
    likesView.toggleLikeBtn(true)
    // Add like to the UI list.
    likesView.renderLike(newLike)
  // User has already liked the current recipe (delete it).
  } else {
    state.likes.deleteLike(currentID)
    likesView.toggleLikeBtn(false)
    likesView.deleteLike(currentID)
  }

  // Toggle the likes menu on/off.
  likesView.toggleLikesMenu(state.likes.getNumLikes())
}

//window.addEventListener("hashchange", controlRecipe)
//window.addEventListener("load", controlRecipe)
// Below is a quick way to add a single function to multiple event listeners:
["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe))


// Restore likes recipes on page load.
window.addEventListener('load', () => {
  state.likes = new Likes()
  // Restore any saved likes.
  state.likes.readStorage()
  // Toggle like menu button.
  likesView.toggleLikesMenu(state.likes.getNumLikes())
  // Render the likes to the UI.
  state.likes.likes.forEach(like => likesView.renderLike(like))
})

// Handling recipe button clicks.
elements.recipe.addEventListener("click", e => {
  // Match element, or any child of that element:
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // Decrease button is clicked.
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec")
    recipeView.updateServingsIngredients(state.recipe)
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // Increase button is clicked.
    state.recipe.updateServings("inc")
    recipeView.updateServingsIngredients(state.recipe)
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")){
    // Add ingredients to shopping list.
    controlList()
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Like controller.
    controlLike()
  }
})

// Handle delete and update list element events.
elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid

  // Handle the delete button.
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id)
    // Delete from UI
    listView.deleteItem(id)
  // Handle the count update.
  } else if (e.target.matches(".shopping__count-value")) {
    const value = parseFloat(e.target.value, 10)
    state.list.updateCount(id, value)
  }
})
