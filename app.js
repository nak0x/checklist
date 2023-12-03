/*
Title: App
Descrition: Todo app in native
Todo:

[ ] Tab system
[ ] Multi list
[ ] Todo

Il faut finir la fonction readLocalStorage, pour ca il faut reprende les constructeur de class afin de pouvoir définir chaque valeur à la main.
Le but et de pouvoir réstauré la session de l'utilisateur
*/

// Global app vars

let popups_elements = {
    addtodo: `
    <div id="new_todo_popup" class="popup">
        <input type="text" class="popup_input" placeholder="Todo" id="popupValue">
        <div class="button-container">
            <button class="btn outline" onclick="closePopup()">Close</button>
            <button class="btn" id="popupValidation">Add the todo</button>
        </div>
    </div>`
}

// Users specific vars

let global_tab_list = [];
let global_todolist_list = [];
let global_todo_list = [];

let current_tab_id = 0;

// App elements

const e_tab_list = document.getElementById('tab_list');
const e_tab_view_container = document.getElementById('tab_view');
const e_add_list_btn = document.getElementById('add_list_btn');
const e_add_tab = document.getElementById('add_new_tab');
const e_popup_container = document.getElementById("popups_container");

// Classes
/**
 * Tab in the application
 * @param {String} title The tab name
 */
const Tab = class{
    _title;
    _tab_id;

    _tab_title_element;
    _tab_content_element;

    constructor(title){
        this._title = title;
        this._tab_id = global_tab_list.length;
        // this._content.push(new TodoList("Todo list", this._tab_id));
        this._tab_title_element = `<div class="tab current"><p class="tab-title">${this._title}</p><button class="icobtn tab_close"><i class="fa-solid fa-xmark"></i></button></div>`;
        current_tab_id = this._tab_id;
    }

    constructor(title, tab_id, tab_title_element, tab_content_element){
        this._title = title
        this._tab_id = tab_id
        this._tab_title_element = tab_title_element
        this._tab_content_element = tab_content_element
    }

    get tab_title_element(){
        return this._tab_title_element;
    }
    get tab_content_element(){
        let todolists_elements = "";
        global_todolist_list.forEach(todolist => todolists_elements += todolist.element)
        return todolists_elements;
    }
    get content(){
        return this._content
    }

    addTodoList(title){
        global_todolist_list.push(new TodoList(title, this._tab_id))
    }
}

/**
 * Todolist widget in a tab
 * @param {String} title Todolist title
 * @param {Number} tab_id The related tab id
 */
const TodoList = class {
    _title;
    _list_id;
    _related_tab;
    _unique_id;

    constructor(title, related_tab){
        this._title = title;
        this._list_id = global_todolist_list.length
        // this._todo_list.push(new Todo("To-do"))
        this._related_tab = related_tab
        this._unique_id = genUniqueID()
    }

    constructor(title, list_id, related_tab, unique_id){
        this._title = title
        this._list_id = list_id
        this._related_tab = related_tab
        this._unique_id = unique_id
    }

    get element(){
        let todos_elements = "";

        global_todo_list.forEach(todo => {
            if(todo.list_id == this._list_id){
                todos_elements += todo.element
            }
        })

        return `<div class="list-container"><header class="list-header"><h3 class="list-title">${this._title}</h3><button class="icobtn" onclick="deleteTodoList('${this._unique_id}')"><i class="fa-solid fa-xmark"></i></button></header><form class="todo-container">${todos_elements}</form><div class="add-todo"><button class="textbtn ico" onclick="openAddTodoDialog(${this._list_id})"><i class="fa-solid fa-plus"></i> Add a todo</button></div></div>`;
    }

    openTodoDialog(){
        openPopup("addtodo", "todolist", this._list_id);
    }

    addTodo(title){
        global_todo_list.push(new Todo(title, this._list_id));
    }

    get todo_list(){
        return this._todo_list;
    }

    set todo_list(todo_list){
        this._todo_list = todo_list
    }

    get unique_id(){
        return this._unique_id
    }
}

