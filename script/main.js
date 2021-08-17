//------ LIST CONTAINER ------ LEFT SIDE

const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists' // prevents from ovewritting other localstorage
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)



// ------TASK CONTAINER ------ RIGHT SIDE

const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')

const tasksContainer = document.querySelector('[data-tasks]')

const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')

const clearCompleteTasksBtn = document.querySelector('[clear-completed-tasks-btn]')




// ------ FUNCTIONS ------


//ADD A NEW LIST
newListForm.addEventListener('submit', e => {
    e.preventDefault()

    //give new list name
    const listName = newListInput.value
    if (listName == null || listName === '') return

    const list = createList(listName) // create separate function for a new list
    newListInput.value = null
    lists.push(list)
    saveAndRender()
}) 

function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [ ] }
}


//ADD NEW TASK
newTaskForm.addEventListener('submit', e => {
    e.preventDefault()

    //give new task name
    const taskName = newTaskInput.value
    if (taskName == null || taskName === '') return

    const task = createTask(taskName) // create separate function for a new list
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false }
    //set to false because by default task is incomplete
}


//SAVE THE NEW LIST
function saveAndRender() {
    save()
    render()
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}


// ADDING SELECTED LIST ID ---- HIGHLIGHTED
listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
    }
})

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})




// CLEAR COMPLETED TASKS
clearCompleteTasksBtn.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})

// DELETE SELECTED LIST
deleteListButton.addEventListener('click', e => {
    //new lists that contains all lists except for selected list
    lists = lists.filter(list => list.id !== selectedListId)

    selectedListId = null
    saveAndRender()
})

function render(){
    clearElement(listsContainer) //clear list container
    renderLists()

    const selectedList = lists.find(list => list.id === selectedListId)
    if (selectedListId == null) {
        listDisplayContainer.style.display = 'none'
    } else {
        listDisplayContainer.style.display = ''
        listTitleElement.innerText = selectedList.name // update list title
        renderTaskCount(selectedList) // specify the list for the task-count
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        // true is obigatory , without -> only ul will be showed, but no inside content

        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete

        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}

function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => 
    !task.complete).length
    //convert it to a string
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}


function renderLists() {
 
    lists.forEach(list => {
        //create list element
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("item")
        listElement.innerText = list.name
        if (list.id === selectedListId) {
            listElement.classList.add('active-list')
        }

        //append the element to our list container
        listsContainer.appendChild(listElement)
    })
}

// removing an already given list
function clearElement(element) {
    //check if element has a first child
        while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render();


