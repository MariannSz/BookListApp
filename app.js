// Book Class: represents a book
class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}


// UI Class: Handle UI tasks

class UI {
	static displayBooks() { // static methods can be called withour class instantiation

		const books = Store.getBooks();

		books.forEach((book) => UI.addBookToList(book));
	}

	static addBookToList(book) {
		const list = document.querySelector('#book-list'); //get the element with id 'book-list'

		const row = document.createElement('tr');

		row.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
		`;

		list.appendChild(row);
	}

	static deleteBook(target) { //if a class is included 
		if (target.classList.contains('delete')) {
			target.parentElement.parentElement.remove(); // event propagation, specified what exactly should be deleted
		} 
	}

	static showAlert(message, className) {
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message)); //create the content of the div
		const container = document.querySelector('.container');
		const form = document.querySelector('#book-form');
		container.insertBefore(div, form); //insert the div before the form
		// Vanish in 3 seconds
		setTimeout(() => document.querySelector('.alert').remove(), 3000); //first arg is the funtion, 2nd is the duration
	}

	// static clearFields() { // this happens automatically now, no need to implement
	// 	document.querySelector('#title').value = '';
	// 	document.querySelector('#author').value = '';
	// 	document.querySelector('#isbn').value = '';
	// }
}

// Store Class: Handles Storage
class Store { // we can't store objects in local storage,
//we have to stringify it
//and when we pull it out, we have to parse it
	static getBooks() {
		let books;
		if (localStorage.getItem('books') === null) { // if there's no item in books, method comes with local storage
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books')); // bc it's stored as a string
		}
		return books;
	}

	static addBook(book) {
		const books = Store.getBooks();

		books.push(book);

		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBook(isbn) {
		const books = Store.getBooks();

		books.forEach((book, index) => {
			if (book.isbn === isbn) {
				books.splice(index, 1); // at the current index remove 1 item
			}
		});

		localStorage.setItem('books', JSON.stringify(books));
	}
}

// Event: Display a Book
document.addEventListener('DOMContentLoaded', UI.displayBooks); // call display books upon loading the page

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (event) => {
	
	// preventing it from actually submitting
	event.preventDefault(); 

	// get form values
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const isbn = document.querySelector('#isbn').value;

	// Validate if fields are filled in
	if (title === '' || author === '' || isbn === '' ) {
		UI.showAlert('Please fill in all fields', 'danger'); //success makes it green, info makes it blue
	} else {
		// instatiate book
		const book = new Book(title, author, isbn);

		// Add Book to UI
		UI.addBookToList(book);

		// Add book to Store
		Store.addBook(book);

		// Show success message
		UI.showAlert('Book Added', 'success');

		// Clear Fields
		// UI.clearFields(); // this happens automatically now, no need to implement
	}

})

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (event) => {
	// Remove book from UI
	UI.deleteBook(event.target);

	//Remove book from the store
	Store.removeBook(event.target.parentElement.previousElementSibling.textContent); //getting the isbn

	// Show success message
	UI.showAlert('Book Removed', 'success');
});