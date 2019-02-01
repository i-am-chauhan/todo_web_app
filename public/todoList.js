const setHref = function(action, title, id) {
  return `/list/${action}?title=${title}&id=${id}`;
};

const createButton = function(action, className, id, title, parentElement) {
  let button = document.createElement("button");
  button.id = `${action}_${id}`;
  button.innerText = action;
  button.className = className;
  const anchor = document.createElement("a");
  anchor.href = setHref(action, title, id);
  parentElement.appendChild(anchor);
  anchor.appendChild(button);
};

const createAndDrawButton = function(title, id, parentElement) {
  createButton("view", "viewButton", id, title, parentElement);
  createButton("edit", "editButton", id, title, parentElement);
  createButton("delete", "deleteButton", id, title, parentElement);
};

const addList = (title, status, id) => {
  const statusBox = { done: "&#9745", undone: "&#9744" };
  const todoLists = document.getElementById("todoLists");
  const list = document.createElement("div");
  list.id = id;
  const checkBox = document.createElement("span");
  checkBox.id = `status_${id}`;
  checkBox.innerHTML = statusBox[status];
  const listTitle = document.createElement("span");
  list.className = "listTitle";
  listTitle.innerText = title;
  todoLists.appendChild(list);
  list.appendChild(checkBox);
  list.appendChild(listTitle);
  createAndDrawButton(title, id, list);
};

const showList = function(titles) {
  let id = 0;
  titles.map(({ title, status }) => {
    addList(title, status, id);
    id++;
  });
};

const clearForm = function(firstElement, secondElement) {
  firstElement.value = "";
  secondElement.value = "";
};

const addListAndFetchAllLists = function() {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const listData = `title=${title.value}&description=${description.value}`;
  const req = new Request("/addList", { method: "POST", body: listData });
  const todoLists = document.getElementById("todoLists");
  clearForm(title, description);
  todoLists.innerHTML = "";
  fetch(req)
    .then(res => res.json())
    .then(showList);
};

const fetchAllLists = function() {
  const req = new Request("/showList", { method: "GET" });
  fetch(req)
    .then(res => res.json())
    .then(showList);
};

const toggleStatus = function(listId) {
  const container = document.getElementById("todoLists");
  container.innerHTML = "";
  fetch("/toggleListStatus", { method: "POST", body: listId })
    .then(res => res.json())
    .then(showList);
};

const updateStatus = function(checkBoxId) {
  const listId = checkBoxId.slice(7);
  toggleStatus(listId);
};

window.onload = () => {
  fetchAllLists();
  const add = document.getElementById("add");
  add.onclick = addListAndFetchAllLists;
  const container = document.getElementById("todoLists");
  container.onclick = () => {
    const id = event.target.id;
    if (id.startsWith("status")) {
      updateStatus(id);
    }
  };
};
