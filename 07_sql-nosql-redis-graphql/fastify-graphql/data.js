/**
 * @typedef {object} Author
 * @property {string} id - The unique identifier of the author.
 * @property {string} name - The name of the author.
 */

/**
 * @type {Author[]}
 */
const authors = [
	{ id: '1', name: 'Richard Adams' },
	{ id: '2', name: 'George Orwell' }
];

/**
 * @typedef {object} Book
 * @property {string} id - The unique identifier of the book.
 * @property {string} name - The title of the book.
 * @property {string} authorId - The ID of the author who wrote the book.
 */

/**
 * @type {Book[]}
 */
const books = [
	{ id: '1', name: 'Watership Down', authorId: '1' },
	{ id: '2', name: 'Animal Farm', authorId: '2' },
	{ id: '3', name: 'Nineteen Eighty-four', authorId: '2' }
];

/**
 * Module containing author and book data.
 * @module data
 * @property {Author[]} authors - An array of author objects.
 * @property {Book[]} books - An array of book objects.
 */
module.exports = { authors, books };