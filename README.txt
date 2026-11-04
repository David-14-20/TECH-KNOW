TECH-KNOW — STUDENT LEARNING HUB
================================

Run the site
------------
1. Extract this ZIP to a folder.
2. Open a terminal in that folder and run: py -m http.server 8000
   If Python is unavailable, use: npx http-server -p 8000
3. Visit http://localhost:8000 in a browser. Stop the server with Ctrl+C.
The site uses plain HTML, CSS, JavaScript, and localStorage; no installation or account is required.

What is included
----------------
- Responsive course catalogue and course overview cards.
- Add, view, search, remove, and total courses in the course manager.
- Browser storage plus JSON file export and import for course lists.
- Dark/light appearance preference.
- Five confirmed course resources (COS 201 material and lab manual, COS 203 material and guide, CYB 203 material, ENT 211 guide), plus eight additional PDFs from the starter archive labelled as supplied COS 201 PDFs.
- Example announcements, local discussion posts, and three safe beginner cybersecurity exercises.
- Assignment report: ASSIGNMENT-REPORT.md.

Course data and units
---------------------
The nine included course entries are editable demonstration data. Most unit values have not been verified against official registration records. ENT 211 is listed as 2 units according to its guide. Confirm all other values with the official course registration or guide before relying on totals.

Add courses
-----------
Use My Course Manager in the page, or open script.js and add an entry to STARTERS. New entries can also be saved and loaded as tech-know-courses.json. Data is stored only in the browser profile that opened the site; use Save courses to file for a portable backup.

Add course PDFs
---------------
1. Put the PDF in materials/ with a short filename, for example cos-205-notes.pdf.
2. In script.js, add a file and display label to the MATERIALS object under the matching course code, for example: ["materials/cos-205-notes.pdf", "Lecture notes"].
3. For a new course, add its code/title/units/category in STARTERS too if it should appear on first launch.
4. Keep the unit value clearly marked as a demo until it is verified.

Announcements and community
---------------------------
The announcement editor and community board store items in this browser only. Posts are not shared with other students. The site has no server, user accounts, moderation service, or secure admin authentication. Do not enter sensitive or personal information. A deployed, multi-user version needs a backend with authenticated admin roles and a shared database.

Cybersecurity practice
----------------------
Exercises are intended for safe, local learning. Only test systems and accounts you own or have permission to use.
