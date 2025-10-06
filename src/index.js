import {Todo} from "./toDo.js"

let newToDo = new Todo("Title", "Desc", "No notes", false, new Date(), 5);
let toDoTitle = newToDo.getTitle();
console.log(toDoTitle);

newToDo.setPriority(7);
let newPrio = newToDo.getPriority();
console.log(newPrio);

let toDoAsObj = newToDo.getAllInfoAsObject();
console.log(toDoAsObj);