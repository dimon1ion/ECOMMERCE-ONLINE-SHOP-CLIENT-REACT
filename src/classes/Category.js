export class Category {
    id;
    name;
    thumbnail;
    parent = null;
    children = [];
    constructor(id, name, thumbnail) {
      this.id = id;
      this.name = name;
      this.thumbnail = thumbnail;
    }
    addChild(category) {
      category.parent = this;
      this.children.push(category);
    }
    addChildren(array) {
      for (let i in array) {
        if (array[i].parent !== undefined) {
          array[i].parent = this;
          this.children.push(array[i]);
        }
      }
    }
  }