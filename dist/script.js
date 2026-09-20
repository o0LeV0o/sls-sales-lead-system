const TELEGRAM_USERNAME = "";

const intro = document.querySelector(".intro");
let introFinished = false;
const finishIntro = () => {
  if (introFinished) return;
  introFinished = true;
  intro?.classList.add("hide");
  document.body.classList.remove("intro-active");
  window.setTimeout(startRevealAnimations, 180);
};

window.setTimeout(finishIntro, 2600);
intro?.addEventListener("click", finishIntro);

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  nav?.classList.toggle("open", !open);
});

nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuButton?.setAttribute("aria-expanded", "false");
  nav.classList.remove("open");
}));

const themeButton = document.querySelector(".theme-toggle");
const root = document.documentElement;
const themeColor = document.querySelector('meta[name="theme-color"]');
const savedTheme = window.localStorage.getItem("sls-theme");

const applyTheme = (theme) => {
  const isLight = theme === "light";
  root.toggleAttribute("data-theme", isLight);
  if (isLight) root.setAttribute("data-theme", "light");
  themeButton?.setAttribute("aria-pressed", String(isLight));
  if (themeButton) themeButton.textContent = isLight ? "◑" : "◔";
  themeColor?.setAttribute("content", isLight ? "#f5f5f2" : "#050505");
};

applyTheme(savedTheme === "light" ? "light" : "dark");

themeButton?.addEventListener("click", () => {
  const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(nextTheme);
  window.localStorage.setItem("sls-theme", nextTheme);
});

document.querySelectorAll(".letters").forEach((heading) => {
  const text = heading.getAttribute("aria-label") || heading.textContent.trim();
  heading.textContent = "";
  [...text].forEach((character, index) => {
    const span = document.createElement("span");
    span.className = "split-char";
    span.textContent = character === " " ? "\u00a0" : character;
    span.style.transitionDelay = `${index * 35}ms`;
    heading.append(span);
  });
});

const revealSelector = [
  ".hero-copy", ".hero-art", ".about .metal-title", ".about-card", ".about-photo",
  ".step-section .step-label", ".step-section .metal-title", ".step-section .step-subtitle",
  ".media-frame", ".step-section .red-outline-button", ".reviews .step-label",
  ".reviews .metal-title", ".reviews .step-subtitle", ".review-row",
  ".reviews .red-outline-button", ".faq .step-label", ".faq .metal-title", ".faq-row",
  ".decision .step-label", ".decision .metal-title", ".decision .step-subtitle",
  ".decision-media", ".price-card", ".footer"
].join(",");

document.querySelectorAll(revealSelector).forEach((element) => element.classList.add("reveal"));

document.querySelectorAll(".about-layout, .pricing-grid").forEach((group) => {
  [...group.children].forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${index * 130}ms`);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    } else {
      entry.target.classList.remove("visible");
    }
  });
}, { threshold: 0.16, rootMargin: "0px 0px -8%" });

function startRevealAnimations() {
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

document.querySelectorAll(".glow-card, .price-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = `${event.clientX - bounds.left}px`;
    const y = `${event.clientY - bounds.top}px`;
    card.style.setProperty("--glow-x", x);
    card.style.setProperty("--glow-y", y);
    card.style.setProperty("--tariff-x", x);
    card.style.setProperty("--tariff-y", y);
  });
});

const disclaimer = document.querySelector(".disclaimer");
const typewriterLines = [...document.querySelectorAll("[data-typewriter]")];
const typewriterSource = typewriterLines.map((line) => line.textContent.trim());
let disclaimerStarted = false;
let disclaimerRun = 0;

typewriterLines.forEach((line, index) => {
  line.setAttribute("aria-label", typewriterSource[index]);
  line.textContent = "";
});

const clearDisclaimer = () => {
  typewriterLines.forEach((line) => {
    line.textContent = "";
    line.classList.remove("typing");
  });
};

const typeLine = (element, text, speed, runId) => new Promise((resolve) => {
  element.textContent = "";
  element.classList.add("typing");
  let index = 0;
  const tick = () => {
    if (runId !== disclaimerRun) {
      element.classList.remove("typing");
      resolve();
      return;
    }
    element.textContent += text[index] || "";
    index += 1;
    if (index <= text.length) {
      window.setTimeout(tick, speed);
    } else {
      element.classList.remove("typing");
      resolve();
    }
  };
  tick();
});

const disclaimerObserver = new IntersectionObserver(async (entries) => {
  const entry = entries[0];
  if (!entry) return;

  if (!entry.isIntersecting) {
    disclaimerRun += 1;
    disclaimerStarted = false;
    disclaimer.classList.remove("active");
    clearDisclaimer();
    return;
  }

  if (disclaimerStarted) return;
  disclaimerStarted = true;
  const runId = ++disclaimerRun;
  disclaimer.classList.add("active");
  await new Promise((resolve) => window.setTimeout(resolve, 350));
  for (let index = 0; index < typewriterLines.length; index += 1) {
    if (runId !== disclaimerRun) return;
    await typeLine(typewriterLines[index], typewriterSource[index], index === 0 ? 17 : 32, runId);
  }
}, { threshold: .3 });

if (disclaimer) disclaimerObserver.observe(disclaimer);

document.querySelectorAll(".buy-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const message = `Хочу купить SLS ${button.dataset.plan}`;
    const username = TELEGRAM_USERNAME.replace(/^@/, "");
    const url = username
      ? `https://t.me/${username}?text=${encodeURIComponent(message)}`
      : `https://t.me/share/url?url=${encodeURIComponent("https://t.me/+MhD23GcUaD42MjZi")}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
});
