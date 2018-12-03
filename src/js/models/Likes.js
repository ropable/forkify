export default class Likes {
  constructor() {
    this.likes = []
  }

  addLike(id, title, author, img) {
    const like = {id, title, author, img}
    this.likes.push(like)
    this.persistData(this.likes)
    return like
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id)
    this.likes.splice(index, 1)
    this.persistData(this.likes)
  }

  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1
  }

  getNumLikes() {
    return this.likes.length
  }

  persistData() {
    // Persist likes data to localStorage.
    localStorage.setItem('likes', JSON.stringify(this.likes))
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'))
    // Restore likes from localStorage.
    if (storage) {
      this.likes = storage
    }
  }
}
