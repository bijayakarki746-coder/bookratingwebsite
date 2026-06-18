const defaultBooks = [
    { id: 1, title: "The Master and Margarita", author: "Mikhail Bulgakov", genre: "Satirical Fiction", rating: 5, year: 1967, dateRead: "March 2026", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400", synopsis: "The Devil visits Soviet Moscow in the 1930s, accompanied by a retinue of demons, and causes havoc for the city's literary establishment. Intertwined is the story of Pontius Pilate and his encounter with Yeshua Ha-Notzri.", quote: "“Cowardice is the greatest sin.”", context: "Spoken by Yeshua Ha-Notzri to Pontius Pilate — a line that echoes through every page of the novel.", review: "One of the most astonishing novels I have ever read. Bulgakov's wit is surgical; his imagination is boundless. The Moscow chapters made me laugh aloud; the Jerusalem chapters silenced me completely." },
    { id: 2, title: "Stoner", author: "John Williams", genre: "Literary Fiction", rating: 5, year: 1965, dateRead: "January 2026", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400", synopsis: "William Stoner enters the University of Missouri as an agriculture student but falls in love with literature instead, leading to a quiet life as an undistinguished professor.", quote: "“It was a passion neither of the mind nor of the heart...”", context: "Reflecting on his love of teaching and scholarship.", review: "A beautiful, masterfully written novel about an ordinary life." },
    { id: 3, title: "Invisible Cities", author: "Italo Calvino", genre: "Philosophical Fiction", rating: 5, year: 1972, dateRead: "November 2023", cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=400", synopsis: "An imaginary conversation between explorer Marco Polo and the aging emperor Kublai Khan about various fictional cities.", quote: "“Cities, like dreams, are made of desires and fears...”", context: "Marco Polo detailing his journeys.", review: "Poetic, hypnotic, and endlessly shifting. A work of art." },
    { id: 4, title: "The Remains of the Day", author: "Kazuo Ishiguro", genre: "Literary Fiction", rating: 4, year: 1989, dateRead: "September 2023", cover: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=400", synopsis: "An elderly English butler recalls his life and service during the war while on a motoring trip.", quote: "“What is the point of worrying oneself too much about what one could or could not have done...”", context: "Stevens looking out towards the pier.", review: "A tragic, perfectly executed study of loyalty and missed opportunities." },
    { id: 5, title: "Piranesi", author: "Susanna Clarke", genre: "Fantasy", rating: 4, year: 2020, dateRead: "July 2023", cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400", synopsis: "Piranesi lives in 'The House'—an endless labyrinth of rooms containing thousands of statues, where an ocean is imprisoned.", quote: "“The Beauty of the House is immeasurable; its Kindness is infinite.”", context: "Piranesi journaling his regular rounds.", review: "Wonderfully eerie, imaginative, and deeply comforting." },
    { id: 6, title: "Giovanni's Room", author: "James Baldwin", genre: "Literary Fiction", rating: 5, year: 1956, dateRead: "May 2023", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400", synopsis: "A young American man living in Paris struggles with his identity and relationships.", quote: "“If you cannot love another person, that’s it. Smile, and walk away.”", context: "David thinking back to his room.", review: "Devastatingly moving prose. Baldwin leaves nothing unsaid." }
];

if (!localStorage.getItem('books')) {
    localStorage.setItem('books', JSON.stringify(defaultBooks));
}

let currentBooks = JSON.parse(localStorage.getItem('books'));

/* ---------------- Admin auth (client-side demo only) ----------------
   No backend here, so "login" is just a username/password check
   against constants in this file, gated behind a localStorage flag.
   It keeps casual visitors from editing entries by accident, but
   anyone with devtools can read the password or set the flag by
   hand — this is NOT real security.
------------------------------------------------------------------- */
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "readinglog2026";

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function isLoggedIn() {
    return localStorage.getItem("loggedInUser") !== null;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("loggedInUser"));
}

function isAdminLoggedIn() {
    const user = getCurrentUser();
    return user && user.role === "admin";
}

function logoutAdmin() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isAdmin");
    window.location.href = "index.html";
}

/* Shows/hides every .admin-only element and flips the nav Login/Logout link */
function applyAdminUI() {

    const adminIn = isAdminLoggedIn();

    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = adminIn ? '' : 'none';
    });

    const navLoginBtn =
        document.getElementById('nav-login-btn');

    if (!navLoginBtn) return;

    if (isLoggedIn()) {

        const user = getCurrentUser();

        navLoginBtn.textContent =
            `LOGOUT (${user.username})`;

        navLoginBtn.href = "#";

        navLoginBtn.onclick = (e) => {
            e.preventDefault();
            logoutAdmin();
        };

    } else {

        navLoginBtn.textContent = "LOGIN";
        navLoginBtn.href = "login.html";
    }
}

/* Keeps non-admins off admin.html if they land there directly via URL */
function protectAdminPage() {
    if (document.getElementById('book-form') && !isAdminLoggedIn()) {
        window.location.href = 'login.html?redirect=admin.html';
    }
}

/* Wires up the form on login.html */
function initializeLoginForm() {

    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    if (!loginForm) return;

    const loginTab = document.getElementById("login-tab");
    const signupTab = document.getElementById("signup-tab");

    if(loginTab && signupTab){

        loginTab.addEventListener("click", () => {
            loginForm.style.display = "block";
            signupForm.style.display = "none";

            loginTab.classList.add("active");
            signupTab.classList.remove("active");
        });

        signupTab.addEventListener("click", () => {
            loginForm.style.display = "none";
            signupForm.style.display = "block";

            signupTab.classList.add("active");
            loginTab.classList.remove("active");
        });
    }

    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const username =
            document.getElementById("login-username").value.trim();

        const password =
            document.getElementById("login-password").value;

        const errorEl =
            document.getElementById("login-error");

        // ADMIN LOGIN
        if (
            username === ADMIN_USERNAME &&
            password === ADMIN_PASSWORD
        ) {

            localStorage.setItem("isAdmin", "true");

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify({
                    username: "admin",
                    role: "admin"
                })
            );

            window.location.href = "index.html";
            return;
        }

        const users = getUsers();

        const user = users.find(
            u =>
                u.username === username &&
                u.password === password
        );

        if (user) {

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(user)
            );

            window.location.href = "index.html";

        } else {

            errorEl.textContent =
                "Incorrect username or password.";

            errorEl.style.display = "block";
        }
    });

    if(signupForm){

        signupForm.addEventListener("submit", (e) => {

            e.preventDefault();

            const username =
                document.getElementById("signup-username").value.trim();

            const email =
                document.getElementById("signup-email").value.trim();

            const password =
                document.getElementById("signup-password").value;

            let users = getUsers();

            const exists = users.find(
                u =>
                    u.username === username ||
                    u.email === email
            );

            if (exists) {

                document.getElementById("signup-error")
                    .textContent =
                    "User already exists";

                return;
            }

            users.push({
                username,
                email,
                password,
                role: "user"
            });

            saveUsers(users);

            alert("Signup successful. Please login.");

            signupForm.reset();

            if(loginTab) loginTab.click();
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Auth wiring runs on every page
    applyAdminUI();
    protectAdminPage();
    initializeLoginForm();

    // Page router allocations
    if (document.getElementById('books-container')) {
        renderBooksList(currentBooks);
        document.getElementById('search-input').addEventListener('input', handleSearch);
    }
    if (document.getElementById('stat-total')) {
        calculateStatsDashboard();
    }
    if (document.getElementById('book-form')) {
        initializeRatingsEngine();
        processFormPrepopulations();
    }
    if (document.getElementById('detail-title')) {
        renderDetailPage();
    }
});

/* Home List rendering engine */
function renderBooksList(booksArray) {
    const container = document.getElementById('books-container');
    if (!container) return;

    container.innerHTML = "";

    if (booksArray.length === 0) {
        container.innerHTML = `<p class="empty-state">No books match your search.</p>`;
    }

    booksArray.forEach(book => {
        const card = document.createElement('div');
        card.className = "book-card";
        card.style.cursor = "pointer";
        // Fixed: was calling an undefined "MapsToBook" function, which silently
        // broke click-through to the details page. Now calls navigateToBook.
        card.setAttribute('onclick', `navigateToBook(${book.id})`);

        let starString = "★".repeat(book.rating) + "☆".repeat(5 - book.rating);

        // Edit & Delete are only rendered for a logged-in admin; regular
        // visitors get a clean, view-only card with no management markup.
        let managementMarkup = isAdminLoggedIn() ? `
            <div class="admin-actions" onclick="event.stopPropagation();">
                <button onclick="routeToEdit(${book.id})" class="btn-sm" style="color:var(--accent-blue)">Edit</button>
                <button onclick="deleteBookEntry(${book.id})" class="btn-sm" style="color:var(--accent-red)">Delete</button>
            </div>
        ` : "";

        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${book.cover}" alt="${book.title} cover" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e'">
                <span class="genre-badge">${book.genre}</span>
            </div>
            <div class="card-content">
                <div>
                    <h3>${book.title}</h3>
                    <div class="author">${book.author}</div>
                </div>
                <div class="card-meta">
                    <span class="stars">${starString}</span>
                    <span class="date-tag">${book.dateRead || book.year}</span>
                </div>
                ${managementMarkup}
            </div>
        `;
        container.appendChild(card);
    });

    const totalCountEl = document.getElementById('total-books-count');
    const avgRatingEl = document.getElementById('avg-rating-display');
    if (totalCountEl && avgRatingEl) {
        totalCountEl.textContent = `${booksArray.length} books logged`;
        const totalStars = booksArray.reduce((acc, curr) => acc + Number(curr.rating), 0);
        const calculatedAvg = booksArray.length ? (totalStars / booksArray.length).toFixed(1) : "0.0";
        avgRatingEl.textContent = `avg rating: ${calculatedAvg} / 5`;
    }
}

/* Global Nav Routing Action handlers */
window.navigateToBook = function(id) {

    if(!isLoggedIn()) {

        alert(
            "Please login first to view book details."
        );

        window.location.href = "login.html";

        return;
    }

    window.location.href =
        `details.html?id=${id}`;
};

/* Rendering Detail Content Views */
function renderDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const book = currentBooks.find(b => b.id == id);

    if (!book) {
        document.querySelector('main').innerHTML = `<p style="text-align:center; padding: 50px 0;">Book not found. <a href="index.html">Go back home</a></p>`;
        return;
    }

    document.getElementById('detail-cover').src = book.cover;
    document.getElementById('detail-meta-genre').textContent = book.genre;
    document.getElementById('detail-meta-year').textContent = book.year;
    document.getElementById('detail-meta-pages').textContent = book.pages || "N/A";
    document.getElementById('detail-meta-dateread').textContent = book.dateRead || "N/A";

    document.getElementById('detail-top-genre').textContent = book.genre;
    document.getElementById('detail-title').textContent = book.title;
    document.getElementById('detail-author').textContent = book.author;
    document.getElementById('detail-stars').textContent = "★".repeat(book.rating) + "☆".repeat(5 - book.rating);

    document.getElementById('detail-synopsis').textContent = book.synopsis || "No synopsis available.";
    document.getElementById('detail-review').textContent = book.review || "No review written yet.";

    if (book.quote) {
        document.getElementById('detail-quote-block').style.display = "block";
        document.getElementById('detail-quote').textContent = book.quote;
        document.getElementById('detail-context').textContent = book.context || "";
    } else {
        document.getElementById('detail-quote-block').style.display = "none";
    }

    // Wire up the Edit/Delete buttons on the details page itself
    const editBtn = document.getElementById('detail-edit-btn');
    const deleteBtn = document.getElementById('detail-delete-btn');
    if (editBtn) {
        editBtn.onclick = () => routeToEdit(book.id);
    }
    if (deleteBtn) {
        deleteBtn.onclick = () => deleteBookEntry(book.id, true);
    }

    document.title = `${book.title} — My Reading Log`;
}

/* Filtering System */
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const filtered = currentBooks.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query)
    );
    renderBooksList(filtered);
}

/* Dashboard calculation calculations */
function calculateStatsDashboard() {
    const total = currentBooks.length;
    const fiveStars = currentBooks.filter(b => b.rating === 5).length;
    const totalStars = currentBooks.reduce((acc, curr) => acc + Number(curr.rating), 0);
    const average = total ? (totalStars / total).toFixed(1) : "0.0";

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-five-star').textContent = fiveStars;
    document.getElementById('stat-avg').textContent = average;
}

/* Interactive Form Ratings Engine */
function initializeRatingsEngine() {
    const stars = document.querySelectorAll('.star-btn');
    const ratingInput = document.getElementById('book-rating');
    if (!ratingInput) return;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const selectedVal = star.getAttribute('data-val');
            ratingInput.value = selectedVal;

            stars.forEach(s => {
                if (s.getAttribute('data-val') <= selectedVal) s.classList.add('selected');
                else s.classList.remove('selected');
            });
        });
    });
}

function processFormPrepopulations() {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    const form = document.getElementById('book-form');
    if (!form) return;

    if (editId) {
        document.getElementById('form-title').textContent = "Modify book entry";
        document.getElementById('submit-btn').textContent = "SAVE CHANGES";

        const existingBook = currentBooks.find(b => b.id == editId);
        if (existingBook) {
            document.getElementById('book-id').value = existingBook.id;
            document.getElementById('book-title').value = existingBook.title;
            document.getElementById('book-author').value = existingBook.author;
            document.getElementById('book-genre').value = existingBook.genre;
            document.getElementById('book-year').value = existingBook.year;
            document.getElementById('book-pages').value = existingBook.pages || 0;
            document.getElementById('book-cover').value = existingBook.cover || "";
            document.getElementById('book-dateread').value = existingBook.dateRead || "";
            document.getElementById('book-synopsis').value = existingBook.synopsis || "";
            document.getElementById('book-quote').value = existingBook.quote || "";
            document.getElementById('book-context').value = existingBook.context || "";
            document.getElementById('book-review').value = existingBook.review || "";

            document.getElementById('book-rating').value = existingBook.rating;
            document.querySelectorAll('.star-btn').forEach(s => {
                if (s.getAttribute('data-val') <= existingBook.rating) s.classList.add('selected');
            });
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const idValue = document.getElementById('book-id').value;
        const bookPayload = {
            id: idValue ? Number(idValue) : Date.now(),
            title: document.getElementById('book-title').value,
            author: document.getElementById('book-author').value,
            genre: document.getElementById('book-genre').value,
            year: Number(document.getElementById('book-year').value),
            pages: Number(document.getElementById('book-pages').value),
            cover: document.getElementById('book-cover').value || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
            dateRead: document.getElementById('book-dateread').value,
            synopsis: document.getElementById('book-synopsis').value,
            quote: document.getElementById('book-quote').value,
            context: document.getElementById('book-context').value,
            review: document.getElementById('book-review').value,
            rating: Number(document.getElementById('book-rating').value) || 5
        };

        if (idValue) {
            currentBooks = currentBooks.map(b => b.id === bookPayload.id ? bookPayload : b);
        } else {
            currentBooks.unshift(bookPayload);
        }

        localStorage.setItem('books', JSON.stringify(currentBooks));
        window.location.href = 'index.html';
    });
}

window.routeToEdit = function(id) {
    window.location.href = `admin.html?edit=${id}`;
};

window.deleteBookEntry = function(id, redirectHome) {
    if (confirm("Are you sure you want to delete this book record?")) {
        currentBooks = currentBooks.filter(b => b.id !== id);
        localStorage.setItem('books', JSON.stringify(currentBooks));

        if (redirectHome) {
            // Deleting from the details page: nothing left to re-render there
            window.location.href = 'index.html';
        } else {
            renderBooksList(currentBooks);
        }
    }
};