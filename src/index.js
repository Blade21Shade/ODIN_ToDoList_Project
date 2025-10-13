import {Todo} from "./toDo.js"
import {Project} from "./project.js"
import {fillInProjectSideBar} from "./dom.js"
import "./styles.css"

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
let todo4 = new Todo("Title4", "A longer description", "Lots of notes so I can make sure to handle overflow within the project. Lots of notes so I can make sure to handle overflow within the project. Lots of notes so I can make sure to handle overflow within the project. ", false, dateArray[3], 9);
let todo5 = new Todo("Title5", "Desc", "No notes", false, dateArray[4], 11);
let todo6 = new Todo("Title6", "Desc", "No notes", false, dateArray[5], 1);
let todo7 = new Todo("Title7", "Desc", "No notes", false, dateArray[6], 3);

let proj1 = new Project("Project 1");
let proj2 = new Project("Project 2");
let proj3 = new Project("Project 3");

proj1.addNewTodoToProject(todo1);
proj1.addNewTodoToProject(todo2);
proj1.addNewTodoToProject(todo3);
proj1.addNewTodoToProject(todo4);
proj1.addNewTodoToProject(todo5);
proj1.addNewTodoToProject(todo6);
proj1.addNewTodoToProject(todo7);

proj2.addNewTodoToProject(todo1);
proj2.addNewTodoToProject(todo2);
proj2.addNewTodoToProject(todo3);
proj2.addNewTodoToProject(todo4);
proj2.addNewTodoToProject(todo5);
proj2.addNewTodoToProject(todo6);
proj2.addNewTodoToProject(todo7);

proj3.addNewTodoToProject(todo1);
proj3.addNewTodoToProject(todo2);
proj3.addNewTodoToProject(todo3);
proj3.addNewTodoToProject(todo4);
proj3.addNewTodoToProject(todo5);
proj3.addNewTodoToProject(todo6);
proj3.addNewTodoToProject(todo7);

// DOM Manipulation
// Side bar
let projectsWithoutTodos = Project.getProjectArrayWithoutTodos();
fillInProjectSideBar(projectsWithoutTodos);