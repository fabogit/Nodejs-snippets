/**
 * Represents the mathematical constant PI (approximately 3.14159).
 * @constant
 * @type {number}
 */
const PI = Math.PI;

/**
 * Calculates the area of a circle given its radius.
 * @param {number} radius - The radius of the circle.
 * @returns {number} The area of the circle.
 */
function area(radius) {
	return PI * radius * radius;
}

/**
 * Calculates the circumference of a circle given its radius.
 * @param {number} radius - The radius of the circle.
 * @returns {number} The circumference of the circle.
 */
function circumference(radius) {
	return 2 * PI * radius;
}

// default export statement for the main function
export default area;
// Named export
export { circumference };