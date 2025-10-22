import {Project} from "./project.js"
import {Todo} from "./toDo.js"

let pageDialogEle = document.querySelector("#page-dialog"); // This is used in a couple places, so it's being defined generally

// Initialization function
function initializeDom(projectArrayWithoutTodos, projectCount) {
    fillInProjectSideBar(projectArrayWithoutTodos);
    updateCurrentProject({title: "All Projects", itemCount: projectCount, id: "project-list-view"});
    updateProjectInfoElement();
    updateItemList();
}

// Side bar
let projectSidebar = document.querySelector(".project-sidebar");

projectSidebar.addEventListener("click", (e) => {
    let clickedElement = e.target;
    if (clickedElement.classList.contains("project-sidebar")) { // If the user clicked within the sidebar but not on a project do nothing
        return;
    }
    
    let selector = clickedElement.parentElement;
    let selectedProject;

    if (selector.id === "project-list-view") { // The All Project view needs some special functionality to work
        selectedProject = {title: "All Projects", itemCount: Project.getProjectArrayCount(), id: "project-list-view"};
    } else {
        let projectTitle = selector.firstElementChild.innerText;
        selectedProject = Project.getProjectFromProjectArray(projectTitle);
    }
    updateCurrentProject(selectedProject);
    updateProjectInfoElement();
    updateItemList();
});

function fillInProjectSideBar(projectsWithoutTodos) {
    projectSidebar.replaceChildren();
    
    // All Project selector special logic
    const allProjects = document.createElement("div");
    allProjects.classList.toggle("project-selector");
    allProjects.id = "project-list-view";
    
    let title = document.createElement("div");
    title.innerText = "All Projects";
    let itemCount = document.createElement("div");
    itemCount.innerText = "Project Count: " + Project.getProjectArrayCount();
    
    allProjects.appendChild(title);
    allProjects.appendChild(itemCount);
    projectSidebar.appendChild(allProjects);

    // Regular project logic
    for (const project of projectsWithoutTodos) {
        let selector = document.createElement("div");
        selector.classList.toggle("project-selector");
        
        let title = document.createElement("div");
        title.innerText = project.title;
        let itemCount = document.createElement("div");
        itemCount.innerText = "Item Count: " + project.itemCount;

        selector.appendChild(title);
        selector.appendChild(itemCount);
        projectSidebar.appendChild(selector);
    }
}

// Project Display Area
let currentProject;

function updateCurrentProject(thisProject) {
    currentProject = thisProject;
}

// Project Info
let projectInfoElement = document.querySelector(".project-info");
let projectTitle = document.querySelector(".project-title")
let projectItemCount = document.querySelector(".project-item-count");

function updateProjectInfoElement() {
    let title;
    let itemCount;
    if (currentProject.id === "project-list-view") {
        title = currentProject.title;
        itemCount = currentProject.itemCount;
    } else {
        title = currentProject.getTitle();
        itemCount = currentProject.getItemCount();
    }
    projectTitle.innerText = title;
    projectItemCount.innerText = itemCount;
}

let createNewItemButton = document.querySelector(".create-new-item-in-project-button");
createNewItemButton.addEventListener("click", () => {
    let newTodoForm = createEditViewTodoForm();
    pageDialogEle.replaceChildren(newTodoForm);
    pageDialogEle.showModal();
});

let orderItemsBy = document.querySelector("#orderItemsBy");
orderItemsBy.addEventListener("change", () => {
    updateItemList();
})

// Item list
let itemListElement = document.querySelector(".item-list");

