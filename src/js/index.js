import axios from "axios"

async function getResults(query) {
  const key = "foobar"
  try {
    const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`)
    const recipes = res.data.recipes
    console.log(recipes)
  } catch (error) {
    console.log(error)
  }
}

getResults("chicken")
