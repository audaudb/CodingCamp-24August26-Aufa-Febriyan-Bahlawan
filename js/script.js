// ======================================================
// LIFE FLOW DASHBOARD
// ======================================================

// ================= THEME TOGGLE =================

const themeToggle = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");

    themeToggle.innerHTML = `
        <i class="fa-solid fa-sun"></i>
        <span>Light Mode</span>
    `;
}

themeToggle.addEventListener("click", () => {
    const isDark =
        document.body.getAttribute("data-theme") === "dark";

    if (isDark) {
        document.body.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");

        themeToggle.innerHTML = `
            <i class="fa-solid fa-moon"></i>
            <span>Dark Mode</span>
        `;
    } else {
        document.body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");

        themeToggle.innerHTML = `
            <i class="fa-solid fa-sun"></i>
            <span>Light Mode</span>
        `;
    }
});


// ================= GREETING & CLOCK =================

const timeDisplay = document.getElementById("time-display");
const dateDisplay = document.getElementById("date-display");
const greetingMsg = document.getElementById("greeting-msg");
const nameInput = document.getElementById("name-input");

function updateClock() {
    const now = new Date();

    timeDisplay.textContent = now.toLocaleTimeString("en-US", {
        hour12: false
    });

    dateDisplay.textContent = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const hour = now.getHours();

    if (hour < 12) {
        greetingMsg.textContent = "Good Morning";
    } else if (hour < 18) {
        greetingMsg.textContent = "Good Afternoon";
    } else {
        greetingMsg.textContent = "Good Evening";
    }
}

setInterval(updateClock, 1000);
updateClock();


// ================= USER NAME =================

nameInput.value = localStorage.getItem("userName") || "";

nameInput.addEventListener("input", (event) => {
    localStorage.setItem("userName", event.target.value);
});


// ================= FOCUS TIMER =================

let timeLeft = 25 * 60;
let timerInterval = null;

const timerDisplay = document.getElementById("timer-display");

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");

    const secondsFormatted = (seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${secondsFormatted}`;
}

timerDisplay.textContent = formatTime(timeLeft);


// START TIMER

document.getElementById("start-btn").addEventListener("click", () => {
    if (timerInterval !== null) {
        return;
    }

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;

            timerDisplay.textContent = formatTime(timeLeft);
        } else {
            clearInterval(timerInterval);
            timerInterval = null;

            alert("Focus time is up!");
        }
    }, 1000);
});


// STOP TIMER

document.getElementById("stop-btn").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
});


// RESET TIMER

document.getElementById("reset-btn").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;

    timeLeft = 25 * 60;

    timerDisplay.textContent = formatTime(timeLeft);
});


// ================= TO-DO LIST =================

const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// RENDER TASKS

function renderTasks() {
    taskList.innerHTML = "";

    if (taskCount) {
        const remainingTasks = tasks.filter(
            task => !task.done
        ).length;

        taskCount.textContent = remainingTasks;
    }

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <li class="empty-task">
                <i class="fa-regular fa-circle-check"></i>
                <span>No tasks yet. Add something to do!</span>
            </li>
        `;

        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        li.className = task.done ? "completed" : "";

        li.innerHTML = `
            <label class="task-content">
                <input
                    type="checkbox"
                    ${task.done ? "checked" : ""}
                    onchange="toggleTask(${index})"
                >

                <span class="task-check"></span>

                <span class="task-text">
                    ${escapeHTML(task.text)}
                </span>
            </label>

            <button
                class="delete-btn"
                onclick="deleteTask(${index})"
                title="Delete task"
            >
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        taskList.appendChild(li);
    });
}


// ADD TASK

function addTask() {
    const text = taskInput.value.trim();

    if (!text) {
        return;
    }

    const duplicate = tasks.some(
        task => task.text.toLowerCase() === text.toLowerCase()
    );

    if (duplicate) {
        alert("Task already exists!");
        return;
    }

    tasks.push({
        text: text,
        done: false
    });

    saveTasks();

    taskInput.value = "";

    renderTasks();
}

document.getElementById("add-task-btn").addEventListener("click", addTask);


// ADD TASK WITH ENTER

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});


// TOGGLE TASK

window.toggleTask = (index) => {
    tasks[index].done = !tasks[index].done;

    saveTasks();
    renderTasks();
};


// DELETE TASK

window.deleteTask = (index) => {
    tasks.splice(index, 1);

    saveTasks();
    renderTasks();
};


// SAVE TASKS

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ================= QUICK LINKS =================

const linkName = document.getElementById("link-name");
const linkUrl = document.getElementById("link-url");
const linksContainer = document.getElementById("links-container");

let links = JSON.parse(localStorage.getItem("links")) || [];


// RENDER LINKS

function renderLinks() {
    linksContainer.innerHTML = "";

    if (links.length === 0) {
        linksContainer.innerHTML = `
            <div class="empty-links">
                <i class="fa-solid fa-link-slash"></i>
                <span>No quick links yet.</span>
            </div>
        `;

        return;
    }

    links.forEach((link, index) => {
        const div = document.createElement("div");

        div.className = "link-item";

        div.innerHTML = `
            <a
                href="${escapeAttribute(link.url)}"
                target="_blank"
                rel="noopener noreferrer"
                class="link-content"
            >
                <span class="link-icon">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </span>

                <span class="link-name">
                    ${escapeHTML(link.name)}
                </span>
            </a>

            <button
                class="delete-link"
                onclick="deleteLink(${index})"
                title="Delete link"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        linksContainer.appendChild(div);
    });
}


// ADD LINK

function addLink() {
    const name = linkName.value.trim();
    let url = linkUrl.value.trim();

    if (!name || !url) {
        return;
    }

    if (
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {
        url = "https://" + url;
    }

    links.push({
        name: name,
        url: url
    });

    localStorage.setItem("links", JSON.stringify(links));

    linkName.value = "";
    linkUrl.value = "";

    renderLinks();
}

document
    .getElementById("add-link-btn")
    .addEventListener("click", addLink);


// ADD LINK WITH ENTER

linkUrl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addLink();
    }
});


// DELETE LINK

window.deleteLink = (index) => {
    links.splice(index, 1);

    localStorage.setItem("links", JSON.stringify(links));

    renderLinks();
};


// ================= SECURITY =================

function escapeHTML(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
    return value
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ================= INITIALIZE =================

renderTasks();
renderLinks();