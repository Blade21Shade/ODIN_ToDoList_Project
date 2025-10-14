import {Project} from "./project.js"

// Initialization function
function initializeDom(projectArrayWithoutTodos, projectCount) {
    fillInProjectSideBar(projectArrayWithoutTodos);
    updateCurrentProject({title: "All Projects", itemCount: projectCount, id: "project-list-view"});
    updateProjectInfoElement();
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

export {fillInProjectSideBar, initializeDom}