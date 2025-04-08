const { authors, books } = require('./data');

/**
 * @typedef {import('./data').Author} Author
 * @typedef {import('./data').Book} Book
 */

/**
 * Defines the resolvers for the GraphQL schema.
 * @type {object}
 */
const resolvers = {

	/**
	 * Resolvers for root query fields.
	 * @type {object}
	 */
	Query: {
		/**
		 * Resolves the 'books' query.
		 * @returns {Book[]} - An array of all books.
		 */
		books: () => books,
		/**
		 * Resolves the 'authors' query.
		 * @returns {Author[]} - An array of all authors.
		 */
		authors: () => authors
	},

	/**
	 * Resolvers for fields on the 'Book' type.
	 * @type {object}
	 */
	Book: {
		/**
		 * Resolves the 'author' field for a book.
		 * @param {Book} parent - The parent book object.
		 * @returns {Author | undefined} - The author of the book, or undefined if not found.
		 */
		author: (parent) => authors.find(author => author.id === parent.authorId)
	},

	/**
	 * Resolvers for fields on the 'Author' type.
	 * @type {object}
	 */
	Author: {
		/**
		 * Resolves the 'books' field for an author.
		 * @param {Author} parent - The parent author object.
		 * @returns {Book[]} - An array of books written by the author.
		 */
		books: (parent) => books.filter(book => book.authorId === parent.id)
	}

};

/**
 * Module containing the GraphQL resolvers.
 * @module resolvers
 * @property {object} resolvers - The object containing all the GraphQL resolvers.
 */
module.exports = { resolvers };