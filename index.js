// UL for lists
const listsContainer = document.querySelector('[data-lists]');
// lists elements
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListBtn = document.querySelector("[data-delete-list-btn]");

// tasks elements
const listDisplayContainer  = document.querySelector("[data-list-display-container]");
const listTitleElement = document.querySelector("[data-list-title]");
const listCountElement = document.querySelector("[data-list-count]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");

const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const clearCompleteTasksBtn = document.querySelector("[data-clear-complete-tasks-btn]");


// localStorage keys
const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
// localStorage data
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

// lists functionality

// click event listener on each li in lists ul
listsContainer.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === "li") {
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    }
})

// delete list button
deleteListBtn.addEventListener("click", (e) => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null;
    saveAndRender();
})


// create named list and push to lists array
newListForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == null || listName === '') return;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
})


//  create new list name object
function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: []}
}

// save lists ul and current active list to localStorage 
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

// render list of lists
function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement("li");
        listElement.dataset.listId = list.id;
        listElement.classList.add("list");
        listElement.innerText = list.name;
        if(list.id === selectedListId) {
            listElement.classList.add("active");
        }
        listsContainer.appendChild(listElement);
    })
}



// tasks functionality

// click event listener on each task item - mark complete/incomplete
tasksContainer.addEventListener("click", (e) => {
    if(e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        save();
        renderTaskCount(selectedList);
    }
})


// delete any tasks marked completed
clearCompleteTasksBtn.addEventListener("click", (e) => {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();
})

// create task object and push to active list's task array
newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskName = newTaskInput.value;
    if (taskName == null || taskName === '') return;
    const task = createTask(taskName);
    newTaskInput.value = null;
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(task);
    saveAndRender();
})

// create new task object
function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false}
}

// render tasks using HTML template
function renderTasks(selectedList)  {
    selectedList.tasks.forEach(task =>  {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector('input');
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.name);
        tasksContainer.appendChild(taskElement);
    })
}

// determine remaining tasks and display count
function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}


// general functionality

// render list of lists, display tasks of selected list
function render() {
    clearElement(listsContainer);
    renderLists();

    const selectedList = lists.find(list => list.id === selectedListId);
    if (selectedList === undefined || selectedListId === null || lists.length == 0)  {
        listDisplayContainer.style.display = "none";
    } else {
        listDisplayContainer.style.display = "";
        listTitleElement.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }  
    
}

// clear previous render when changes made
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function saveAndRender() {
    save();
    render();
}

render()