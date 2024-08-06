document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const bookList = document.getElementById('list');
    const bookIdField = document.getElementById('bookId');
    const quoteField = document.getElementById('quote');

    const quotes = [
        "Success is the sum of small efforts, repeated day in and day out.",
        "Progress is progress, no matter how small.",
        "The only way to achieve the impossible is to believe it is possible.",
        "You are never too old to set another goal or to dream a new dream."
    ];

    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    function createBookElement(book) {
        const li = document.createElement('li');
        li.className = book.favorite ? 'favorite' : '';

        const coverImg = book.coverImage ? `<img src="${book.coverImage}" alt="${book.title}" class="cover-img">` : '';
        
        li.innerHTML = `
            ${coverImg}
            <div class="book-info">
                <h3>${book.title || 'N/A'}</h3>
                <p><strong>Author:</strong> ${book.author || 'N/A'}</p>
                <p><strong>Type:</strong> ${book.type || 'N/A'}</p>
                <p><strong>Total Pages:</strong> ${book.totalPages || 'N/A'}</p>
                <p><strong>Current Page:</strong> ${book.currentPage || 'Not Set'}</p>
                <p><strong>Progress:</strong> ${book.totalPages ? book.progressPercent + '%' : 'N/A'}</p>
                <p><strong>Summary:</strong> ${book.summary || 'N/A'}</p>
                <p><strong>Purpose of Reading:</strong> ${book.purpose || 'N/A'}</p>
                <p><strong>Expected Learnings:</strong> ${book.learnings || 'N/A'}</p>
                <p><strong>Favorite:</strong> ${book.favorite ? 'Yes' : 'No'}</p>
                <button class="edit" data-id="${book.id}">Edit</button>
                <button class="delete" data-id="${book.id}">Delete</button>
            </div>
        `;

        return li;
    }

    function loadBooks() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        bookList.innerHTML = '';
        books.forEach(book => {
            bookList.appendChild(createBookElement(book));
        });
        quoteField.textContent = getRandomQuote();
    }

    function saveBook(book) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const existingIndex = books.findIndex(b => b.id === book.id);
        if (existingIndex > -1) {
            books[existingIndex] = book;
        } else {
            books.push(book);
        }
        localStorage.setItem('books', JSON.stringify(books));
        loadBooks();
    }

    function deleteBook(id) {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        const updatedBooks = books.filter(book => book.id !== id);
        localStorage.setItem('books', JSON.stringify(updatedBooks));
        loadBooks();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = bookIdField.value || Date.now().toString();
        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const type = document.getElementById('type').value.trim();
        const totalPages = document.getElementById('totalPages').value.trim();
        const currentPage = document.getElementById('currentPage').value.trim();
        const summary = document.getElementById('summary').value.trim();
        const favorite = document.getElementById('favorite').checked;
        const coverImage = document.getElementById('coverImage').files[0];
        const purpose = document.getElementById('purpose').value.trim();
        const learnings = document.getElementById('learnings').value.trim();

        const progressPercent = totalPages ? Math.round((currentPage / totalPages) * 100) : 0;
        const coverImageURL = coverImage ? URL.createObjectURL(coverImage) : '';

        const book = {
            id,
            title,
            author,
            type,
            totalPages,
            currentPage,
            summary,
            favorite,
            coverImage: coverImageURL,
            purpose,
            learnings,
            progressPercent
        };

        saveBook(book);
        form.reset();
        bookIdField.value = '';
    });

    bookList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const id = e.target.dataset.id;
            deleteBook(id);
        } else if (e.target.classList.contains('edit')) {
            const id = e.target.dataset.id;
            const books = JSON.parse(localStorage.getItem('books')) || [];
            const book = books.find(b => b.id === id);

            if (book) {
                document.getElementById('bookId').value = book.id;
                document.getElementById('title').value = book.title || '';
                document.getElementById('author').value = book.author || '';
                document.getElementById('type').value = book.type || '';
                document.getElementById('totalPages').value = book.totalPages || '';
                document.getElementById('currentPage').value = book.currentPage || '';
                document.getElementById('summary').value = book.summary || '';
                document.getElementById('favorite').checked = book.favorite || false;
                document.getElementById('purpose').value = book.purpose || '';
                document.getElementById('learnings').value = book.learnings || '';
            }
        }
    });

    loadBooks();
});
