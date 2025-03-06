class ToDo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = false;
  }

  editTitle(newTitle) {
    this.title = newTitle;
  }
  editDescription(newDescription) {
    this.description = newDescription;
  }
  editDueDate(newDueDate) {
    this.dueDate = newDueDate;
  }
  editPriority(newPriority) {
    this.priority = newPriority;
  }
  toggleCompleted() {
    this.completed = !this.completed;
  }
}

export default ToDo;