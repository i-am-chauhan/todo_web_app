const parseURL = function(url) {
  return (
    "/" +
    url
      .split("/")
      .slice(3)
      .join("/")
  );
};

const setHref = function(action, listid, itemId) {
  return `/item/${action}?listId=${listid}&itemId=${itemId}`;
};

const createButton = function(
  action,
  className,
  listId,
  itemId,
  parentElement
) {
  let button = document.createElement("button");
  button.id = `${action}_${itemId}`;
  button.innerText = action;
  button.className = className;
  const anchor = document.createElement("a");
  anchor.href = setHref(action, listId, itemId);
  parentElement.appendChild(anchor);
  anchor.appendChild(button);
};

const createAndDrawButton = function(currentURL, itemId, parentElement) {
  const listId = getId(currentURL);
  createButton("edit", "editButton", listId, itemId, parentElement);
  createButton("delete", "deleteButton", listId, itemId, parentElement);
};

const addItem = (currentURL, description, status, id) => {
  const statusBox = { done: "&#9745", undone: "&#9744" };
  const todoItems = document.getElementById("todoItems");
  let item = document.createElement("div");
  item.className = "listTitle";
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
  const titleAndId = url.split("?")[1];
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
