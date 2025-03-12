class Project {
  constructor(name, tasks = []) {
    this.name = name;
    this.tasks = tasks;
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