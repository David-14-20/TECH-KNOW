"use strict";

// Editable starter data. Credit units are demonstrations until checked against
// the student's official course registration or guide. ENT 211 is confirmed as 2.
class Course {
    constructor(code, name, units, category, description) {
        this.code = String(code).trim().toUpperCase();
        this.name = String(name).trim();
        this.units = Number(units);
        this.category = category === "ELECTIVE" ? "ELECTIVE" : "CORE";
        this.description = String(description || "Add this course to your semester list and keep its study details organized here.");
    }
    matches(query) {
        const text = String(query).trim().toLowerCase();
        return this.code.toLowerCase().includes(text) || this.name.toLowerCase().includes(text);
    }
}

const STARTERS = [
    ["COS 201", "Computer Programming I", 3, "CORE", "Build programming foundations through problem solving, algorithms, Java syntax, and structured programs."],
    ["CYB 203", "Cybercrime, Law and Countermeasures", 2, "CORE", "Explore cybercrime, digital evidence, prevention, incident response, and cyber law."],
    ["COS 203", "Discrete Structures", 2, "ELECTIVE", "Study logic, sets, relations, functions, counting, graphs, and proofs."],
    ["ENT 211", "Entrepreneurship and Innovation", 2, "CORE", "Develop ideas through customer discovery, business models, innovation, and planning."],
    ["SEN 201", "Introduction to Software Engineering", 2, "CORE", "Learn how software teams plan, design, build, test, and maintain products."],
    ["MTH 205", "Linear Algebra I", 2, "CORE", "Explore vectors, matrices, linear systems, and transformations."],
    ["MTH 201", "Mathematical Methods I", 2, "CORE", "Practice mathematical methods that support quantitative reasoning."],
    ["CYB 299", "SIWES I", 3, "CORE", "Connect classroom learning with supervised workplace experience."],
    ["MIVA-CYB 207", "Zero Trust Networking", 2, "ELECTIVE", "Explore identity-first security, least privilege, segmentation, and verification."]
].map(row => new Course(...row));
const MATERIALS = {
    "COS 201": [
        ["materials/cos-201-course-material.pdf", "Course material"],
        ["materials/cos-201-lab-manual.pdf", "Lab manual"],
        ...Array.from({length: 8}, (_, i) => [`materials/cos-201-extra-${String(i + 1).padStart(2, "0")}.pdf`, `Additional supplied PDF ${i + 1}`])
    ],
    "COS 203": [["materials/cos-203-course-material.pdf", "Course material"], ["materials/cos-203-study-guide.pdf", "Study guide"]],
    "CYB 203": [["materials/cyb-203-course-material.pdf", "Course material"]],
    "ENT 211": [["materials/ent-211-course-guide.pdf", "Course guide"]]
};
const KEY = "techKnowCoursesV3";
const byId = id => document.getElementById(id);
const escapeText = value => String(value);
function cleanCourse(item) {
    if (!item || typeof item !== "object") throw new Error("Each course must be an object.");
    const course = new Course(item.code, item.name, item.units, item.category, item.description);
    if (!course.code || course.code.length > 24 || !course.name || course.name.length > 100 || !Number.isInteger(course.units) || course.units < 1 || course.units > 99) {
        throw new Error("A course has a missing or invalid code, title, or whole-number unit value (1–99).");
    }
    return course;
}
function sumUnitsRecursively(items, index = 0) {
    if (index >= items.length) return 0;
    return items[index].units + sumUnitsRecursively(items, index + 1);
}
function loadCourses() {
    try {
        const raw = localStorage.getItem(KEY) || localStorage.getItem("techKnowCoursesV2") || localStorage.getItem("techKnowCourses");
        if (!raw) return STARTERS.map(c => new Course(c.code, c.name, c.units, c.category, c.description));
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) throw new Error("Saved course data must be a list.");
        return parsed.map(cleanCourse);
    } catch (error) {
        console.warn("Saved courses could not be loaded; starter data is shown.", error);
        return STARTERS.map(c => new Course(c.code, c.name, c.units, c.category, c.description));
    }
}
let courses = loadCourses();
function saveCourses() {
    try { localStorage.setItem(KEY, JSON.stringify(courses)); return true; }
    catch (error) { console.error("Course save failed", error); return false; }
}
function node(tag, cls, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = escapeText(text);
    return el;
}
function materialControl(course) {
    const files = MATERIALS[course.code];
    if (!files || !files.length) return node("span", "material-pending", "No PDF supplied yet");
    const details = node("details", "download-details");
    details.appendChild(node("summary", "", `Download PDFs (${files.length})`));
    const list = node("ul", "download-file-list");
    files.forEach(([href, label]) => {
        const li = node("li"); const a = node("a", "download-link", label);
        a.href = href; a.setAttribute("download", ""); li.appendChild(a); list.appendChild(li);
    });
    details.appendChild(list); return details;
}
function renderCatalog() {
    const grid = byId("course-grid"); grid.replaceChildren();
    courses.forEach(course => {
        const card = node("article", "course-card"); const top = node("div", "course-card-top");
        top.append(node("span", `course-type ${course.category.toLowerCase()}`, course.category), node("span", "enrolled-badge", "In my list"));
        card.append(top, node("p", "course-code", course.code), node("h3", "course-title", course.name), node("p", "course-units", `Demo: ${course.units} ${course.units === 1 ? "unit" : "units"} · verify official value`), node("p", "course-description", course.description));
        const actions = node("div", "course-card-actions"); const b = node("button", "text-button", "View overview");
        b.type = "button"; b.dataset.courseCode = course.code; actions.append(b, materialControl(course)); card.append(actions); grid.append(card);
    });
}
function renderMaterials() {
    const target = byId("materials-grid"); target.replaceChildren(); let count = 0;
    courses.forEach(course => {
        const card = node("article", "material-card"); card.appendChild(node("span", "material-file-icon", "PDF"));
        const copy = node("div", "material-card-copy"); copy.append(node("p", "course-code", course.code), node("h3", "", course.name), node("p", "material-description", "Available course documents included with this project.")); card.append(copy);
        const links = MATERIALS[course.code] || []; count += links.length; card.appendChild(materialControl(course)); target.appendChild(card);
    });
    byId("materials-count").textContent = `${count} PDF${count === 1 ? "" : "s"} available`;
}
function renderList(list = courses) {
    const ul = byId("my-course-list"); ul.replaceChildren();
    if (!list.length) { ul.appendChild(node("li", "empty-list", "No courses to show.")); return; }
    list.forEach(course => {
        const li = node("li", "course-list-item"); const copy = node("div", "course-list-copy");
        copy.append(node("strong", "", `${course.code} · ${course.name}`), node("span", "", `${course.units} demo ${course.units === 1 ? "unit" : "units"} · ${course.category}`));
        const remove = node("button", "remove-course", "Remove"); remove.type = "button"; remove.dataset.removeCode = course.code; li.append(copy, remove); ul.appendChild(li);
    });
}
function renderAll() {
    renderCatalog(); renderMaterials(); renderList();
    byId("course-count").textContent = String(courses.length);
    let total = 0;
    try { total = sumUnitsRecursively(courses); } catch (error) { console.error("Could not total course units", error); }
    byId("total-units").textContent = String(total); byId("hero-course-count").textContent = String(courses.length); byId("hero-unit-count").textContent = String(total);
}
function status(message, kind = "") { byId("course-status").textContent = message; byId("course-status").className = `form-message ${kind}`; }

