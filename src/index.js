import {Todo} from "./toDo.js"
import {Project} from "./project.js"

let dateArray = [
    new Date(2000, 0, 10), // 1/10/2000
    new Date(2005, 0, 10), // 2005
    new Date(2010, 0, 10), // 2010

    new Date(2015, 1, 10), // 1/10/15 - For priority testing
    new Date(2015, 1, 10), 
    new Date(2015, 1, 10), 

    new Date(2025, 0, 10), // ./10/.
    new Date(2025, 0, 20), // ./20/.
    new Date(2025, 0, 30), // ./30/.
]

console.log("Create todos and project");
let todo1 = new Todo("Title1", "Desc", "No notes", false, dateArray[0], 3);
let todo2 = new Todo("Title2", "Desc", "No notes", false, dateArray[1], 5);
let todo3 = new Todo("Title3", "Desc", "No notes", false, dateArray[2], 7);
let proj1 = new Project("A Project");

console.log("Add todos to project")
proj1.addNewTodoToProject(todo1);
proj1.addNewTodoToProject(todo2);
proj1.addNewTodoToProject(todo3);

console.log("Get todos as ordered lists from project")
let entryOrder = proj1.getTodosByOrderedList("entryOrder", false);
let priority = proj1.getTodosByOrderedList("priority", false);
let dueDate = proj1.getTodosByOrderedList("dueDate", false);

let entryOrderRev = proj1.getTodosByOrderedList("entryOrder", true);
let priorityRev = proj1.getTodosByOrderedList("priority", true);
let dueDateRev = proj1.getTodosByOrderedList("dueDate", true);

console.log("Delete middle todo from the project");
proj1.deleteTodoFromProject("Title2");

console.log("See if deletion worked by getting todos (Only in regular oder)")
let entryOrderPostDel = proj1.getTodosByOrderedList("entryOrder", false);
let priorityPostDel = proj1.getTodosByOrderedList("priority", false);
let dueDatePostDel = proj1.getTodosByOrderedList("dueDate", false);

console.log("\nNew testing - Add more entries to project to see if they add correctly")

console.log("Same Date different Priority");
let todoX = new Todo("Title4","Desc", "No notes", false, dateArray[3], 20);
proj1.addNewTodoToProject(todoX);
todoX.setTitle("TitleX");

todoX = new Todo("Title5","Desc", "No notes", false, dateArray[4], -5);
proj1.addNewTodoToProject(todoX);

todoX = new Todo("Title6","Desc", "No notes", false, dateArray[5], 4);
proj1.addNewTodoToProject(todoX);

console.log("Same Date, repeated Priority");
todoX = new Todo("Title7","Desc", "No notes", false, dateArray[8], 9);
proj1.addNewTodoToProject(todoX);

todoX = new Todo("Title8","Desc", "No notes", false, dateArray[8], 5);
proj1.addNewTodoToProject(todoX);

todoX = new Todo("Title9","Desc", "No notes", false, dateArray[8], 9);
proj1.addNewTodoToProject(todoX);

todoX = new Todo("Title10","Desc", "No notes", false, dateArray[8], 5);
proj1.addNewTodoToProject(todoX);

let count = proj1.getItemCount(); // So I can view the last thing that happened with proj1 still loaded