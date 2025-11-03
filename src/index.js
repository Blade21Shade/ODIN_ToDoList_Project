import {Todo} from "./toDo.js"
import {Project} from "./project.js"
import * as DomManipulation from "./dom.js"
import "./styles.css"

let dateArray = [
    new Date(2000, 0, 10), // 1/10/2000
    new Date(2005, 0, 10), // 2005
    new Date(2010, 0, 10), // 2010

    new Date(2015, 1, 10), // 1/10/15 - For priority testing
    new Date(2015, 1, 10), 
    new Date(2015, 1, 10), 

    new Date(2025, 0, 10), // ./10/.
    new Date(2025, 0, 20), // ./20/.
    new Date(2025, 0, 30), // ./30/.
]

console.log("Create todos and project");
let todo1 = new Todo("Title1", "Desc", "No notes", false, dateArray[0], 3);
let todo2 = new Todo("Title2", "Desc", "No notes", false, dateArray[1], 5);
let todo3 = new Todo("Title3", "Desc", "No notes", false, dateArray[2], 7);
let todo4 = new Todo("Title4", "A longer description", "Lots of notes so I can make sure to handle overflow within the project. Lots of notes so I can make sure to handle overflow within the project. Lots of notes so I can make sure to handle overflow within the project. ", false, dateArray[3], 9);
let todo5 = new Todo("Title5", "Desc", "No notes", false, dateArray[4], 11);
let todo6 = new Todo("Title6", "Desc", "No notes", false, dateArray[5], 1);
let todo7 = new Todo("Title7", "Desc", "No notes", false, dateArray[6], 3);

// let proj1 = new Project("Project 1");
// let proj2 = new Project("Project 2");
// let proj3 = new Project("Project 3");

// proj1.addNewTodoToProject(todo1);
// proj1.addNewTodoToProject(todo2);
// proj1.addNewTodoToProject(todo3);

// proj2.addNewTodoToProject(todo4);
// proj2.addNewTodoToProject(todo5);

// proj3.addNewTodoToProject(todo6);
// proj3.addNewTodoToProject(todo7);

// storeAllObjectsToLocal();
loadAllObjectsFromLocal();

// DOM Manipulation
DomManipulation.initializeDom(Project.getProjectArrayWithoutTodos(), Project.getProjectArrayCount());


let a = 1;

// Persistent Storage

    // All Object functions
function storeAllObjectsToLocal() {
    clearLocalStorage();
    localStorage.setItem("todoKeyStoredList", "[]");
    localStorage.setItem("projectTitleList", "[]");

    let projectTitleList = [];
    let todoKeyStoredList = [];

    let projects = Project.getProjectArrayWithoutTodos();

    // Store each project
    for (let i = 0; i < projects.length; i++) {
        let thisProj = Project.getProjectFromProjectArrayByTitle(projects[i].title);
        let projTitle = thisProj.getTitle();
        
        projectTitleList.push(projTitle);
        setProjectTitleList(projectTitleList);

        updateProjectInLocal(projTitle, projTitle);

        // Store each todo in this project
        let todos = thisProj.getTodosByOrderedList("entryOrder", false);
        for (let j = 0; j < todos.length; j++) {
            let thisKey = createTodoKey(projTitle, todos[j].getTitle());
            todoKeyStoredList.push(thisKey);
            setTodoKeyStoredList(todoKeyStoredList);

            let tempObject = {
                title: "bleh"
            }

            localStorage.setItem(thisKey, JSON.stringify(tempObject));
            updateTodoInLocal(todos[j], todos[j].getTitle(), projTitle);
        }
    }

    /** Speed and memory usage vs duplicate code could be considered in this function
     * Currently the function calls the helper functions many times, which do a lot of localStorage.get/setItem.
     * This is not efficient, so it could be better to just duplicate the logic here and alter it some 
     * because this is meant for all objects.
     * Maintainability is theoretically harder, but speed wise it would theoretically be faster.
    */
}

