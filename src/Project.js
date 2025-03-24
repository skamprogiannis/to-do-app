import { v4 as uuidv4 } from 'uuid';
class Project {
  constructor(name, tasks = [], id = null) {
    this.name = name;
    this.tasks = tasks;
    this.id = id || uuidv4(); // If no ID is provided, generate a new one
  }
  editName(newName) {
    this.name = newName;
  }
  removeProject() {
    this.tasks = [];
  }
  addTask(task) {
    this.tasks.push(task);
  }
  removeTask(taskTitle) {
    this.tasks = this.tasks.filter(task => task.title !== taskTitle);
  }
}

export default Project;