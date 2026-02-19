function storeAllObjectsToLocal(projectList, todoList) {
    clearLocalStorage();
    localStorage.setItem("todoKeyStoredList", "[]");
    localStorage.setItem("projectTitleList", "[]");

    let projectTitleList = [];
    let todoKeyStoredList = [];

    // Store each project
    for (let i = 0; i < projectList.length; i++) {
        let thisProj = projectList[i];
        let projTitle = thisProj.title;
        
        projectTitleList.push(projTitle);
        setProjectTitleList(projectTitleList);

        // This will overwrite existing projects instead of making new ones
        updateProjectInLocal(projTitle, projTitle);

        // Store each todo in this project
        for (let j = 0; j < todoList.length; j++) {
            let thisKey = createTodoKey(projTitle, todoList[j].title);
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

function getAllObjectsFromLocal() {
    let toReturn = {
        projects: [],
        todos: []
    }

    // Get projects
    let projTitleList = getProjectTitleList();
    toReturn.projects = projTitleList;

    // Get todos
    let todoKeyStoredList = getTodoKeyStoredList();
    for (let i = 0; i < todoKeyStoredList.length; i++) {
        // Create the todo object
        let todoAsObject = JSON.parse(localStorage.getItem(todoKeyStoredList[i]));
        // Return the project this belongs to so todos can be assigned correctly
        todoAsObject.projectBelongedTo = getProjectTitleForTodoInLocal(todoKeyStoredList[i]);
        toReturn.todos.push(todoAsObject);
    }

    return toReturn;
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

function storeNewTodoInLocal(todoPOJO, projectTitle) {
    let keyToStore = createTodoKey(projectTitle, todoPOJO.title);

    let todoKeyStoredList = getTodoKeyStoredList();
    todoKeyStoredList.push(keyToStore);
    
    localStorage.setItem(keyToStore, JSON.stringify(todoPOJO));
    setTodoKeyStoredList(todoKeyStoredList);
}

function updateTodoInLocal(todoPOJO, oldTodoTitle, projectTitle) {
    let keyToStore = createTodoKey(projectTitle, todoPOJO.title);
    let oldKey = createTodoKey(projectTitle, oldTodoTitle);

    // See if the title of the todo changed, if so update todoKeyStoredList
    let oldTodo = JSON.parse(localStorage.getItem(oldKey));
    if (oldTodo.title !== todoPOJO.title) {
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
    localStorage.setItem(keyToStore, JSON.stringify(todoPOJO));
}

/**
 * Deletes a todo from local storage - optionally takes the index position of this todo's key in todoKeyStoredList for quicker deletion
 * @param {String} todoTitle The title of the todo to delete
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
        if (keyToDelete === todoKeyStoredList[i]) {
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
    
    if (oldProjectTitle !== newProjectTitle) { // When storeAllObjectsToLocal calls this function the old and new titles are the same, so skip todos
        let todoKeyStoredList = getTodoKeyStoredList();
        for (let i = 0; i < todoKeyStoredList.length; i++) {
            let projectTitleForThisKey = getProjectTitleForTodoInLocal(todoKeyStoredList[i]);
            if (projectTitleForThisKey === oldProjectTitle) {
                
                // Get todo
                let todoObject = JSON.parse(localStorage.getItem(todoKeyStoredList[i]));
                let newKey = createTodoKey(newProjectTitle, todoObject.title);

                // Update todoKeyStoredList
                todoKeyStoredList.splice(i, 1, newKey);

                // Update localStorage
                localStorage.removeItem(todoKeyStoredList[i]);
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
        if (projectTitleList[i] === projectTitle) {
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
    let temp = [];
    try {
        temp = [...JSON.parse(localStorage.getItem("todoKeyStoredList"))];
    } catch {
        // Nothing needs to happen
    }
    return temp;
}

function setTodoKeyStoredList(list) {
    localStorage.setItem("todoKeyStoredList", JSON.stringify(list));
}

function getProjectTitleList() {
    let temp = [];
    try {
        temp = [...JSON.parse(localStorage.getItem("projectTitleList"))];
    } catch {
        // Nothing needs to happen
    }
    return temp;
}

function setProjectTitleList(list) {
    localStorage.setItem("projectTitleList", JSON.stringify(list));
}

export {storeAllObjectsToLocal, getAllObjectsFromLocal, storeNewTodoInLocal, updateTodoInLocal, deleteTodoFromLocal, storeNewProjectInLocal, updateProjectInLocal, deleteProjectFromLocal}