function loadAllObjectsFromLocal() {
    let projTitleList = getProjectTitleList();

    // Load projects
    for (let i = 0; i < projTitleList.length; i++) {
        // Created projects are stored in project.js, so nothing needs to be done with them
        let proj = new Project(projTitleList[i]);
    }

    // Load todos
    let todoKeyStoredList = getTodoKeyStoredList();
    let currentProject;
    let currentProjectTitle = "";
    for (let i = 0; i < todoKeyStoredList.length; i++) {
        // Create the todo object
        let todoAsObject = JSON.parse(localStorage.getItem(`${todoKeyStoredList[i]}`));
        let title = todoAsObject.title;
        let description = todoAsObject.description;
        let notes = todoAsObject.notes;
        let isComplete = todoAsObject.isComplete;
        let dueDate = todoAsObject.dueDate;
        let priority = todoAsObject.priority;
        let todo = new Todo(title, description, notes, isComplete, dueDate, priority);

        // Add the todo to the project

            // See which project this todo belongs to and if it isn't the current one load the correct one in
        let projectTitleForThisTodo = getProjectTitleForTodoInLocal(todoKeyStoredList[i]);
        if (projectTitleForThisTodo !== currentProjectTitle) {
            currentProject = Project.getProjectFromProjectArrayByTitle(projectTitleForThisTodo);
            currentProjectTitle = projectTitleForThisTodo;
        }

        currentProject.addNewTodoToProject(todo);
    }
}

function clearLocalStorage() {
    let todoKeyStoredList = getTodoKeyStoredList();
    let projectTitleList = getProjectTitleList();

    for (let i = 0; i < todoKeyStoredList.length; i++) {
        localStorage.removeItem(`${todoKeyStoredList[i]}`);
    }

    for (let i = 0; i < projectTitleList.length; i++) {
        localStorage.removeItem(`${projectTitleList[i]}`);
    }

    localStorage.setItem("todoKeyStoredList", "[]");
    localStorage.setItem("projectTitleList", "[]");
}

function storeNewTodoInLocal(todo, projectTitle) {
    let keyToStore = createTodoKey(projectTitle, todo.getTitle());

    let todoKeyStoredList = getTodoKeyStoredList();
    todoKeyStoredList.push(keyToStore);
    
    localStorage.setItem(keyToStore, JSON.stringify(todo));
    setTodoKeyStoredList(todoKeyStoredList);
}

function updateTodoInLocal(todo, oldTodoTitle, projectTitle) {
    let keyToStore = createTodoKey(projectTitle, todo.getTitle());
    let oldKey = createTodoKey(projectTitle, oldTodoTitle);

    // See if the title of the todo changed, if so update todoKeyStoredList
    let oldTodo = JSON.parse(localStorage.getItem(oldKey));
    if (oldTodo.title !== todo.getTitle()) {
        let todoKeyStoredList = getTodoKeyStoredList();

        for (let i = 0; i < todoKeyStoredList.length; i++) {
            if (todoKeyStoredList[i] === oldKey) {
                todoKeyStoredList.splice(i, 1, keyToStore); // This preserves the entry order of todos
                setTodoKeyStoredList(todoKeyStoredList);
                localStorage.removeItem(oldKey);
                break;
            }
        }
    }
    
    // Update localStorage's todo with the new information
    localStorage.setItem(keyToStore, JSON.stringify(todo));
}

/**
 * Deletes a todo from local storage - optionally takes an index position in todoKeyStoredList to delete from for quicker deletion
 * @param {Todo} todo The todo object to delete
 * @param {String} projectTitle The title of the project the todo belongs to
 * @param {number} iPos The index position of the todo's key in todoKeyStoredList
 * @returns 
 */
function deleteTodoFromLocal(todoTitle, projectTitle, iPos = -1) {
    let keyToDelete = createTodoKey(projectTitle, todoTitle);
    localStorage.removeItem(keyToDelete);

    // If the given iPos is valid/correct, delete from todoKeyStoredList
    let todoKeyStoredList = getTodoKeyStoredList();
    if (iPos >= 0 && iPos < todoKeyStoredList.length) {
        if (todoKeyStoredList[iPos] === keyToDelete) {
            todoKeyStoredList.splice(i, 1);
            setTodoKeyStoredList(todoKeyStoredList);
            return;
        }
    }

    // If iPos was invalid/missing, search through the list to delete it
    for (let i = 0; i < todoKeyStoredList.length; i++) {
        if (keyToDelete = todoKeyStoredList[i]) {
            todoKeyStoredList.splice(i, 1);
            setTodoKeyStoredList(todoKeyStoredList);
            break;
        }
    }
}