byId("course-form").addEventListener("submit", event => {
    event.preventDefault();
    try {
        const course = cleanCourse({code: byId("course-code").value, name: byId("course-name").value, units: byId("course-units").value, category: byId("course-category").value});
        if (courses.some(item => item.code === course.code)) throw new Error("That course code is already in your list.");
        if (courses.length >= 200) throw new Error("The demo supports up to 200 courses.");
        courses.push(course); const saved = saveCourses(); renderAll(); event.currentTarget.reset();
        status(saved ? "Course added and saved in this browser." : "Course added for this session; browser storage is unavailable.", saved ? "success" : "error");
    } catch (error) { status(error.message || "Please check the course details and try again.", "error"); }
});
byId("search-form").addEventListener("submit", event => {
    event.preventDefault(); const query = byId("search-course").value.trim();
    if (!query) { byId("search-message").textContent = "Enter a course code or title to search."; return; }
    const found = courses.filter(course => course.matches(query)); renderList(found);
    byId("search-message").textContent = found.length ? `${found.length} course${found.length === 1 ? "" : "s"} found.` : "No courses matched your search.";
});
byId("search-course").addEventListener("input", event => { if (!event.target.value.trim()) { byId("search-message").textContent = ""; renderList(); } });
byId("my-course-list").addEventListener("click", event => {
    const button = event.target.closest("[data-remove-code]"); if (!button) return;
    courses = courses.filter(c => c.code !== button.dataset.removeCode); saveCourses(); renderAll(); status("Course removed from your list.");
});
byId("course-grid").addEventListener("click", event => {
    const button = event.target.closest("[data-course-code]"); if (!button) return;
    const course = courses.find(c => c.code === button.dataset.courseCode); if (!course) return;
    byId("course-detail-code").textContent = `${course.code} · ${course.units} demo units · ${course.category}`;
    byId("course-detail-title").textContent = course.name; byId("course-detail-description").textContent = course.description;
    byId("course-details").hidden = false; byId("course-details").scrollIntoView({behavior:"smooth", block:"nearest"});
});
byId("close-course-details").addEventListener("click", () => { byId("course-details").hidden = true; });
byId("export-courses").addEventListener("click", () => {
    try { const blob = new Blob([JSON.stringify(courses, null, 2)], {type:"application/json"}); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "tech-know-courses.json"; a.click(); URL.revokeObjectURL(a.href); }
    catch (error) { status("Could not save the course file in this browser.", "error"); }
});
byId("import-courses").addEventListener("change", async event => {
    const file = event.target.files[0]; if (!file) return;
    try {
        const parsed = JSON.parse(await file.text()); if (!Array.isArray(parsed) || parsed.length > 200) throw new Error("Choose a JSON list with no more than 200 courses.");
        const imported = parsed.map(cleanCourse); const codes = imported.map(c => c.code);
        if (new Set(codes).size !== codes.length) throw new Error("The file contains duplicate course codes.");
        courses = imported; saveCourses(); renderAll(); status("Courses loaded from file.", "success");
    } catch (error) { status(error.message || "Could not read that course file.", "error"); }
    event.target.value = "";
});

