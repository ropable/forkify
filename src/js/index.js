import Search from "./models/Search"
import * as searchView from "./views/searchView"
import {elements, renderLoader, clearLoader} from "./views/base"

/* Global state
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Linked recipes
 */
const state = {}

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

    // 4) Search for recipes.
    await state.search.getResults()

    // 5) Render results on UI.
    clearLoader()
    searchView.renderResults(state.search.results)
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
