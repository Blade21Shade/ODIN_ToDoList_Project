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

let proj2 = new Project("Project 2");
let proj3 = new Project("Project 3");

let fullProjectList = Project.getProjectArray();
let projectListWithoutTodos = Project.getProjectArrayWithoutTodos();

let a = 1;