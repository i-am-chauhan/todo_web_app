class TodoItem {
  constructor(description, status) {
    this.description = description;
    this.status = status;
    this.statusType = {undone:"done", done:"undone"};
  }

  editDetails(description) {
    this.description = description;
  }

  toggleStatus() {
    this.status = this.statusType[this.status];
  }
}

class TodoList {
  constructor(title, description, status) {
    this.title = title;
    this.description = description;
    this.status = status;
    this.items = [];
    this.statusType = {undone:"done", done:"undone"};
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
    this.status = this.statusType[this.status];
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
