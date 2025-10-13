// Side bar
let projectSidebar = document.querySelector(".project-sidebar");

function fillInProjectSideBar(projectsWithoutTodos) {
    // Clear the list except for the allProjects selector
    const allProjects = projectSidebar.firstElementChild;
    projectSidebar.replaceChildren();
    projectSidebar.appendChild(allProjects);

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

export {fillInProjectSideBar}