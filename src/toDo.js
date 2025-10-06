export class Todo {
    constructor(title, description, notes, isComplete, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.notes = notes;
        this.isComplete = isComplete;
        this.dueDate = dueDate;
        
        if (priority <= 1) {
            this.priority = 1;
        } else if (priority >= 10) {
            this.priority = 10;
        } else {
            this.priority = priority;
        }
    }

    getAllInfoAsObject() {
        return {
            "title": this.title,
            "description": this.description,
            "notes": this.notes,
            "isComplete": this.isComplete,
            "dueDate": this.dueDate,
            "priority": this.priority
        };
    }

    // Getters
    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getNotes() {
        return this.notes;
    }

    getIsComplete() {
        return this.isComplete;
    }

    getDueDate() {
        return this.dueDate;
    }

    getPriority() {
        return this.priority;
    }

    // Setters
    setTitle(title) {
        this.title = title;
    }

    setDescription(description) {
        this.description = description;
    }

    setNotes(notes) {
        this.notes = notes;
    }

    setIsComplete(isComplete) {
        this.isComplete = isComplete;
    }

    setDueDate(dueDate) {
        this.dueDate = dueDate;
    }

    setPriority(priority) {
        this.priority = priority;
    }
}