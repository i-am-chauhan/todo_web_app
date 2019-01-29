class TodoItem {
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }

  editDetails(title, description) {
    this.title = title;
    this.description = description;
  }
}

class TodoList {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.items = [];
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
