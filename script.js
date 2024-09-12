let form = document.querySelector("form");
let list = document.getElementById("list");
let taskInput = document.getElementById("task");
let currentElement = null; // To store the element being updated

// Load tasks from local storage when the page loads
document.addEventListener("DOMContentLoaded", function() {
  loadTasks();
  animateLabel();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (taskInput.value !== "") {
    if (currentElement) {
      // If updating an existing task, update only the text content, not the buttons
      currentElement.firstChild.textContent = taskInput.value; 
      updateTaskInLocalStorage(currentElement.dataset.id, taskInput.value);
      resetForm();
    } else {
      // If adding a new task
      let element = createTaskElement(taskInput.value);
      list.appendChild(element);
      saveTaskToLocalStorage(element.dataset.id, taskInput.value);
    }

    taskInput.value = "";
  }
});

function resetForm() {
  currentElement = null;
  form.querySelector('button').textContent = "+";
}

function createTaskElement(taskText) {
  let element = document.createElement("li");
  element.dataset.id = Date.now(); // Use timestamp as a unique ID

  // Create a text node for the task
  let textNode = document.createTextNode(taskText);
  element.appendChild(textNode);

  // Delete button
  let buttonDE = document.createElement("button");
  buttonDE.textContent = "Delete";
  buttonDE.classList.add("delete-btn");
  buttonDE.addEventListener("click", () => {
    element.remove();
    deleteTaskFromLocalStorage(element.dataset.id);
  });

  // Check button
  let buttonDO = document.createElement("button");
  buttonDO.textContent = "Check";
  buttonDO.classList.add("done-btn");
  buttonDO.addEventListener("click", () => {
    element.classList.toggle("check");
    toggleTaskDoneInLocalStorage(element.dataset.id);
  });

  // Update button
  let buttonUP = document.createElement("button");
  buttonUP.textContent = "Update";
  buttonUP.classList.add("update-btn");
  buttonUP.addEventListener("click", () => {
    taskInput.value = element.firstChild.textContent; // Set input value to current task text
    currentElement = element; // Mark the element to be updated
    form.querySelector('button').textContent = "Update"; // Change button text to "Update Task"
  });

  element.appendChild(buttonDE);
  element.appendChild(buttonDO);
  element.appendChild(buttonUP);

  return element;
}

function saveTaskToLocalStorage(id, taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ id, text: taskText, done: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInLocalStorage(id, taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task => task.id == id ? { ...task, text: taskText } : task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTaskFromLocalStorage(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task.id != id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleTaskDoneInLocalStorage(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task => task.id == id ? { ...task, done: !task.done } : task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    let element = createTaskElement(task.text);
    if (task.done) {
      element.classList.add("check");
    }
    element.dataset.id = task.id;
    list.appendChild(element);
  });
}

function animateLabel() {
  const label = document.querySelector('.animated-label');
  const text = label.textContent;
  label.textContent = '';

  let index = 0;
  function type() {
      if (index < text.length) {
          label.textContent += text.charAt(index);
          index++;
          setTimeout(type, 100); // Adjust the speed here
      } else {
          setTimeout(() => {
              label.textContent = '';
              index = 0;
              type();
          }, 2000); // Adjust the delay before restarting the animation
      }
  }

  type();
}
