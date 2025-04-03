/**
 * Calculates the area of a rectangle given its length and width.
 * @param {number} length - The length of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @returns {number} The area of the rectangle.
 */
function area(length, width) {
	return length * width;
}

/**
 * Calculates the perimeter of a rectangle given its length and width.
 * @param {number} length - The length of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @returns {number} The perimeter of the rectangle.
 */
function perimeter(length, width) {
	return 2 * (length + width);
}

// Named exports
export { area, perimeter };