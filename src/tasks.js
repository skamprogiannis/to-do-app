import { v4 as uuidv4 } from 'uuid';

class Task {
  constructor(title, description, dueDate, priority, completed = false, projectID, id = null) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
    this.projectId = projectID;
    this.id = id || uuidv4(); // If no ID is provided, generate a new one
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

export default Task;