const defaultAnnouncements = [
    {title:"Check your course portal", body:"Use your official learning portal and lecturer announcements for current dates and instructions.", date:"Ongoing reminder"},
    {title:"Plan a weekly study session", body:"Set aside time to review notes and practise before assessment deadlines arrive.", date:"Personal study tip"}
];
function loadList(key, fallback) { try { const data = JSON.parse(localStorage.getItem(key)); return Array.isArray(data) ? data : fallback; } catch (error) { return fallback; } }
function renderAnnouncements() {
    const items = loadList("techKnowAnnouncements", defaultAnnouncements); const target = byId("announcement-list"); target.replaceChildren();
    items.forEach(a => { const card = node("article", "announcement-card"); card.append(node("time", "", a.date), node("h3", "", a.title), node("p", "", a.body)); target.appendChild(card); });
}
byId("announcement-form").addEventListener("submit", event => {
    event.preventDefault(); try {
        const items = loadList("techKnowAnnouncements", defaultAnnouncements);
        items.unshift({title:byId("announcement-title").value.trim(), body:byId("announcement-body").value.trim(), date:byId("announcement-date").value.trim()});
        localStorage.setItem("techKnowAnnouncements", JSON.stringify(items.slice(0, 30))); renderAnnouncements(); event.currentTarget.reset(); byId("admin-status").textContent = "Announcement saved in this browser.";
    } catch (error) { byId("admin-status").textContent = "Could not save this announcement in browser storage."; }
});
const LABS = [
    ["Password strength check", "Learn passphrases and password hygiene.", ["Compare length and uniqueness in sample passwords you invent.", "Turn on multi-factor authentication on your own account.", "Never paste real credentials into a practice tool."]],
    ["Spot the phishing clues", "Practise safe email inspection without opening links.", ["Review a fictional message for sender, urgency, and mismatched URLs.", "Write down two clues that make it suspicious.", "Report suspicious messages through your organisation's process."]],
    ["File integrity basics", "See how a hash can help detect file changes.", ["Create a harmless text file on your device.", "Use a trusted local SHA-256 utility to calculate its hash.", "Change one character and compare the new hash."]]
];
function renderLabs() { const target = byId("lab-list"); target.replaceChildren(); LABS.forEach(([title, desc, steps]) => { const card = node("article", "lab-card"); card.append(node("h3", "", title), node("p", "", desc)); const list=node("ul"); steps.forEach(s=>list.appendChild(node("li","",s))); card.appendChild(list); target.appendChild(card); }); }
function renderPosts() { const posts=loadList("techKnowPosts",[]); const target=byId("community-posts"); target.replaceChildren(); posts.slice(0,20).forEach(p=>{const card=node("article","community-post");card.append(node("strong","",p.name),node("p","",p.message),node("small","",p.date));target.appendChild(card);}); }
byId("community-form").addEventListener("submit", event=>{event.preventDefault();try{const posts=loadList("techKnowPosts",[]);posts.unshift({name:byId("community-name").value.trim(),message:byId("community-message").value.trim(),date:new Date().toLocaleDateString()});localStorage.setItem("techKnowPosts",JSON.stringify(posts.slice(0,50)));event.currentTarget.reset();byId("community-status").textContent="Posted locally in this browser.";renderPosts();}catch(error){byId("community-status").textContent="Could not save the post in browser storage.";}});
byId("theme-toggle").addEventListener("click",()=>{document.body.classList.toggle("dark-mode");const dark=document.body.classList.contains("dark-mode");localStorage.setItem("techKnowTheme",dark?"dark":"light");byId("theme-toggle").textContent=dark?"☀":"☾";});
try { if(localStorage.getItem("techKnowTheme")==="dark"){document.body.classList.add("dark-mode");byId("theme-toggle").textContent="☀";} } catch(error) { console.warn("Theme preference is not available.",error); }
renderAnnouncements(); renderLabs(); renderPosts(); renderAll();
