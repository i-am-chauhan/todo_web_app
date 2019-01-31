const addList = (title, status, id) => {
  const statusBox = { done: "&#9745", undone: "&#9744" };
  const todoLists = document.getElementById("todoLists");
  const list = document.createElement("li");
  list.id = id;
  const checkBox = document.createElement("span");
  checkBox.id = `status_${id}`;
  checkBox.innerHTML = statusBox[status];
  const listTitle = document.createElement("a");
  listTitle.href = `/list/view?title=${title}&id=${id}`;
  listTitle.id = `title_${id}`;
  listTitle.innerText = `${title}`;
  todoLists.appendChild(list);
  list.appendChild(checkBox);
  list.appendChild(listTitle);
  createAndDrawButton(title, id, list);
};

const createAndDrawButton = function(title, id, parentElement) {
  const edit = createButton("edit", id);
  const del = createButton("delete", id);
  const editList = document.createElement("a");
  editList.href = `/list/edit?title=${title}&id=${id}`;
  const deleteList = document.createElement("a");
  deleteList.href = `/list/delete?title=${title}&id=${id}`;
  parentElement.appendChild(editList);
  parentElement.appendChild(deleteList);
  editList.appendChild(edit);
  deleteList.appendChild(del);
};

const createButton = function(name, id) {
  let button = document.createElement("button");
  button.id = `${name}_${id}`;
  button.innerText = name;
  return button;
};

const showList = function(titles) {
  let id = 0;
  console.log('titles', titles);
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
