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
        selectedProject = Project.getProjectFromProjectArrayByTitle(projectTitle);
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
        createNewItemButton.innerText = "Create New Project";
        viewProjectDetailsButton.innerText = "View Project Details";
        deleteProjectButton.hidden = true;
        orderItemsByContainer.hidden = true;
    } else {
        title = currentProject.getTitle();
        itemCount = currentProject.getItemCount();
        createNewItemButton.innerText = "Create New Item";
        viewProjectDetailsButton.innerText = "View/Edit Project Details";
        deleteProjectButton.hidden = false;
        orderItemsByContainer.hidden = false;
    }
    projectTitle.innerText = title;
    projectItemCount.innerText = itemCount;
}
    // Event listeners for the info element, in order of left to right on page
let createNewItemButton = document.querySelector(".create-new-item-in-project-button");
createNewItemButton.addEventListener("click", () => {
    let newObjectForm;
    if (currentProject.id === "project-list-view") { // All project view
        newObjectForm = createNewProjectForm();
    } else { // In an actual project
        newObjectForm = createEditViewTodoForm();
    }
    pageDialogEle.replaceChildren(newObjectForm);
    pageDialogEle.showModal();
});

let viewProjectDetailsButton = document.querySelector(".view-edit-project-button");
viewProjectDetailsButton.addEventListener("click", () => {
    let viewProjectDetailsForm;
    if (currentProject.id === "project-list-view") { // All project view
        viewProjectDetailsForm = createAllProjectsViewForm();
    } else { // In an actual project
        viewProjectDetailsForm = createEditViewProjectForm();
    }
    pageDialogEle.replaceChildren(viewProjectDetailsForm);
    pageDialogEle.showModal();

});

let deleteProjectButton = document.querySelector(".delete-project-button");
deleteProjectButton.addEventListener("click", () => {
    let deleteProjectForm = createDeleteProjectForm();
    pageDialogEle.replaceChildren(deleteProjectForm);
    pageDialogEle.showModal();
});

let orderItemsByContainer = document.querySelector(".order-items-by-container"); // This is used elsewhere, but I'm grouping it here for consistency
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
            countEle.innerText = "Item Count: " + project.itemCount;
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
        let date = new Date(item.getDueDate());
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
        viewEditButton.classList.toggle("view-edit-button");
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.classList.toggle("delete-button");

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

            dueDate.valueAsDate = new Date(todo.getDueDate()); // This shift from local time to utc time is corrected when the form is submitted
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
                fillInProjectSideBar(Project.getProjectArrayWithoutTodos());
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
    viewEditForm.classList.toggle("view-edit-todo-form");
    // Info
    let fieldsetInfo = document.createElement("fieldset");
    fieldsetInfo.classList.toggle("fieldset-info");
        // Title
    let titleContainer = document.createElement("div");
    titleContainer.classList.toggle("title-container");
    let titleLabel = document.createElement("label");
    titleLabel.htmlFor = "title";
    titleLabel.innerText = "Title:";
    titleContainer.appendChild(titleLabel);
    let title = document.createElement("input");
    title.id = "title";
    title.required = true;
    title.value = "";
    title.placeholder = "Title of the Todo";
    titleContainer.appendChild(title);
    fieldsetInfo.appendChild(titleContainer);
        // Priority
    let prioContainer = document.createElement("div");
    prioContainer.classList.toggle("prio-container");
    let prioLabel = document.createElement("label");
    prioLabel.htmlFor = "priority";
    prioLabel.innerText = "Priority:";
    prioContainer.appendChild(prioLabel);
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
    prioContainer.appendChild(prio);
    fieldsetInfo.appendChild(prioContainer);
        // Due date
    let dueDateContainer = document.createElement("div");
    dueDateContainer.classList.toggle("due-date-container");
    let dateLabel = document.createElement("label");
    dateLabel.htmlFor = "due-date";
    dateLabel.innerText = "Due Date:";
    dueDateContainer.appendChild(dateLabel);
    let dueDate = document.createElement("input");
    dueDate.id = "due-date";
    dueDate.type = "date";
    dueDate.valueAsDate = new Date();
    dueDate.required = true;
    dueDateContainer.appendChild(dueDate);
    fieldsetInfo.appendChild(dueDateContainer);
        // Is complete
    let isCompleteContainer = document.createElement("div");
    isCompleteContainer.classList.toggle("is-complete-container");
    let isCompleteLabel = document.createElement("label");
    isCompleteLabel.htmlFor = "is-complete";
    isCompleteLabel.innerText = "Is Complete:";
    isCompleteContainer.appendChild(isCompleteLabel);
    let isComplete = document.createElement("input");
    isComplete.id = "is-complete";
    isComplete.type = "checkbox";
    isComplete.value = "false;"
    isCompleteContainer.appendChild(isComplete);
    fieldsetInfo.appendChild(isCompleteContainer);

    viewEditForm.appendChild(fieldsetInfo);
    // Desc and notes
    let fieldsetDescNotes = document.createElement("fieldset");
    fieldsetDescNotes.classList.toggle("fieldset-desc-notes");
        // Labels (Put here for styling purposes)
    let descLabel = document.createElement("label");
    descLabel.htmlFor = "description";
    descLabel.innerText = "Description";
    fieldsetDescNotes.appendChild(descLabel);
    let notesLabel = document.createElement("label");
    notesLabel.htmlFor = "notes";
    notesLabel.innerText = "Notes";
    fieldsetDescNotes.appendChild(notesLabel);
            //  Desc
    let desc = document.createElement("textarea");
    desc.id = "description";
    desc.innerText = ""
    desc.placeholder = "A brief description of this todo";
    fieldsetDescNotes.appendChild(desc);
            // Notes
    let notes = document.createElement("textarea");
    notes.id = "notes";
    notes.innerText = "";
    notes.placeholder = "Notes for this todo such as reminders, clarifications, or whatever else you want to write down.";
    fieldsetDescNotes.appendChild(notes);

    viewEditForm.appendChild(fieldsetDescNotes);
    // Buttons
    let fieldsetButtons = document.createElement("fieldset");
    fieldsetButtons.classList.toggle("fieldset-buttons");
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

