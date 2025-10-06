export class Project {
    static projectArray = []; // Holds all the projects created by the user, DOM manipulation will use this

    constructor(title) {
        this.title = title;
        projectArray.push(this);
    }

    #itemCount = 0;

    // Item lists hold the items that can go into a project, only Todos for now
    #baseItemList = []; // The base list holds items as they are added to the project and referenced by the orderBy lists
        // The orderBy lists hold the indices of Todos in the baseItemList based on the specified order
    #orderByEntryOrderList = []; // Ordered by entry order of itemList; this is identical to baseItemList, but for consistency is used
    #orderByPriorityList = []; // Ordered by the Priority of Todos, further ordered by date, further ordered by entry order
    #orderByDueDateList = []; // Ordered by the DueDate of Todos, further ordered by Priority, further ordered by entry order

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
        // if (!todo instanceof Todo) { 
        //     console.log(`Incorrect item given to project list: Not adding to project\nExpect: Todo\nGiven: ${typeof todo}`);
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
            // Time added
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
                prioList.push(todo);
            }
            addedToList = false;

            // DueDate
            let dateList = this.#orderByDueDateList;
            for (let i = 0; i < dateList.length; i++) {
                let todoInList = this.#baseItemList[dateList[i]];
                let dateDiff = this.#getDueDateDifferenceBetweenTodos(todoInList, newTodo);
                
                if (dateDiff > 0) { // The new todo has a dueDate before the one in the list
                    prioList.splice(i, 0, thisToDoIndex);
                    addedToList = true;
                    break;
                } else if (dateDiff === 0) { // Same dueDate, check priority
                    let prioDiff = this.#getPriorityDifferenceBetweenTodos(todoInList, newTodo);
                    if (prioDiff < 0) { // The todo in the list has a lesser priority, add the new todo here
                        prioList.splice(i, 0, thisToDoIndex);
                        addedToList = true;
                        break;
                    }
                }
            }

            // If the todo was never added we need to append it to the end of the array
            if (!addedToList) {
                dateList.push(todo);
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