function storeNewProjectInLocal(projectTitle) {
    let projectTitleList = getProjectTitleList();
    projectTitleList.push(projectTitle);

    localStorage.setItem(projectTitle, JSON.stringify(projectTitle));
    setProjectTitleList(projectTitleList);
}

function updateProjectInLocal(oldProjectTitle, newProjectTitle) {
    // Go through all todos and update their project-title in the key if needed
    // This should preserve the entryOrder of todos since they are stored in entryOrder and will be encountered as such
    
    if (oldProjectTitle !== newProjectTitle) { // When storing all projects the titles will be the same, this is for that situation
        let todoKeyStoredList = getTodoKeyStoredList();
        for (let i = 0; i < todoKeyStoredList.length; i++) {
            let projectTitleForThisKey = getProjectTitleForTodoInLocal(todoKeyStoredList[i]);
            if (projectTitleForThisKey === oldProjectTitle) {
                
                // Get todo
                let todoObject = JSON.parse(localStorage.getItem(`${todoKeyStoredList[i]}`));
                let newKey = createTodoKey(newProjectTitle, todoObject.title);

                // Update todoKeyStoredList
                todoKeyStoredList.splice(i, 1, newKey);

                // Update localStorage
                localStorage.removeItem(`${todoKeyStoredList[i]}`);
                localStorage.setItem(newKey, JSON.stringify(todoObject));
            }
            // Update localStorage's todoKeyStoredList - done here so all todos can process before calling
            setTodoKeyStoredList(todoKeyStoredList);
        }
    }

    // Project stuff
    let projectTitleList = getProjectTitleList();
    for (let i = 0; i < projectTitleList.length; i++) {
        if (projectTitleList[i] === oldProjectTitle) {
            projectTitleList.splice(i, 1, newProjectTitle);
            setProjectTitleList(projectTitleList);
            break;
        }
    }

    localStorage.removeItem(oldProjectTitle);
    localStorage.setItem(newProjectTitle, JSON.stringify(newProjectTitle));
}

function deleteProjectFromLocal(projectTitle) {
    // Go through all todos to delete as needed
    let todoKeyStoredList = getTodoKeyStoredList();
    for (let i = 0; i < todoKeyStoredList.length; i++) {
        let projectTitleForThisKey = getProjectTitleForTodoInLocal(todoKeyStoredList[i]); 
        if (projectTitleForThisKey === projectTitle) {
            let todoObject = JSON.parse(localStorage.getItem(`${todoKeyStoredList[i]}`));
            deleteTodoFromLocal(todoObject.title, projectTitle, i);
        }
    }

    // Project stuff
    let projectTitleList = getProjectTitleList();
    for (let i = 0; i < projectTitleList.length; i++) {
        if (projectTitleList[i] = projectTitle) {
            projectTitleList.splice(i, 1);
            break;
        }
    }

    localStorage.removeItem(projectTitle);
    setProjectTitleList(projectTitleList);
}

function createTodoKey(projectTitle, todoTitle) {
    return projectTitle + "_" + todoTitle; // Key is stored as "Project Title_Todo Title"
}

function getProjectTitleForTodoInLocal(todoStoredKey) {
    return todoStoredKey.split("_")[0]; // Key is stored as "Project Title_Todo Title"
}

function getTodoKeyStoredList() {
    return [...JSON.parse(localStorage.getItem("todoKeyStoredList"))];
}

function setTodoKeyStoredList(list) {
    localStorage.setItem("todoKeyStoredList", JSON.stringify(list));
}

function getProjectTitleList() {
    return [...JSON.parse(localStorage.getItem("projectTitleList"))];
}

function setProjectTitleList(list) {
    localStorage.setItem("projectTitleList", JSON.stringify(list));
}