/**
 * Low level todo
 * @param {String} title The todo
 * @param {Boolean} status Checked or not
 */
const Todo = class{
    _title;
    _status;
    _element;
    _todo_id;
    _todo_list_id;

    constructor(title, todo_list_id ,status=false){
        this._title = title;
        this._status = status;
        this._todo_id = genUniqueID();
        this._todo_list_id = todo_list_id;

        this._element = `<div class="checkbox-wrapper"><input class="inp-cbx" id="${this._todo_id}" type="checkbox" style="display: none;" ${this._status ? "checked": ""}/><label class="cbx" for="${this._todo_id}"><span><svg width="12px" height="9px" viewbox="0 0 12 9"><polyline points="1 5 4 8 11 1"></polyline></svg></span><span>${this._title}</span><div class="icobtn" onclick="removeTodo('${this._todo_id}')"><i class="fa-solid fa-trash-can"></i></div></label></div>`;
    }

    constructor(title, status, element, todo_id, todo_list_id){
        this._title = title
        this._status = status
        this._element = element
        this._todo_id = todo_id
        this._todo_list_id = todo_list_id
    }

    get element(){
        return this._element;
    }

    set element(title){
        this._title = title;
    }

    get id(){
        return this._todo_id;
    }

    get list_id(){
        return this._todo_list_id;
    }
}

// Init
if(localStorage.getItem("tab_list")){
    readLocalStorage();
}else{
    global_tab_list.push(new Tab("New tab"))
    global_todolist_list.push(new TodoList("New ToDo List", 0))
    global_todolist_list.addtodo("My first todo")
}

    // Event listener
    e_popup_container.addEventListener("click", closePopup)
    e_add_list_btn.addEventListener("click", addTodoList)


// Setup
updateApp();

// Functions

function genUniqueID(){
    let max_id = 1000000000;
    let randId = Math.round(Math.random() * Math.round(Math.random() * max_id));
    let sec_randId = Math.round(Math.random() * Math.round(Math.random() * max_id));
    return `id_${randId}_${sec_randId}`; 
}

function addTodoList(){
    global_tab_list[current_tab_id].addTodoList("New list")
    updateApp();
}

function removeTodo(todo_id){
    // debugger
    global_todo_list = global_todo_list.filter(v => v.id != todo_id)
    updateApp()
}

function closePopup(e){this._
function deleteTodoList(id){
    global_todolist_list = global_todolist_list.filter(todolist => {
        console.log(todolist.unique_id, id);
        return todolist.unique_id != id
    })
    updateApp();
}

function openAddTodoDialog(list_id){
    global_todolist_list[list_id].openTodoDialog();
}

function removeItemOnce(arr, index) {
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}

function updateApp(){
    refreshTabView()
    refreshTabBar()
    updateLocalStorage()
}

function readLocalStorage(){
    let tab_list = JSON.parse(localStorage.getItem("tab_list"))
    let todo_list = JSON.parse(localStorage.getItem("todo_list"))
    let todolist_list = JSON.parse(localStorage.getItem("todolist_list"))
    tab_list.forEach((v,i)=>{
        global_tab_list.push(new Tab(tab_list[i]._title))
    })
}

function updateLocalStorage(){
    // To re pick up data : JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem("tab_list", JSON.stringify(global_tab_list))
    localStorage.setItem("todolist_list", JSON.stringify(global_todolist_list))
    localStorage.setItem("todo_list", JSON.stringify(global_todo_list))
    localStorage.setItem("current_tab", JSON.stringify(current_tab_id))
}

function refreshTabView(){
    let tabs_elements = "";
    global_tab_list.forEach(tab => tabs_elements += tab.tab_content_element)
    e_tab_view_container.innerHTML = tabs_elements;
}

function refreshTabBar(){
    let tabs_titles = "";
    global_tab_list.forEach(tab => tabs_titles += tab.tab_title_element)
    e_tab_list.innerHTML = tabs_titles;
}
  