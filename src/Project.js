class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }
  editName(newName) {
    this.name = newName;
  }
  removeProject() {
    this.todos = [];
  }
  addToDo(toDo) {
    this.todos.push(toDo);
  }
  removeToDo(toDoTitle) {
    this.todos = this.todos.filter(todo => todo.title !== toDoTitle);
  }
}

export default Project;