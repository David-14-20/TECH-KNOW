TECH-KNOW STUDENT COURSE MANAGEMENT MINI-SYSTEM
Assignment implementation report

Project overview
Tech-Know is a responsive course and learning hub built with HTML, CSS, and JavaScript. Its course manager implements the Student Course Management mini-system through a graphical interface. The nine initial course entries are editable starter data; most unit values remain unverified and are shown as demonstrations. ENT 211 is shown as 2 units based on its supplied guide.

Requirements and implementation
- Classes and objects: the Course class creates course objects with normalized codes, titles, units, and categories.
- Methods and string processing: Course.matches() searches the normalized code and title. Codes are trimmed and converted to uppercase; titles are trimmed before saving.
- Add and view courses: the form validates required fields and whole-number units, prevents duplicate codes, and renders the course catalogue and course list.
- Search: students can search their courses by code or title; blank searches and no-match results receive clear messages.
- Total units: the interface displays course count and a recursive sum of course units.
- Save and load: the browser stores the course list in localStorage. JSON export and import provide portable file-based saving/loading. Imported records are validated; malformed JSON, invalid fields, duplicates, and unavailable storage are handled with messages.
- Decision logic and loops: form handlers use conditional validation and event-driven interface actions; loops render course cards, materials, announcements, labs, and discussion posts.
- Recursion: sumUnitsRecursively() totals the units, with a base case for the end of the course list.
- Exceptions and invalid input: JSON parsing, browser storage, imports, and data validation use try/catch and user-facing feedback.
- Organized interface: the mobile-friendly site includes course catalogue, downloadable course resources, announcements, safe beginner cybersecurity activities, and a local discussion board. Dark/light preference is saved in the browser.

Materials and operation
The project includes supplied PDFs for COS 201, COS 203, CYB 203, and ENT 211. Open README.txt for local server instructions, course editing, and adding further PDFs. The site is a static prototype: announcements and discussion posts are local to one browser and are not shared online. Its content editor is not protected by trusted-admin authentication; a production multi-user service requires a server, authenticated roles, and shared storage.

Conclusion
The project demonstrates the required course-management operations and the requested Tech-Know learning hub features in a self-contained web interface. It should be run through a local web server for consistent browser file import/export behavior. Students should confirm unverified starter unit values with official course records before relying on the total.
