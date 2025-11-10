import {Todo} from "./toDo.js"
import {Project} from "./project.js"
import * as DomManipulation from "./dom.js"
import * as LocalStorage from "./localStorage.js"
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

// currentProject is used both in the loading from local storage process and during the logic for DomManipulation
// so I'm defining it above both
let currentProject;

// Load todos and projects before loading DOM
let {todos, projects} = LocalStorage.getAllObjectsFromLocal();
for (let i = 0; i < projects.length; i++) {
    // Projects are stored in project.js upon creation so no logic needed
    new Project(projects[i]);
}

let currentProjectTitle = "";
for (let i = 0; i < todos.length; i++) {
    let todoPOJO = todos[i];
    let projectBelongedTo = todoPOJO.projectBelongedTo;

    if (currentProjectTitle != projectBelongedTo) {
        currentProject = Project.getProjectFromProjectArrayByTitle(projectBelongedTo);
        currentProjectTitle = projectBelongedTo;
    }

    let realTodo = new Todo(todoPOJO.title, todoPOJO.description, todoPOJO.notes, todoPOJO.isComplete, todoPOJO.dueDate, todoPOJO.priority);

    currentProject.addNewTodoToProject(realTodo);
}

// Reset for further logic
currentProject = undefined;

// Event listeners for dom.js
    // Side bar
DomManipulation.projectSidebar.addEventListener("click", (e) => {
    let clickedElement = e.target;
    if (clickedElement.classList.contains("project-sidebar")) { // If the user clicked within the sidebar but not on a project do nothing
        return;
    }
    
    let selector = clickedElement.parentElement;
    let selectedProject;
    let itemList;
    let projectPOJO;

    if (selector.id === "project-list-view") { // The All Project view needs some special functionality to work
        selectedProject = DomManipulation.createAllProjectsViewObject(Project.getProjectArrayCount());
        projectPOJO = selectedProject; // Already an object
        itemList = Project.getProjectArrayWithoutTodos();
    } else {
        let projectTitle = selector.firstElementChild.innerText;
        selectedProject = Project.getProjectFromProjectArrayByTitle(projectTitle);
        projectPOJO = createPOJOFromProject(selectedProject);
        itemList = getTodosAsObjectsByOrderedList(selectedProject);
    }
    currentProject = selectedProject;
    DomManipulation.updateProjectInfoElement(projectPOJO);
    DomManipulation.updateItemList(selectedProject, itemList);
});

    // Project info
    // Order is left to right on page
DomManipulation.createNewItemButton.addEventListener("click", () => {
    let newObjectForm;
    if (currentProject.id === "project-list-view") { // All project view
        newObjectForm = DomManipulation.createNewProjectForm();

        let createButton = newObjectForm.querySelector(".create-button");
        createButton.addEventListener("click", (e) => {
            e.preventDefault();
    
            // See if a project with the given title already exists
            let projectList = Project.getProjectArrayWithoutTodos();
            let titleEle = newObjectForm.querySelector("#title");
            let thisTitle = titleEle.value;
            for (const proj of projectList) {
                if (proj.title === thisTitle) {
                    alert("Project with this title already exists");
                    return;
                }
            }
    
            // Make sure the title isn't blank
            if (thisTitle.length === 0) {
                alert("Project title cannot be blank");
                return;
            }
    
            // Make sure the title isn't "All Projects" to prevent confusion
            if (thisTitle.toLocaleLowerCase() === "all projects") {
                alert('Project Title cannot be "All Projects"');
                return;
            }
    
            // Valid new title - Create project
            let thisProj = new Project(thisTitle);
    
            // Update page and open the new project
            let itemList = getTodosAsObjectsByOrderedList(thisProj);

            DomManipulation.fillInProjectSideBar(Project.getProjectArrayWithoutTodos());
            currentProject = thisProj;
            let projectPOJO = createPOJOFromProject(currentProject);
            DomManipulation.updateProjectInfoElement(projectPOJO);
            DomManipulation.updateItemList(thisProj, itemList);
    
            DomManipulation.pageDialogEle.close();
        });

        let cancelButton = newObjectForm.querySelector(".cancel-button");
        cancelButton.addEventListener("click", (e) => {
            e.preventDefault();
            DomManipulation.pageDialogEle.close();
        });

    } else { // In an actual project
        newObjectForm = DomManipulation.createEditViewTodoForm();
            // Save button
        let saveButton = newObjectForm.querySelector("#save-button");

        function eventHandler(e) {
            let title = newObjectForm.querySelector("#title");
            let desc = newObjectForm.querySelector("#description");
            let notes = newObjectForm.querySelector("#notes");
            let isComplete = newObjectForm.querySelector("#is-complete");
            let dueDate = newObjectForm.querySelector("#due-date");
            let prio = newObjectForm.querySelector("#priority");

            let isCompleteVal = isComplete.checked === true ? true : false;

            createTodoFromForm(e, title.value, desc.value, notes.value, isCompleteVal, dueDate.valueAsDate, Number.parseFloat(prio.value));
        }

        saveButton.eventListener = eventHandler;
        saveButton.addEventListener("click", saveButton.eventListener);

            // Discard button
        let discardButton = newObjectForm.querySelector("#discard-button");
        discardButton.addEventListener("click", (e) => {
            e.preventDefault();
            DomManipulation.pageDialogEle.close();
        });

    }
    DomManipulation.pageDialogEle.replaceChildren(newObjectForm);
    DomManipulation.pageDialogEle.showModal();
});