function updateItemList() {
    itemListElement.replaceChildren();

    let itemList;
    let orderBy = orderItemsBy.value;

    if (currentProject.id === "project-list-view") { // View all projects
        let projects = Project.getProjectArrayWithoutTodos();

        for (const project of projects) {
            let itemContainer = document.createElement("div");
            itemContainer.classList.toggle("item-project-container");

            // Title
            let titleEle = document.createElement("div");
            titleEle.classList.toggle("item-project-title")
            titleEle.innerText = project.title;
            itemContainer.appendChild(titleEle);

            // Item Count
            let countEle = document.createElement("div");
            countEle.classList.toggle("item-project-count")
            countEle.innerText = project.itemCount;
            itemContainer.appendChild(countEle);

            // Add to item list
            itemListElement.appendChild(itemContainer);
        }

        return; // Don't do regular item logic
    }

    switch(orderBy) {
        case "entryOrder":
        case "priority":
        case "dueDate":
            itemList = currentProject.getTodosByOrderedList(orderBy, false);
            break;
        case "entryOrderReverse":
            itemList = currentProject.getTodosByOrderedList("entryOrder", true);
            break;
        case "priorityReverse":
            itemList = currentProject.getTodosByOrderedList("priority", true);
            break;
        case "dueDateReverse":
            itemList = currentProject.getTodosByOrderedList("dueDate", true);
            break;
    }

    for (const item of itemList) {
        let itemContainer = document.createElement("div");
        itemContainer.classList.toggle("item-container");

        // Title
        let titleEle = document.createElement("div");
        titleEle.classList.toggle("item-title")
        titleEle.innerText = item.getTitle();
        itemContainer.appendChild(titleEle);

        // Due data - Prio, due date, is complete
        let dueDataContainer = document.createElement("div");
        dueDataContainer.classList.toggle("item-due-data-container");

        let prioEle = document.createElement("div");
        prioEle.innerText = "Priority: " + item.getPriority();
        
        let dueDateEle = document.createElement("div");
        let date = item.getDueDate();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let dayOfWeek = date.getDay();
        let dayOfWeekText;
        switch (dayOfWeek) {
            case 0:
                dayOfWeekText = "Sunday";
                break;
            case 1:
                dayOfWeekText = "Monday";
                break;
            case 2:
                dayOfWeekText = "Tuesday";
                break;
            case 3:
                dayOfWeekText = "Wednesday";
                break;
            case 4:
                dayOfWeekText = "Thursday";
                break;
            case 5:
                dayOfWeekText = "Friday";
                break;
            case 6:
                dayOfWeekText = "Saturday";
                break;
        }
        
        dueDateEle.innerText = `Due Date: ${dayOfWeekText} ${month+1}/${day}/${year}`;
        
        let isCompleteContainer = document.createElement("div");
        isCompleteContainer.classList.toggle("item-is-complete-container");
        let isCompleteText = document.createElement("div");
        isCompleteText = "Is Complete "
        let isComplete = item.getIsComplete();
        let isCompleteEle = document.createElement("input");
        isCompleteEle.type = "checkbox";
        if (isComplete) {
            isCompleteEle.checked = true;
        } else {
            isCompleteEle.checked = false;
        }
        isCompleteContainer.append(isCompleteText, isCompleteEle);

        dueDataContainer.append(prioEle, dueDateEle, isCompleteContainer);
        itemContainer.appendChild(dueDataContainer);

        // Description
        let descEle = document.createElement("div");
        descEle.classList.toggle("item-description");
        descEle.innerText = "Description: " + item.getDescription();
        itemContainer.appendChild(descEle);

        // Buttons
        let btnContainer = document.createElement("div");
        btnContainer.classList.toggle("button-container");
        
        let viewEditButton = document.createElement("button");
        viewEditButton.innerText = "View/Edit";
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";

        btnContainer.append(viewEditButton, deleteButton);
        itemContainer.appendChild(btnContainer);

        // Add this item to the item-list
        itemListElement.appendChild(itemContainer);
    }
}

itemListElement.addEventListener("click", (e) => {
    let target = e.target;
    if (target.type === "submit") { // button
        let title = e.target.parentElement.parentElement.firstElementChild.innerText;
        let todo = currentProject.getTodoByTitle(title);
        pageDialogEle.replaceChildren();
        if (target.innerText == "View/Edit") {
            let viewEditForm = createEditViewTodoForm();

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

            dueDate.valueAsDate = todo.getDueDate(); // This shift from local time to utc time is corrected when the form is submitted
            isComplete.checked = todo.getIsComplete();

            description.innerText = todo.getDescription();
            notes.innerText = todo.getNotes();

            // Change the button text to make sense for a view/edit context instead of a create context
            let saveButton = viewEditForm.querySelector("#save-button")
            let discardBUtton = viewEditForm.querySelector("#discard-button");

            saveButton.innerText = "Save Changes and Close";
            discardBUtton.innerText = "Discard Changes and Close";

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
            // Add to dialog
            pageDialogEle.appendChild(viewEditForm);
            pageDialogEle.showModal();
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
                updateItemList();
                updateProjectInfoElement();
                pageDialogEle.close();
            });
                // Cancel delete
            let cancelButton = document.createElement("button");
            cancelButton.innerText = "Cancel";
            cancelButton.addEventListener("click", () => {
                pageDialogEle.close();
            });
            buttonContainer.append(deleteButton, cancelButton);
            deleteTodoEle.appendChild(buttonContainer);

            // Add to dialog
            pageDialogEle.appendChild(deleteTodoEle);
            pageDialogEle.showModal();
        }
    } else if (target.type === "checkbox") { // "Is Complete" checkbox
        let title = e.target.parentElement.parentElement.parentElement.firstElementChild.innerText;
    let todo = currentProject.getTodoByTitle(title);
        todo.setIsComplete(target.checked);
    }
});

// Helper functions

