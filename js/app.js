import { FEMALE_BACK } from "../vendor/female-back.js";
import { FEMALE_FRONT } from "../vendor/female-front.js";
import { mountDemo, stopDemos } from "./demo.js";
import { exercises, order, routine } from "./exercises.js";

const svgNs = "http://www.w3.org/2000/svg";
const frontSvg = document.querySelector("#front-figure");
const backSvg = document.querySelector("#back-figure");
const panelName = document.querySelector("#muscle-name");
const panelPlace = document.querySelector("#muscle-place");
const panelIntro = document.querySelector("#muscle-intro");
const guide = document.querySelector("#guide");
const list = document.querySelector("#exercise-list");
const chips = document.querySelector("#muscle-list");
const panel = document.querySelector("#panel");

let selected = "";

drawFigure(frontSvg, FEMALE_FRONT, "Front muscles");
drawFigure(backSvg, FEMALE_BACK, "Back muscles");
drawChips();

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

function drawFigure(svg, diagram, label) {
  svg.setAttribute("viewBox", diagram.viewBox);
  svg.setAttribute("role", "group");
  svg.setAttribute("aria-label", label);

  for (const part of diagram.outline) {
    const path = pathEl(part.d);
    path.setAttribute("class", "body-outline");
    svg.append(path);
  }

  const seen = new Set();
  diagram.muscles.forEach((muscle, index) => {
    const path = pathEl(muscle.d);
    path.setAttribute("class", "muscle");
    path.dataset.group = muscle.group;
    const name = exercises[muscle.group]?.name ?? muscle.group;
    const primary = !seen.has(muscle.group);
    seen.add(muscle.group);
    if (primary) {
      path.id = `${diagram.view.toLowerCase()}-${muscle.group.toLowerCase()}-${index}`;
      path.setAttribute("role", "button");
      path.setAttribute("tabindex", "0");
      path.setAttribute("aria-label", name);
      path.setAttribute("aria-pressed", "false");
      path.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select(muscle.group);
        }
      });
    } else {
      path.setAttribute("aria-hidden", "true");
    }
    path.addEventListener("click", () => select(muscle.group));
    path.addEventListener("pointerenter", () => hover(muscle.group));
    path.addEventListener("pointerleave", () => hover(""));
    svg.append(path);
  });
}

function pathEl(d) {
  const path = document.createElementNS(svgNs, "path");
  path.setAttribute("d", d);
  path.setAttribute("fill-rule", "evenodd");
  return path;
}

function drawChips() {
  for (const group of order) {
    const item = exercises[group];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.dataset.group = group;
    button.textContent = item.name;
    button.addEventListener("click", () => select(group));
    chips.append(button);
  }
}

function select(group) {
  selected = group;
  const item = exercises[group];
  paint();
  stopDemos();

  panelName.textContent = item.name;
  panelPlace.hidden = false;
  panelPlace.textContent = item.place;
  panelIntro.textContent = "One easy dumbbell move.";
  guide.hidden = false;
  guide.textContent = routine;
  list.replaceChildren();

  item.exercises.forEach((exercise) => {
    const card = document.createElement("article");
    card.className = "exercise";
    const title = document.createElement("h3");
    title.textContent = exercise.name;
    const dose = document.createElement("p");
    dose.className = "dose";
    dose.textContent = exercise.dose;
    const stage = document.createElement("div");
    stage.className = "demo-slot";
    const cue = document.createElement("p");
    cue.textContent = exercise.cue;
    card.append(title, dose, stage, cue);
    list.append(card);
    mountDemo(stage, exercise.lottie, exercise.name);
  });

  if (window.matchMedia("(max-width: 860px)").matches) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
}

function hover(group) {
  document.querySelectorAll(".muscle").forEach((path) => {
    path.classList.toggle("is-hot", group !== "" && path.dataset.group === group);
  });
}

function paint() {
  document.querySelectorAll(".muscle").forEach((path) => {
    const on = path.dataset.group === selected;
    path.classList.toggle("is-selected", on);
    if (path.hasAttribute("aria-pressed")) {
      path.setAttribute("aria-pressed", on ? "true" : "false");
    }
  });
  document.querySelectorAll(".chip").forEach((chip) => {
    const on = chip.dataset.group === selected;
    chip.classList.toggle("is-selected", on);
    chip.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function setView(view) {
  document.body.dataset.view = view;
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.view === view ? "true" : "false");
  });
}
