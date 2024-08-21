// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
 let tasks = taskList;

 if (!tasks) {
  tasks = [];
 }
 return tasks;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
 const taskCard = $("<div>")
  .addClass("card task-card draggable my-3")
  .attr("data-task-id", task.id);
 const cardHeader = $("<div>").addClass("card-header h4").text(task.name);
 const cardBody = $("<div>").addClass("card-body");
 const cardDescription = $("<p>").addClass("card-text").text(task.description);
 const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
 const cardDeleteBtn = $("<button>")
  .addClass("btn btn-danger delete")
  .text("Delete")
  .attr("data-task-id", task.id);
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

 return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
 const todoList = $("#todo-cards");
 todoList.empty();

 const inProgessList = $("#in-progress-cards");
 inProgessList.empty();

 const doneList = $("#done-cards");
 doneList.empty();

 for (let task of tasks) {
  if (task.status === "to-do") {
   todoList.append(createTaskCard(task));
  } else if (task.status === "in-progess") {
   inProgressList.append(createTaskCard(task));
  } else if (task.status === "done") {
   doneList.append(createTaskCard(task));
  }
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

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
 event.preventDefault();

 const taskTitle = $("#task-title").val().trim();
 const taskDescription = $("#task-description").val();
 const taskDueDate = $("#taskDueDate").val();
 generateTaskId();
 const newTask = {
  id: nextId,
  name: taskTitle,
  description: taskDescription,
  dueDate: taskDueDate,
  status: "to-do",
 };

 taskList.push(newTask);

 renderTaskList();

 localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
 const taskId = $(this).attr("data-task-id");
 const tasks = generateTaskId();

 tasks.forEach((task) => {
  if (task.id === taskId) {
   tasks.splice(tasks.indexOf(task), 1);
  }
 });

 renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
 // ? Get the project id from the event
 const taskId = ui.draggable[0].dataset.taskId;

 // ? Get the id of the lane that the card was dropped into
 const newStatus = event.target.id;

 for (let i = 0; i < taskList.length; i++) {
  // ? Find the project card by the `id` and update the project status.
  if (task.id === taskId) {
   task.status = newStatus;
  }
 }
 // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
 localStorage.setItem("tasks", JSON.stringify(tasks));
 renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker

$(document).ready(function () {
 $("#modal-submit").click(handleAddTask);
 renderTaskList();

 $(".lane").droppable({
  accept: ".draggable",
  drop: handleDrop,
 });
});
