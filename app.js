document.documentElement.classList.add("js-ready");

// Smooth, premium interactions (no libraries
// WOW: scroll progress bar
const pb = document.getElementById("progressBar");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  if (pb) pb.style.width = `${scrolled}%`;
});

// Fake-link helper so your page doesn't break while you replace links
function fakeLink(e){
  e.preventDefault();
  alert("Replace this with your real link (GitHub, Demo, Slides, etc.)");
  return false;
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu toggle
const menuBtn = document.querySelector(".menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});

// Close menu on click
document.querySelectorAll(".navlink").forEach(a => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
      io.unobserve(entry.target);
    }
  });
},{ threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// Active nav highlight
const sections = ["about","experience","projects","skills","contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navMap = new Map(
  Array.from(document.querySelectorAll(".navlink"))
    .map(a => [a.getAttribute("href"), a])
);

const sectionIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute("id");
    const link = navMap.get(`#${id}`);
    if(!link) return;

    if(entry.isIntersecting){
      document.querySelectorAll(".navlink").forEach(x => x.classList.remove("active"));
      link.classList.add("active");
    }
  });
},{ rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });

sections.forEach(s => sectionIO.observe(s));

// Skills meter animation
const meters = document.querySelectorAll(".meter");
const meterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const meter = entry.target;
    const level = meter.getAttribute("data-level") || "70";
    const fill = meter.querySelector(".fill");
    const pct = meter.querySelector(".pct");
    if(fill) fill.style.width = `${level}%`;
    if(pct) pct.textContent = `${level}%`;
    meterIO.unobserve(meter);
  });
},{ threshold: 0.25 });

meters.forEach(m => meterIO.observe(m));

// Copy email
const copyBtn = document.getElementById("copyEmail");
copyBtn?.addEventListener("click", async () => {
  const email = document.getElementById("emailText")?.textContent?.trim() || "";
  if(!email) return;
  try{
    await navigator.clipboard.writeText(email);
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = "Copy", 1200);
  }catch{
    alert("Copy failed. You can manually copy the email.");
  }
});

// Subtle 3D tilt for project cards
document.querySelectorAll("[data-tilt]").forEach(card => {
  const damp = 18;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0..1
    const y = (e.clientY - rect.top) / rect.height;  // 0..1
    const rx = (0.5 - y) * damp;
    const ry = (x - 0.5) * damp;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0px)";
  });
});
// WOW: cursor glow follows mouse
const cg = document.getElementById("cursorGlow");
window.addEventListener("mousemove", (e) => {
  if(!cg) return;
  cg.style.left = e.clientX + "px";
  cg.style.top  = e.clientY + "px";
});
// WOW: project modal
const modal = document.getElementById("projectModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalTags = document.getElementById("modalTags");
const modalGithub = document.getElementById("modalGithub");
const modalLink = document.getElementById("modalLink");

function openModal(data){
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;
  modalTags.innerHTML = data.tags.map(t => `<span>${t}</span>`).join("");
  modalGithub.href = data.github || "https://github.com/Nisshreet";
  modalLink.href = data.link || "https://www.linkedin.com/in/nisshreet-bhattarai-07b85b255?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app";
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

modalBackdrop?.addEventListener("click", closeModal);
modalClose?.addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => {
  if(e.key === "Escape") closeModal();
});

// Attach to project cards (use their h3 + p text)
document.querySelectorAll(".pCard").forEach((card) => {
  card.style.cursor = "pointer";
  card.addEventListener("click", (e) => {
    // don't override real link clicks
    if (e.target.closest("a")) return;

    const title = card.querySelector("h3")?.textContent?.trim() || "Project";
    const desc = card.querySelector("p")?.textContent?.trim() || "";
    const tags = Array.from(card.querySelectorAll(".pTags span")).map(s => s.textContent.trim());

    // Try to use first GitHub link inside card if present
    const gh = card.querySelector('a[href*="github.com"]')?.getAttribute("href") || "https://github.com/Nisshreet";

    openModal({
      title,
      desc,
      tags: tags.length ? tags : ["CS", "Project"],
      github: gh,
      link: "mailto:bnisshreet@gmail.com"
    });
  });
});
