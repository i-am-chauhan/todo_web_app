const addList = () => {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const todoLists = document.getElementById("todoLists");
  let list = document.createElement("li");
  const listData = `title=${title.value}&description=${description.value}`
  list.innerText = title.value;
  title.value = '';
  description.value = '';
  todoLists.appendChild(list);
  return listData;
};

const fetchListInfo = function() {
  const listData = addList();
  const req = new Request("/addList", { method: "POST", body: listData });
  fetch(req).then(res => {
    return res.json();
  });
};

window.onload = () => {
  const add = document.getElementById("add");
  add.onclick = fetchListInfo;
};
