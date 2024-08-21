// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
 if (nextId === null) {
  nextId = 1;
 } else {
  nextId++;
 }
 localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Todo: create a function to create a task card
function createTaskCard(task) {
 const taskCard = $("<div>")
  .addClass("draggable my-3")
  .attr("data-id", task.id);
 const cardHeader = $("<div>").addClass("card-header h4").text(task.name);
 const cardBody = $("<div>").addClass("card-body");
 const cardDescription = $("<p>").addClass("card-text").text(task.description);
 const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
 const cardDeleteBtn = $("<button>")
  .addClass("btn btn-danger delete")
  .text("Delete")
  .attr("data-projectId", task.id);
 cardDeleteBtn.on("click", handleDeleteTask);

 if (task.dueDate && task.status !== "done") {
  const now = dayjs();
  const taskDueDate = dayjs(task.dueDate, "DD/MM/YYYY");
  if (now.isSame(taskDueDate, "day")) {
   taskCard.addClass("bg-warning text-white");
  } else if (now.isAfter(taskDueDate)) {
   taskCard.addClass("bg-danger text-white");
   cardDeleteBtn.addClass("border-light");
  }
 }
 cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
 taskCard.append(cardHeader, cardBody);
 let todoList = $("#todo-cards");
 let doneList = $("#done-cards");
 let inProgressList = $("#in-progress-cards");

 if (task.status === "to-do") {
  todoList.append(taskCard);
 } else if (task.status === "done") {
  doneList.append(taskCard);
 } else {
  inProgressList.append(taskCard);
 }

 $(".draggable").draggable({
  opacity: 0.7,
  zIndex: 100,
  helper: function (e) {
   const original = $(e.target).hasClass("ui-draggable")
    ? $(e.target)
    : $(e.target).closest(".ui-draggable");
   return original.clone().css({
    width: original.outerWidth(),
   });
  },
 });
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
 const todoList = $("#todo-cards");
 todoList.empty();

 const inProgessList = $("#in-progress-cards");
 inProgessList.empty();

 const doneList = $("#done-cards");
 doneList.empty();

 for (let i = 0; i < taskList.length; i++) {
  createTaskCard(taskList[i]);
 }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
 event.preventDefault();

 const taskTitle = $("#task-title").val().trim();
 const taskDescription = $("#task-description").val();
 const taskDueDate = $("#taskDueDate").val();
 generateTaskId();
 let newTask = {
  id: nextId,
  name: taskTitle,
  description: taskDescription,
  dueDate: taskDueDate,
  status: "to-do",
 };

 taskList.push(newTask);

 createTaskCard(newTask);

 localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
 const idDelete = event.target.dataset.projectid;
 for (let i = 0; i < taskList.length; i++) {
  if (taskList[i].id == idDelete) {
   taskList.splice(i, 1);
   localStorage.setItem("tasks", JSON.stringify(taskList));
  }

  renderTaskList();
 }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
 const taskId = ui.draggable[0].dataset.id;

 const newStatus = event.target.id;

 for (let i = 0; i < taskList.length; i++) {
  if (taskId == taskList[i].id) {
   taskList[i].status = newStatus;
   localStorage.setItem("tasks", JSON.stringify(taskList));
   renderTaskList();
  }
 }
}
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker

$(document).ready(function () {
 if (taskList === null) {
  taskList = [];
 }
 renderTaskList();

 $("#modal-submit").click(handleAddTask);

 $(".lane").droppable({
  accept: ".draggable",
  drop: handleDrop,
 });
});
