// ----- Get elements -----
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCountEl = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

// ----- Data -----
const maxCount = 50;
let count = 0;
let teamCounts = { water: 0, zero: 0, power: 0 };
let attendees = []; // each one: { name, teamLabel }

// ----- Create the attendee list under the team cards -----
const listSection = document.createElement("div");
listSection.className = "attendee-list";
listSection.innerHTML = "<h3>Attendee List</h3><ul id='attendeeList'></ul>";
document.querySelector(".team-stats").insertAdjacentElement("afterend", listSection);
const attendeeList = document.getElementById("attendeeList");

// ----- Save and load (local storage) -----
function saveProgress() {
  localStorage.setItem("count", count);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

function loadProgress() {
  count = parseInt(localStorage.getItem("count")) || 0;
  teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || teamCounts;
  attendees = JSON.parse(localStorage.getItem("attendees")) || [];
}

// ----- Show a message in the greeting box -----
function showMessage(text) {
  greeting.textContent = text;
  greeting.classList.add("success-message");
  greeting.style.display = "block";
}

// ----- Update everything on the page -----
function updateDisplay() {
  // total count
  attendeeCountEl.textContent = count;

  // team counts
  document.getElementById("waterCount").textContent = teamCounts.water;
  document.getElementById("zeroCount").textContent = teamCounts.zero;
  document.getElementById("powerCount").textContent = teamCounts.power;

  // progress bar
  const percentage = Math.min((count / maxCount) * 100, 100);
  progressBar.style.width = percentage + "%";

  // attendee list
  attendeeList.innerHTML = "";
  attendees.forEach(function (person) {
    const li = document.createElement("li");
    li.textContent = person.name + " - " + person.teamLabel;
    attendeeList.appendChild(li);
  });
}

// ----- Celebration when the goal is reached -----
function checkGoal() {
  if (count >= maxCount) {
    const labels = {
      water: "Team Water Wise",
      zero: "Team Net Zero",
      power: "Team Renewables",
    };

    let winner = "water";
    for (const team in teamCounts) {
      if (teamCounts[team] > teamCounts[winner]) {
        winner = team;
      }
    }

    showMessage("🏆 Goal reached! " + labels[winner] + " wins with the highest turnout!");
  }
}

// ----- Handle check-in -----
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // get the name and team
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamLabel = teamSelect.options[teamSelect.selectedIndex].text;

  if (name === "") {
    return;
  }

  // update the data
  count++;
  teamCounts[team]++;
  attendees.push({ name: name, teamLabel: teamLabel });

  // welcome message
  showMessage("🎉