DomManipulation.viewProjectDetailsButton.addEventListener("click", () => {
    let viewProjectDetailsForm;
    if (currentProject.id === "project-list-view") { // All project view
        viewProjectDetailsForm = DomManipulation.createAllProjectsViewForm(Project.getProjectArrayWithoutTodos());

        let closeButton = viewProjectDetailsForm.querySelector(".close-button");
        closeButton.addEventListener("click", (e) => {
            e.preventDefault();
            DomManipulation.pageDialogEle.close();
        });
    } else { // In an actual project
        viewProjectDetailsForm = DomManipulation.createEditViewProjectForm(createPOJOFromProject(currentProject));

        let saveButton = viewProjectDetailsForm.querySelector("#save-button");
        saveButton.addEventListener("click", (e) => {
            e.preventDefault();

            let titleEle = viewProjectDetailsForm.querySelector("#title");
            currentProject.setTitle(titleEle.value);
            DomManipulation.fillInProjectSideBar(Project.getProjectArrayWithoutTodos());
            let projectPOJO = createPOJOFromProject(currentProject)
            DomManipulation.updateProjectInfoElement(projectPOJO);
            DomManipulation.pageDialogEle.close();
        });

        let discardButton = viewProjectDetailsForm.querySelector("#discard-button");
        discardButton.addEventListener("click", (e) => {
            e.preventDefault();
            DomManipulation.pageDialogEle.close();
        });
    }
    DomManipulation.pageDialogEle.replaceChildren(viewProjectDetailsForm);
    DomManipulation.pageDialogEle.showModal();
});

DomManipulation.deleteProjectButton.addEventListener("click", () => {
    let deleteProjectForm = DomManipulation.createDeleteProjectForm(createPOJOFromProject(currentProject));

    let confirmButton = deleteProjectForm.querySelector(".confirm-button");
    confirmButton.addEventListener("click", (e) => {
        e.preventDefault();
        Project.removeProjectFromProjectArrayByTitle(currentProject.getTitle());

        DomManipulation.fillInProjectSideBar(Project.getProjectArrayWithoutTodos());
        currentProject = DomManipulation.createAllProjectsViewObject(Project.getProjectArrayCount());
        let projectPOJO = currentProject; // For consistency
        DomManipulation.updateProjectInfoElement(projectPOJO);
        
        DomManipulation.pageDialogEle.close();
    });

    let cancelButton = deleteProjectForm.querySelector(".cancel-button");
    cancelButton.addEventListener("click", (e) => {
        e.preventDefault();
        DomManipulation.pageDialogEle.close();
    });

    DomManipulation.pageDialogEle.replaceChildren(deleteProjectForm);
    DomManipulation.pageDialogEle.showModal();
});

DomManipulation.orderItemsBy.addEventListener("change", () => {
    let itemList = getTodosAsObjectsByOrderedList(currentProject);
    DomManipulation.updateItemList(currentProject, itemList);
})

    // Item list element
