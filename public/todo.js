const addList = (title, id) => {
  const todoLists = document.getElementById("todoLists");
  const list = document.createElement("li");
  list.id = id;
  const edit = createButton("edit", id);
  const del = createButton("delete", id);
  const listTitle = document.createElement("a");
  listTitle.href = `/list/view/title=${title}&id=${id}`;
  const editList = document.createElement("a");
  editList.href = `/list/edit/title=${title}&id=${id}`;
  const deleteList = document.createElement("a");
  deleteList.href = `/list/delete/title=${title}&id=${id}`;
  listTitle.id = `title_${id}`;
  listTitle.innerText = `${title}`;
  todoLists.appendChild(list);
  list.appendChild(listTitle);
  list.appendChild(editList);
  list.appendChild(deleteList);
  editList.appendChild(edit);
  deleteList.appendChild(del);
};

const createButton = function(name, id) {
  let button = document.createElement("button");
  button.id = `${name}_${id}`;
  button.innerText = `${name}`;
  return button;
};

const showList = function(titles) {
  let id = 0;
  titles.map(listTitle => {
    addList(listTitle, id);
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

const performOperation = function() {
  const target = event.target;
  const id = target.id;
  if (id.startsWith("edit")) editList(id);
  if (id.startsWith("delete")) deleteList(id);
};

const editList = function(id) {};

window.onload = () => {
  fetchAllLists();
  const add = document.getElementById("add");
  add.onclick = addListAndFetchAllLists;
  const container = document.getElementById("todoLists");
  container.onclick = performOperation;
};
