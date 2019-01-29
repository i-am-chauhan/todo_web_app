const parseURL = function(url) {
  return (
    "/" +
    url
      .split("/")
      .slice(3)
      .join("/")
  );
};

const addItem = (currentURL, title, description, id) => {
  const todoItems = document.getElementById("todoItems");
  let item = document.createElement("li");
  item.id = id;
  const itemTitle = document.createElement("span");
  const itemDescription = document.createElement("p");
  itemDescription.innerText = description;
  itemTitle.id = `title_${id}`;
  itemTitle.innerText = title;
  todoItems.appendChild(item);
  todoItems.appendChild(itemDescription);
  item.appendChild(itemTitle);
  createAndDrawButton(currentURL, title, id, item);
};

const createAndDrawButton = function(currentURL, title, id, parentElement) {
  const listId = getId(currentURL);
  const edit = createButton("edit", id);
  const del = createButton("delete", id);
  const editItem = document.createElement("a");
  editItem.href = `/item/edit/title=${title}&listId=${listId}&itemId=${id}`;
  const deleteItem = document.createElement("a");
  deleteItem.href = `/item/delete/title=${title}&listId=${listId}&itemId=${id}`;
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
    addItem(url, item.title, item.description, id);
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

const clearForm = function(firstElement, secondElement) {
  firstElement.value = "";
  secondElement.value = "";
};

const getId = url => {
  const titleAndId = url.split("/")[5];
  return titleAndId.split("&")[1].split("=")[1];
};

const addItemAndFetchAllItems = function(currentURL) {
  const id = getId(currentURL);
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const itemData = `title=${title.value}&description=${
    description.value
  }&id=${id}`;
  const req = new Request("/addItem", { method: "POST", body: itemData });
  const todoItems = document.getElementById("todoItems");
  clearForm(title, description);
  todoItems.innerHTML = "";
  fetch(req)
    .then(res => res.json())
    .then(showItems.bind(null, currentURL));
};

window.onload = () => {
  const currentURL = document.location.href;
  fetchAllItems(currentURL);
  const add = document.getElementById("add");
  add.onclick = addItemAndFetchAllItems.bind(null, currentURL);
};