function createEditViewTodoForm() {
    let viewEditForm = document.createElement("form");
    viewEditForm.classList.toggle("view-edit-form");
    // Info
    let fieldsetInfo = document.createElement("fieldset");
        // Title
    let titleLabel = document.createElement("label");
    titleLabel.htmlFor = "title";
    titleLabel.innerText = "Title:";
    fieldsetInfo.appendChild(titleLabel);
    let title = document.createElement("input");
    title.id = "title";
    title.required = true;
    title.value = "";
    title.placeholder = "Title of the Todo";
    fieldsetInfo.appendChild(title);
        // Priority
    let prioLabel = document.createElement("label");
    prioLabel.htmlFor = "priority";
    prioLabel.innerText = "Priority:";
    fieldsetInfo.appendChild(prioLabel);
    let prio = document.createElement("select");
    prio.id = "priority";
    let currentPriority = 1;
    for (let i = 1; i < 11;i++) {
        let priorityOption = document.createElement("option");
        priorityOption.value = i;
        priorityOption.innerText = `${i}`;
        if (i === currentPriority) {
            priorityOption.selected = true;
        }
        prio.appendChild(priorityOption);
    }
    prio.required = true;
    fieldsetInfo.appendChild(prio);
        // Due date
    let dateLabel = document.createElement("label");
    dateLabel.htmlFor = "due-date";
    dateLabel.innerText = "Due Date:";
    fieldsetInfo.appendChild(dateLabel);
    let dueDate = document.createElement("input");
    dueDate.id = "due-date";
    dueDate.type = "date";
    dueDate.valueAsDate = new Date();
    dueDate.required = true;
    fieldsetInfo.appendChild(dueDate);
        // Is complete
    let isCompleteLabel = document.createElement("label");
    isCompleteLabel.htmlFor = "is-complete";
    isCompleteLabel.innerText = "Is Complete:";
    fieldsetInfo.appendChild(isCompleteLabel);
    let isComplete = document.createElement("input");
    isComplete.id = "is-complete";
    isComplete.type = "checkbox";
    isComplete.value = "false;"
    fieldsetInfo.appendChild(isComplete);

    viewEditForm.appendChild(fieldsetInfo);
    // Desc and notes
    let fieldsetDescNotes = document.createElement("fieldset");;
        // Desc
    let descLabel = document.createElement("label");
    descLabel.htmlFor = "description";
    descLabel.innerText = "Description";
    fieldsetDescNotes.appendChild(descLabel);
    let desc = document.createElement("textarea");
    desc.id = "description";
    desc.innerText = ""
    desc.placeholder = "A brief description of this todo";
    fieldsetDescNotes.appendChild(desc);
        // Notes
    let notesLabel = document.createElement("label");
    notesLabel.htmlFor = "notes";
    notesLabel.innerText = "Notes";
    fieldsetDescNotes.appendChild(notesLabel);
    let notes = document.createElement("textarea");
    notes.id = "notes";
    notes.innerText = "";
    notes.placeholder = "Notes for this todo such as reminders, clarifications, or whatever else you want to write down.";
    fieldsetDescNotes.appendChild(notes);

    viewEditForm.appendChild(fieldsetDescNotes);
    // Buttons
    let fieldsetButtons = document.createElement("fieldset");;
        // Save changes
    let saveButton = document.createElement("button");
    saveButton.id = "save-button";
    saveButton.innerText = "Create todo";
    let isCompleteVal = isComplete.checked === true ? true : false;

    function eventHandler(e) {
        createTodoFromForm(e, title.value, desc.value, notes.value, isCompleteVal, dueDate.valueAsDate, Number.parseFloat(prio.value));
    }

    saveButton.eventListener = eventHandler;
    saveButton.addEventListener("click", saveButton.eventListener);

    fieldsetButtons.appendChild(saveButton);
        // Discard changes
    let discardButton = document.createElement("button");
    discardButton.id = "discard-button";
    discardButton.innerText = "Close without creating todo";
    discardButton.addEventListener("click", (e) => {
        e.preventDefault();
        pageDialogEle.close();
    });
    fieldsetButtons.appendChild(discardButton);

    viewEditForm.appendChild(fieldsetButtons);

    return viewEditForm;
}

function createTodoFromForm(event, title, description, notes, isComplete, dueDate, priority) {
    event.preventDefault();

    let todo = new Todo(title, description, notes, isComplete, dueDate, priority);
    currentProject.addNewTodoToProject(todo);
    updateItemList();
    pageDialogEle.close();
}

function updateTodoFromForm(event, todo, title, description, notes, isComplete, dueDate, priority) {
    event.preventDefault();

    todo.setTitle(title);
    todo.setDescription(description);
    todo.setNotes(notes);
    todo.setIsComplete(isComplete);
    todo.setDueDate(dueDate);
    todo.setPriority(priority);

    updateItemList();
    pageDialogEle.close();
}

export {fillInProjectSideBar, initializeDom}