DomManipulation.itemListElement.addEventListener("click", (e) => {
    let target = e.target;
    if (target.type === "submit") { // button
        let title = e.target.parentElement.parentElement.firstElementChild.innerText;
        let todo = currentProject.getTodoByTitle(title);
        DomManipulation.pageDialogEle.replaceChildren();
        if (target.innerText == "View/Edit") {
            let viewEditForm = DomManipulation.createEditViewTodoForm();

            // Fill the placeholder form values with the ones for this todo
            let title = viewEditForm.querySelector("#title");
            let priority = viewEditForm.querySelector("#priority");
            let dueDate = viewEditForm.querySelector("#due-date");
            let isComplete = viewEditForm.querySelector("#is-complete");
            let description = viewEditForm.querySelector("#description");
            let notes = viewEditForm.querySelector("#notes");

            title.value = todo.getTitle();

            // Find the priority for this todo and pre select it for the form
            let priorityToSelect = todo.getPriority();
            let priorityList = priority.querySelectorAll("option");
            for (const prio of priorityList) {
                if (Number.parseFloat(prio.value) === priorityToSelect) {
                    prio.selected = true;
                } else {
                    prio.selected = false;
                }
            }

            dueDate.valueAsDate = new Date(todo.getDueDate()); // This shift from local time to utc time is corrected when the form is submitted
            isComplete.checked = todo.getIsComplete();

            description.innerText = todo.getDescription();
            notes.innerText = todo.getNotes();

            // Change the button text to make sense for a view/edit context instead of a create context
            let saveButton = viewEditForm.querySelector("#save-button")
            let discardButton = viewEditForm.querySelector("#discard-button");

            saveButton.innerText = "Save Changes and Close";
            discardButton.innerText = "Discard Changes and Close";

            // The save button also needs its event listener updated because this todo already exists
            saveButton.removeEventListener("click", saveButton.eventListener);
            
            function eventHandler(e) {
                // dateAsValue saves the todo's local date as a UTC date, this corrects that value back to a local date for saving the todo
                let dateVal = dueDate.valueAsDate;
                let timezoneOffset = dateVal.getTimezoneOffset();
                dateVal.setMinutes(timezoneOffset);
                
                let isCompleteVal = isComplete.checked === true ? true : false;
                updateTodoFromForm(e, todo, title.value, description.value, notes.value, isCompleteVal, dateVal, Number.parseFloat(priority.value));
            }

            saveButton.eventListener = eventHandler;
            saveButton.addEventListener("click", saveButton.eventListener);

            discardButton.addEventListener("click", (e) => {
                e.preventDefault();
                DomManipulation.pageDialogEle.close();
            });

            // Add to dialog
            DomManipulation.pageDialogEle.appendChild(viewEditForm);
            DomManipulation.pageDialogEle.showModal();
        } else { // Delete button
            let deleteTodoEle = document.createElement("div");
            deleteTodoEle.classList.toggle("delete-todo-dialog");
            
            let areYouSure = document.createElement("div");
            areYouSure.innerText = "Are you sure you want to delete this todo?"
            deleteTodoEle.appendChild(areYouSure);
            
            // Buttons
            let buttonContainer = document.createElement("div");
                // Delete
            let deleteButton = document.createElement("button");
            deleteButton.innerText = "Yes";
            deleteButton.addEventListener("click", () => {
                currentProject.deleteTodoFromProject(title);
                let itemList = getTodosAsObjectsByOrderedList(currentProject);
                DomManipulation.updateItemList(currentProject, itemList);
                let projectPOJO = createPOJOFromProject(currentProject);
                DomManipulation.updateProjectInfoElement(projectPOJO);
                DomManipulation.fillInProjectSideBar(Project.getProjectArrayWithoutTodos());
                DomManipulation.pageDialogEle.close();
            });
                // Cancel delete
            let cancelButton = document.createElement("button");
            cancelButton.innerText = "Cancel";
            cancelButton.addEventListener("click", () => {
                DomManipulation.pageDialogEle.close();
            });
            buttonContainer.append(deleteButton, cancelButton);
            deleteTodoEle.appendChild(buttonContainer);

            // Add to dialog
            DomManipulation.pageDialogEle.appendChild(deleteTodoEle);
            DomManipulation.pageDialogEle.showModal();
        }
    } else if (target.type === "checkbox") { // "Is Complete" checkbox
        let title = e.target.parentElement.parentElement.parentElement.firstElementChild.innerText;
        let todo = currentProject.getTodoByTitle(title);
        todo.setIsComplete(target.checked);
    }
});

// EventHandler functions

function createTodoFromForm(event, title, description, notes, isComplete, dueDate, priority) {
    event.preventDefault();

    let todo = new Todo(title, description, notes, isComplete, dueDate, priority);
    currentProject.addNewTodoToProject(todo);
    DomManipulation.fillInProjectSideBar(Project.getProjectArrayWithoutTodos());
    let itemList = getTodosAsObjectsByOrderedList(currentProject);
    DomManipulation.updateItemList(currentProject, itemList);
    DomManipulation.pageDialogEle.close();
}

function updateTodoFromForm(event, todo, title, description, notes, isComplete, dueDate, priority) {
    event.preventDefault();

    todo.setTitle(title);
    todo.setDescription(description);
    todo.setNotes(notes);
    todo.setIsComplete(isComplete);
    todo.setDueDate(dueDate);
    todo.setPriority(priority);

    let itemList = getTodosAsObjectsByOrderedList(currentProject);
    DomManipulation.updateItemList(currentProject, itemList);
    DomManipulation.pageDialogEle.close();
}

// Helper functions

// Gets todos as objects so dom.js doesn't have to import todo.js and can just reference object properties
function getTodosAsObjectsByOrderedList(project) {
    // Get Todo objects
    let itemList;
    let orderBy = orderItemsBy.value;
    switch(orderBy) {
        case "entryOrder":
        case "priority":
        case "dueDate":
            itemList = project.getTodosByOrderedList(orderBy, false);
            break;
        case "entryOrderReverse":
            itemList = project.getTodosByOrderedList("entryOrder", true);
            break;
        case "priorityReverse":
            itemList = project.getTodosByOrderedList("priority", true);
            break;
        case "dueDateReverse":
            itemList = project.getTodosByOrderedList("dueDate", true);
            break;
    }

    // Turn todos into objects
    let objectList = [];
    for (const item of itemList) {
        let object = {};
        object.title = item.getTitle();
        object.description = item.getDescription();
        object.notes = item.getNotes();
        object.dueDate = item.getDueDate();
        object.priority = item.getPriority();
        object.isComplete = item.getIsComplete();
        objectList.push(object);
    }

    return objectList;
}

function createPOJOFromProject(project) {
    return {
        title: project.getTitle(),
        itemCount: project.getItemCount()
    }
}

// DOM initial call
DomManipulation.initializeDom(Project.getProjectArrayWithoutTodos(), Project.getProjectArrayCount());