import {Project} from "./project.js"

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
        dueDateEle.innerText = "Due Date: " + item.getDueDate();
        
        let isComplete = item.getIsComplete();
        let isCompleteEle = document.createElement("input");
        isCompleteEle.type = "checkbox";
        if (isComplete) {
            isCompleteEle.checked = true;
        } else {
            isCompleteEle.checked = false;
        }

        dueDataContainer.append(prioEle, dueDateEle, isCompleteEle);
        itemContainer.appendChild(dueDataContainer);

        // Description
        let descEle = document.createElement("div");
        descEle.classList.toggle("item-description");
        descEle.innerText = item.getDescription();
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
    let title = e.target.parentElement.parentElement.firstElementChild.innerText;
    let todo = currentProject.getTodoByTitle(title);

    if (target.type === "submit") { // button
        pageDialogEle.replaceChildren();
        if (target.innerText == "View/Edit") {
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
            title.value = todo.getTitle();
            fieldsetInfo.appendChild(title);
                // Priority
            let prioLabel = document.createElement("label");
            prioLabel.htmlFor = "priority";
            prioLabel.innerText = "Priority:";
            fieldsetInfo.appendChild(prioLabel);
            let prio = document.createElement("select");
            prio.id = "priority";
            let currentPriority = todo.getPriority();
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
            dueDate.required = true;
            let date = todo.getDueDate();
            
            dueDate.value = todo.getDueDate();
            fieldsetInfo.appendChild(dueDate);
                // Is complete
            let isCompleteLabel = document.createElement("label");
            isCompleteLabel.htmlFor = "is-complete";
            isCompleteLabel.innerText = "Is Complete:";
            fieldsetInfo.appendChild(isCompleteLabel);
            let isComplete = document.createElement("input");
            isComplete.id = "is-complete";
            isComplete.type = "checkbox";
            isComplete.value = todo.getIsComplete();
            if (isComplete.value === "true") {
                isComplete.checked = true;
            }
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
            desc.innerText = todo.getDescription();
            fieldsetDescNotes.appendChild(desc);
                // Notes
            let notesLabel = document.createElement("label");
            notesLabel.htmlFor = "notes";
            notesLabel.innerText = "Notes";
            fieldsetDescNotes.appendChild(notesLabel);
            let notes = document.createElement("textarea");
            notes.id = "notes";
            notes.innerText = todo.getNotes();
            fieldsetDescNotes.appendChild(notes);

            viewEditForm.appendChild(fieldsetDescNotes);
            // Buttons
            let fieldsetButtons = document.createElement("fieldset");;
                // Save changes
            let saveButton = document.createElement("button");
            saveButton.innerText = "Save Changes and Close";
            saveButton.addEventListener("click", (e) => {
                e.preventDefault();

                todo.setTitle(title.value);
                todo.setPriority(Number.parseFloat(prio.value));
                todo.setDueDate(dueDate.value);
                if (isComplete.checked === true) {
                    todo.setIsComplete(true);
                } else {
                    todo.setIsComplete(false);
                }
                todo.setDescription(desc.value);
                todo.setNotes(notes.value);

                updateItemList();
                pageDialogEle.close();
            });
            fieldsetButtons.appendChild(saveButton);
                // Discard changes
            let discardButton = document.createElement("button");
            discardButton.innerText = "Discard Changes and Close";
            discardButton.addEventListener("click", (e) => {
                e.preventDefault();
                pageDialogEle.close();
            });
            fieldsetButtons.appendChild(discardButton);

            viewEditForm.appendChild(fieldsetButtons);
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
        todo.setIsComplete(target.checked);
    }
});

export {fillInProjectSideBar, initializeDom}