function createDeleteProjectForm() {
    let form = document.createElement("form");
    form.classList.toggle("delete-project-form");

    // Message asking message if they want to delete
    let areYouSure = document.createElement("div");
    areYouSure.id = "are-you-sure"
    areYouSure.innerText = "Are you sure you want to delete this project?";
    form.appendChild(areYouSure);

    // Project info
    let projectInfoContainer = document.createElement("div");
    projectInfoContainer.id = "project-info-container";
    let titleEle = document.createElement("div");
    titleEle.id = "title";
    titleEle.innerText = "Project Title: " + currentProject.getTitle();
    projectInfoContainer.appendChild(titleEle);
    let itemCountEle = document.createElement("div");
    itemCountEle.id = "item-count";
    itemCountEle.innerText = "Item Count: " + currentProject.getItemCount();
    projectInfoContainer.appendChild(itemCountEle);
    form.appendChild(projectInfoContainer);

    // Confirm and cancel buttons
    let buttonContainer = document.createElement("div");

    let confirmButton = document.createElement("button");
    confirmButton.innerText = "Delete Project";
    confirmButton.addEventListener("click", (e) => {
        e.preventDefault();
        Project.removeProjectFromProjectArrayByTitle(currentProject.getTitle());

        fillInProjectSideBar(Project.getProjectArrayWithoutTodos());
        updateCurrentProject({title: "All Projects", itemCount: Project.getProjectArrayCount(), id: "project-list-view"});
        updateProjectInfoElement();
        
        pageDialogEle.close();
    });
    buttonContainer.appendChild(confirmButton);

    let cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel Deleting Project";
    cancelButton.addEventListener("click", (e) => {
        e.preventDefault();
        pageDialogEle.close();
    });
    buttonContainer.appendChild(cancelButton);
    form.appendChild(buttonContainer);

    return form;
}

