class TodoItem {
  constructor(description) {
    this.description = description;
    this.statusType = ["done", "undone"];
    this.statusIndex = 0;
    this.status = "undone";
  }

  editDetails(description) {
    this.description = description;
  }

  toggleStatus() {
    this.statusIndex = 1 - this.statusIndex;
    this.status = this.statusType[this.statusIndex];
  }
}

class TodoList {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.items = [];
    this.statusType = ["done", "undone"];
    this.statusIndex = 0;
    this.status = "undone";
  }

  addItem(item) {
    this.items.push(item);
  }

  editDetails(title, description) {
    this.title = title;
    this.description = description;
  }

  deleteItem(id) {
    this.items.splice(id, 1);
  }

  toggleStatus() {
    this.statusIndex = 1 - this.statusIndex;
    this.status = this.statusType[this.statusIndex];
  }
}

class UserTODOs {
  constructor(userId) {
    this.userId = userId;
    this.todoList = [];
  }

  addTodoList(list) {
    this.todoList.push(list);
  }

  deleteTodoList(id) {
    this.todoList.splice(id, 1);
  }
}

module.exports = { TodoList, UserTODOs, TodoItem };
