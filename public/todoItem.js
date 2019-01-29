const parseURL = function(url) {
  return (
    "/" +
    url
      .split("/")
      .slice(3)
      .join("/")
  );
};

const addItem = (currentURL, description, status, id) => {
  const statusBox = { done: "&#9745", undone: "&#9744" };
  const todoItems = document.getElementById("todoItems");
  let item = document.createElement("li");
  let checkBox = document.createElement("span");
  checkBox.id = `status_${id}`;
  checkBox.innerHTML = statusBox[status];
  item.id = id;
  const descriptionArea = document.createElement("span");
  descriptionArea.innerText = description;
  todoItems.appendChild(item);
  item.appendChild(checkBox);
  item.appendChild(descriptionArea);
  createAndDrawButton(currentURL, id, item);
};

const createAndDrawButton = function(currentURL, id, parentElement) {
  const listId = getId(currentURL);
  const edit = createButton("edit", id);
  const del = createButton("delete", id);
  const editItem = document.createElement("a");
  editItem.href = `/item/edit/listId=${listId}&itemId=${id}`;
  const deleteItem = document.createElement("a");
  deleteItem.href = `/item/delete/listId=${listId}&itemId=${id}`;
  parentElement.appendChild(editItem);
  parentElement.appendChild(deleteItem);
  editItem.appendChild(edit);
  deleteItem.appendChild(del);
};

const createButton = function(name, id) {
  let button = document.createElement("button");
  button.id = `${name}_${id}`;
  button.innerText = name;
  return button;
};

const showItems = function(url, items) {
  let id = 0;
  items.map(item => {
    addItem(url, item.description, item.status, id);
    id++;
  });
};

const fetchAllItems = function(currentURL) {
  const url = parseURL(currentURL);
  const req = new Request(url, { method: "POST" });
  fetch(req)
    .then(res => res.json())
    .then(showItems.bind(null, currentURL));
};

const clearForm = function(element) {
  element.value = "";
};

const getId = url => {
  const titleAndId = url.split("/")[5];
  return titleAndId.split("&")[1].split("=")[1];
};

const addItemAndFetchAllItems = function(currentURL) {
  const listId = getId(currentURL);
  const description = document.getElementById("description");
  const itemData = `description=${description.value}&listId=${listId}`;
  const req = new Request("/addItem", { method: "POST", body: itemData });
  const todoItems = document.getElementById("todoItems");
  clearForm(description);
  todoItems.innerHTML = "";
  fetch(req)
    .then(res => res.json())
    .then(showItems.bind(null, currentURL));
};

const toggleStatus = function(currentURL, listId, itemId) {
  const container = document.getElementById("todoItems");
  container.innerHTML = "";
  fetch("/toggleItemStatus", {
    method: "POST",
    body: `listId=${listId}&itemId=${itemId}`
  })
    .then(res => res.json())
    .then(showItems.bind(null, currentURL));
};

const updateStatus = function(currentURL, checkBoxId) {
  const listId = getId(currentURL);
  const itemId = checkBoxId.slice(7);
  toggleStatus(currentURL, listId, itemId);
};

window.onload = () => {
  const currentURL = document.location.href;
  fetchAllItems(currentURL);
  const add = document.getElementById("add");
  add.onclick = addItemAndFetchAllItems.bind(null, currentURL);
  const container = document.getElementById("todoItems");
  container.onclick = () => {
    const id = event.target.id;
    if (id.startsWith("status")) {
      updateStatus(currentURL, id);
    }
  };
};
