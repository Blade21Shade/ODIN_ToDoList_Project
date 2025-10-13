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

export {fillInProjectSideBar, initializeDom}