function createEditViewProjectForm() {
    let form = document.createElement("form");
    form.classList.toggle("edit-view-project-form");

    // Project info
    let projectInfoFieldset = document.createElement("fieldset");
    projectInfoFieldset.id = "project-info-container";

    let titleEleLabel = document.createElement("label");
    titleEleLabel.htmlFor = "title";
    titleEleLabel.innerText = "Project Title: ";
    projectInfoFieldset.appendChild(titleEleLabel);
    let titleEle = document.createElement("input");
    titleEle.id = "title";
    titleEle.placeholder = "A title for this project";
    titleEle.value = currentProject.getTitle();
    projectInfoFieldset.appendChild(titleEle);
    
    let itemCountEle = document.createElement("div");
    itemCountEle.id = "item-count";
    itemCountEle.innerText = "Item Count: " + currentProject.getItemCount();
    projectInfoFieldset.appendChild(itemCountEle);
    form.appendChild(projectInfoFieldset);

    // Buttons
    let fieldsetButtons = document.createElement("fieldset");
    fieldsetButtons.id = "fieldset-buttons";
        // Save Changes
    let saveButton = document.createElement("button");
    saveButton.id = "save-button";
    saveButton.innerText = "Save changes and close";
    saveButton.addEventListener("click", (e) => {
        e.preventDefault();
        currentProject.setTitle(titleEle.value);
        fillInProjectSideBar(Project.getProjectArrayWithoutTodos());
        updateProjectInfoElement();
        pageDialogEle.close();
    });
    fieldsetButtons.appendChild(saveButton);
        // Discard changes
    let discardButton = document.createElement("button");
    discardButton.id = "discard-button";
    discardButton.innerText = "Close without saving changes";
    discardButton.addEventListener("click", (e) => {
        e.preventDefault();
        pageDialogEle.close();
    });
    fieldsetButtons.appendChild(discardButton);
    form.appendChild(fieldsetButtons);

    return form;
}

function createNewProjectForm() {
    let form = document.createElement("form");
    form.classList.toggle("new-project-form");

    // Title
    let titleFieldset = document.createElement("fieldset");

    let titleLabelEle = document.createElement("label");
    titleLabelEle.innerText = "Title: ";
    titleLabelEle.htmlFor = "title";
    titleFieldset.appendChild(titleLabelEle);

    let titleEle = document.createElement("input");
    titleEle.id = "title";
    titleEle.placeholder = "Title for this project";
    titleFieldset.appendChild(titleEle);
   
    form.appendChild(titleFieldset);

    // Buttons
    let buttonFieldSet = document.createElement("fieldset");

    let createButton = document.createElement("button");
    createButton.innerText = "Create Project";
    createButton.addEventListener("click", (e) => {
        e.preventDefault();

        // See if a project with the given title already exists
        let projectList = Project.getProjectArrayWithoutTodos();
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
        fillInProjectSideBar(Project.getProjectArrayWithoutTodos());
        updateCurrentProject(thisProj);
        updateProjectInfoElement();
        updateItemList();


        pageDialogEle.close();
    });
    buttonFieldSet.appendChild(createButton);

    let cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener("click", (e) => {
        e.preventDefault();
        pageDialogEle.close();
    });
    buttonFieldSet.appendChild(cancelButton);

    form.appendChild(buttonFieldSet);

    return form;
}

function createAllProjectsViewForm() {
    let form = document.createElement("form");

    // View all projects
    let projectList = Project.getProjectArrayWithoutTodos();
    for (const proj of projectList) {
        let fieldset = document.createElement("fieldset");
        
        let titleEle = document.createElement("div");
        titleEle.innerText = "Title: " + proj.title;
        fieldset.appendChild(titleEle);
        
        let itemCountEle = document.createElement("div");
        itemCountEle.innerText = "Item Count: " + proj.itemCount;
        fieldset.appendChild(itemCountEle);

        form.appendChild(fieldset);
    }

    // Close button
    let buttonFieldset = document.createElement("fieldset");

    let closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", (e) => {
        e.preventDefault;
        pageDialogEle.close();
    });
    buttonFieldset.appendChild(closeButton);

    form.appendChild(buttonFieldset);

    return form;
}

function createTodoFromForm(event, title, description, notes, isComplete, dueDate, priority) {
    event.preventDefault();

    let todo = new Todo(title, description, notes, isComplete, dueDate, priority);
    currentProject.addNewTodoToProject(todo);
    fillInProjectSideBar(Project.getProjectArrayWithoutTodos());
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