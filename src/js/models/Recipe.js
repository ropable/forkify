import axios from "axios"
import {key} from "../config"

export default class Recipe {
  constructor(id) {
    this.id = id
  }

  async getRecipe() {
    try {
      const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`)
      this.title = res.data.recipe.title
      this.author = res.data.recipe.publisher
      this.img = res.data.recipe.image_url
      this.url = res.data.recipe.source_url
      this.ingredients = res.data.recipe.ingredients
    } catch (error) {
      console.log(error)
    }
  }

  calcTime() {
    // Assumption: we need 15 min for each 3 ingredients.
    const numIng = this.ingredients.length
    const periods = Math.ceil(numIng / 3)
    this.time = periods * 15  // Minutes.
  }

  calcServings() {
    this.servings = 4  // Hard code 4 for every recipe.
  }
}


