let pageDialogEle = document.querySelector("#page-dialog"); // This is used in a couple places, so it's being defined generally

// Initialization function
function initializeDom(projectArrayWithoutTodos, projectCount) {
    fillInProjectSideBar(projectArrayWithoutTodos);
    let allProjectsViewObject = createAllProjectsViewObject(projectCount);
    updateProjectInfoElement();
    updateItemList(allProjectsViewObject, projectArrayWithoutTodos);
}

// Side bar
let projectSidebar = document.querySelector(".project-sidebar");

function fillInProjectSideBar(projectsWithoutTodos) {
    projectSidebar.replaceChildren();
    
    // All Projects view special logic
    const allProjects = document.createElement("div");
    allProjects.classList.toggle("project-selector");
    allProjects.id = "project-list-view";
    
    let title = document.createElement("div");
    title.innerText = "All Projects";
    let itemCount = document.createElement("div");
    itemCount.innerText = "Project Count: " + projectsWithoutTodos.length;
    
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

// Project Info
let projectInfoElement = document.querySelector(".project-info");
let projectTitle = document.querySelector(".project-title")
let projectItemCount = document.querySelector(".project-item-count");

function updateProjectInfoElement(projectPOJO) {
    let title;
    let itemCount;
    if (projectPOJO.id === "project-list-view") {
        title = projectPOJO.title;
        itemCount = projectPOJO.itemCount;
        createNewItemButton.innerText = "Create New Project";
        viewProjectDetailsButton.innerText = "View Project Details";
        deleteProjectButton.hidden = true;
        orderItemsByContainer.hidden = true;
    } else {
        title = projectPOJO.title;
        itemCount = projectPOJO.title;
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

let viewProjectDetailsButton = document.querySelector(".view-edit-project-button");

let deleteProjectButton = document.querySelector(".delete-project-button");

let orderItemsByContainer = document.querySelector(".order-items-by-container"); // This is used elsewhere, but I'm grouping it here for consistency
let orderItemsBy = document.querySelector("#orderItemsBy");

// Item list
let itemListElement = document.querySelector(".item-list");

function updateItemList(project, itemList) {
    itemListElement.replaceChildren();

    // All Projects view logic
    if (project.id === "project-list-view") {

        for (const project of itemList) {
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

    // Regular project logic
    for (const item of itemList) {
        let itemContainer = document.createElement("div");
        itemContainer.classList.toggle("item-container");

        // Title
        let titleEle = document.createElement("div");
        titleEle.classList.toggle("item-title");
        titleEle.innerText = item.title;
        itemContainer.appendChild(titleEle);

        // Due data - Prio, due date, is complete
        let dueDataContainer = document.createElement("div");
        dueDataContainer.classList.toggle("item-due-data-container");

        let prioEle = document.createElement("div");
        prioEle.innerText = "Priority: " + item.priority;
        
        let dueDateEle = document.createElement("div");
        let date = new Date(item.dueDate);
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
        let isComplete = item.isComplete;
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
        descEle.innerText = "Description: " + item.description;
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

// "Create form" functions

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
    saveButton.eventListener;

    fieldsetButtons.appendChild(saveButton);
        // Discard changes
    let discardButton = document.createElement("button");
    discardButton.id = "discard-button";
    discardButton.innerText = "Close without creating todo";

    fieldsetButtons.appendChild(discardButton);

    viewEditForm.appendChild(fieldsetButtons);

    return viewEditForm;
}

function createDeleteProjectForm(projectPOJO) {
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
    titleEle.innerText = "Project Title: " + projectPOJO.title;
    projectInfoContainer.appendChild(titleEle);
    let itemCountEle = document.createElement("div");
    itemCountEle.id = "item-count";
    itemCountEle.innerText = "Item Count: " + projectPOJO.itemCount;
    projectInfoContainer.appendChild(itemCountEle);
    form.appendChild(projectInfoContainer);

    // Confirm and cancel buttons
    let buttonContainer = document.createElement("div");

    let confirmButton = document.createElement("button");
    confirmButton.classList.toggle("confirm-button");
    confirmButton.innerText = "Delete Project";
    buttonContainer.appendChild(confirmButton);

    let cancelButton = document.createElement("button");
    cancelButton.classList.toggle("cancel-button");
    cancelButton.innerText = "Cancel Deleting Project";
    buttonContainer.appendChild(cancelButton);
    form.appendChild(buttonContainer);

    return form;
}

function createEditViewProjectForm(projectPOJO) {
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
    titleEle.value = projectPOJO.title;
    projectInfoFieldset.appendChild(titleEle);
    
    let itemCountEle = document.createElement("div");
    itemCountEle.id = "item-count";
    itemCountEle.innerText = "Item Count: " + projectPOJO.itemCount;
    projectInfoFieldset.appendChild(itemCountEle);
    form.appendChild(projectInfoFieldset);

    // Buttons
    let fieldsetButtons = document.createElement("fieldset");
    fieldsetButtons.id = "fieldset-buttons";
        // Save Changes
    let saveButton = document.createElement("button");
    saveButton.id = "save-button";
    saveButton.innerText = "Save changes and close";
    fieldsetButtons.appendChild(saveButton);
        // Discard changes
    let discardButton = document.createElement("button");
    discardButton.id = "discard-button";
    discardButton.innerText = "Close without saving changes";
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
    createButton.classList.toggle("create-button");
    createButton.innerText = "Create Project";
    buttonFieldSet.appendChild(createButton);

    let cancelButton = document.createElement("button");
    cancelButton.classList.toggle("cancel-button");
    cancelButton.innerText = "Cancel";
    buttonFieldSet.appendChild(cancelButton);

    form.appendChild(buttonFieldSet);

    return form;
}

function createAllProjectsViewForm(projectList) {
    let form = document.createElement("form");

    // View all projects
    for (const proj of projectList) {
        let fieldset = document.createElement("fieldset");
        
        let titleEle = document.createElement("div");
        titleEle.classList.toggle("title");
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
    closeButton.classList.toggle("close-button");
    closeButton.innerText = "Close";
    buttonFieldset.appendChild(closeButton);

    form.appendChild(buttonFieldset);

    return form;
}

// Helper functions
function createAllProjectsViewObject(projectCount) {
    return {title: "All Projects", itemCount: projectCount, id: "project-list-view"};
}

// Functions
export {fillInProjectSideBar, initializeDom, updateProjectInfoElement, updateItemList, createEditViewTodoForm, createDeleteProjectForm, createEditViewProjectForm, createNewProjectForm, createAllProjectsViewForm, createAllProjectsViewObject};

// Variables (mostly DOM elements)
export {pageDialogEle, projectSidebar, projectTitle, projectItemCount, createNewItemButton, viewProjectDetailsButton, deleteProjectButton, orderItemsByContainer, orderItemsBy, itemListElement};