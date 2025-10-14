export class Project {
    static #projectArray = []; // Holds all the projects created by the user, DOM manipulation will use this
    static #projectArrayCount = 0;

    static getProjectFromProjectArray(projectTitle) {
        for (let i = 0; i < Project.#projectArray.length; i++) {
            if (projectTitle === Project.#projectArray[i].getTitle()) {
                return Project.#projectArray[i];
            }
        }
        console.log(`Couldn't find project with title ${projectTitleToRemove} when attempting to retrieve a project`);
    }
    
    static removeProjectFromProjectArray(projectTitleToRemove) {
        for (let i = 0; i < Project.#projectArray.length; i++) {
            if (projectTitleToRemove === Project.#projectArray[i].getTitle()) {
                Project.#projectArray.splice(i, 1);
                Project.#projectArrayCount--;
                return;
            }
        }
        console.log(`Couldn't find project with title ${projectTitleToRemove} when attempting to delete a project`);
    }

    static getProjectArray() {
        return Project.#projectArray;
    }

    static getProjectArrayCount() {
        return Project.#projectArrayCount;
    }

    static getProjectArrayWithoutTodos() {
        let toReturn = [];
        for (let i = 0; i < Project.#projectArray.length; i++) {
            let title = Project.#projectArray[i].getTitle();
            let itemCount = Project.#projectArray[i].getItemCount();
            toReturn.push({title, itemCount});
        }
        return toReturn;
    }

    constructor(title) {
        this.title = title;
        Project.#projectArrayCount++;
        Project.#projectArray.push(this);
    }

    #itemCount = 0;

    getItemCount() {
        return this.#itemCount;
    }

    getTitle() {
        return this.title;
    }

    setTitle(title) {
        this.title = title;
    }

    // Item lists hold the items that can go into a project, only Todos for now
    #baseItemList = []; // The base list holds items as they are added to the project and referenced by the orderBy lists
        // The orderBy lists hold the indices of Todos in the baseItemList based on the specified order
    #orderByEntryOrderList = []; // Ordered by entry order of itemList; this is identical to baseItemList, but for consistency is used
    #orderByPriorityList = []; // Ordered by the Priority of Todos, further ordered by date, further ordered by entry order
    #orderByDueDateList = []; // Ordered by the DueDate of Todos, further ordered by Priority, further ordered by entry order

    getTodoByTitle(title) {
        for (const todo of this.#baseItemList) {
            if (todo.getTitle() === title) {
                return todo;
            }
        }
        console.log(`Couldn't find todo with title \"${title}\" in this project.`)
    }

    getTodosByOrderedList(orderedBy, reverseOrder) {
        let list;
        if (orderedBy === "entryOrder") {
            list = this.#orderByEntryOrderList;
        } else if (orderedBy === "priority") {
            list = this.#orderByPriorityList; 
        } else if (orderedBy === "dueDate") {
            list = this.#orderByDueDateList;
        } else {
            console.log("Invalid list type given");
            return;
        }

        let toReturn = [];
        if (!reverseOrder) {
            for (let i = 0; i < list.length; i++) {
                toReturn.push(this.#baseItemList[list[i]]); // list holds an index of baseItemList
            }
        } else {
            for (let i = list.length-1; i > -1; i--) {
                toReturn.push(this.#baseItemList[list[i]]); // list holds an index of baseItemList
            }
        }

        return toReturn;
    }

    addNewTodoToProject(newTodo) {
        // In theory a check for the type of item is needed but since importing Todo seems wrong I'm omitting this
        // In an ideal situation I would write wrappers for the types Project can take and have those handle this logic, but for now we'll just have to pretend
        // if (!newTodo instanceof Todo) { 
        //     console.log(`Incorrect item given to project list: Not adding to project\nExpect: Todo\nGiven: ${typeof newTodo}`);
        //     return;
        // }
        let thisToDoIndex = this.#itemCount;
        this.#itemCount++;
        this.#baseItemList.push(newTodo);

        // Handle orderBy lists
        if (thisToDoIndex === 0) { // First see if anything is in the list, if not then add this toDo without logic checks
            this.#orderByEntryOrderList.push(0);
            this.#orderByPriorityList.push(0);
            this.#orderByDueDateList.push(0);
        } else {
            // Entry order
            this.#orderByEntryOrderList.push(thisToDoIndex);
    
            // If the new todo isn't added to the priority/dueDate list during the loop
            // it needs to be added at the end, this variable is used to track if that needs to be done
            let addedToList = false; 

            // Priority
            let prioList = this.#orderByPriorityList;
            for (let i = 0; i < prioList.length; i++) {
                let todoInList = this.#baseItemList[prioList[i]];
                let prioDiff = this.#getPriorityDifferenceBetweenTodos(todoInList, newTodo);

                if (prioDiff < 0) { // The todo in the list has a lesser priority, add the new todo here
                    prioList.splice(i, 0, thisToDoIndex);
                    addedToList = true;
                    break;
                } else if (prioDiff === 0) { // Same priority, check due date
                    let dateDiff = this.#getDueDateDifferenceBetweenTodos(todoInList, newTodo);
                    if (dateDiff > 0) { // The new todo has a dueDate before the one in the list
                        prioList.splice(i, 0, thisToDoIndex);
                        addedToList = true;
                        break;
                    }
                } // The todo in the list has a greater priority, continue
            }

            // If the todo was never added we need to append it to the end of the array
            if (!addedToList) {
                prioList.push(thisToDoIndex);
            }
            addedToList = false;

            // DueDate
            let dateList = this.#orderByDueDateList;
            for (let i = 0; i < dateList.length; i++) {
                let todoInList = this.#baseItemList[dateList[i]];
                let dateDiff = this.#getDueDateDifferenceBetweenTodos(todoInList, newTodo);
                
                if (dateDiff > 0) { // The new todo has a dueDate before the one in the list
                    dateList.splice(i, 0, thisToDoIndex);
                    addedToList = true;
                    break;
                } else if (dateDiff === 0) { // Same dueDate, check priority
                    let prioDiff = this.#getPriorityDifferenceBetweenTodos(todoInList, newTodo);
                    if (prioDiff < 0) { // The todo in the list has a lesser priority, add the new todo here
                        dateList.splice(i, 0, thisToDoIndex);
                        addedToList = true;
                        break;
                    }
                }
            }

            // If the todo was never added we need to append it to the end of the array
            if (!addedToList) {
                dateList.push(thisToDoIndex);
            }
        }
    }

    deleteTodoFromProject(todoTitle) { // It may be better to use an ID than a title since I don't check to make sure the same title isn't used for multiple todos
        // Find the index for the item in the bast list that needs to be deleted
        let indexToDelete = -1;
        for (let i = 0; i < this.#baseItemList.length; i++) {
            if (todoTitle === this.#baseItemList[i].getTitle()) {
                indexToDelete = i;
                break;
            }
        }

        if (indexToDelete === -1) {
            console.log(`Couldn't find todo \"${todoTitle}\" in project \"${this.title}\" when attempting to delete the todo.`);
            return;
        }

        // In each of the orderBy lists remove the specified index
        // and decrement all index numbers higher than the index to be deleted
        for (let i = 0; i < this.#baseItemList.length; i++) {
            this.#deleteTodoInList("entryOrder", i, indexToDelete);
            this.#deleteTodoInList("priority", i, indexToDelete);
            this.#deleteTodoInList("dueDate", i, indexToDelete);
        }

        // Remove item in the base list (this is done after so the above loop isn't messed up by removing an entry from the base list)
        this.#baseItemList.splice(indexToDelete, 1);
        this.#itemCount--;
    }

    #deleteTodoInList(orderBy, i, indexToDelete) {
        let listToCheck;
        if (orderBy === "entryOrder") {
            listToCheck = this.#orderByEntryOrderList;
        } else if (orderBy === "priority") {
            listToCheck = this.#orderByPriorityList;
        } else if (orderBy = "dueDate") {
            listToCheck = this.#orderByDueDateList;
        } else {
            console.log("Invalid orderBy list name given when deleting a todo");
            return;
        }

        /**
         * If the index to delete was found at an earlier point during the search process then the listToCheck is 1 smaller.
         * However the for loop calling this function doesn't know that, so a manual check is needed to abort the deletion
         * if the index to delete was found before as [i] would go beyond the memory of the array when used.
         */
        if (i ===  listToCheck.length) {
            return;
        }

        let valAtI = listToCheck[i];
        if (valAtI > indexToDelete) {
            listToCheck[i] -= 1;
        } else if (valAtI === indexToDelete) {
            listToCheck.splice(i, 1);
            // If a splice occurred the next i value would skip over the value that was moved down to i, this checks that value
            // Because the last item could've been deleted, this check needs to make sure it doesn't look beyond the array's length
            if (listToCheck.length > i && listToCheck[i] > indexToDelete) {
                listToCheck[i] -= 1;
            }
        }
    }

    // Returns the result of subtracting the first todo's priority from the second
    #getPriorityDifferenceBetweenTodos(todoInProject, newTodo) {
        return todoInProject.getPriority() - newTodo.getPriority();
    }

    #getDueDateDifferenceBetweenTodos(todoInProject, newTodo) {
        return todoInProject.getDueDate().getTime() - newTodo.getDueDate().getTime();
    }
}