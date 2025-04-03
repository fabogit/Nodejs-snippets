import circleArea, { circumference } from './circle.js';
import * as rectangle from './rectangle.js';
import { round } from './mathUtils.js';

/**
 * Calculates and logs the area and circumference of a circle given its radius.
 * @param {number} radius - The radius of the circle.
 * @returns {void}
 */
function calculateCircleMetrics(radius) {
	console.log(`Circle with radius ${radius}:`);
	console.log(`Area: ${round(circleArea(radius), 2)}`);
	console.log(`Circumference: ${round(circumference(radius), 2)}`);
}

/**
 * Calculates and logs the area and perimeter of a rectangle given its length and width.
 * @param {number} length - The length of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @returns {void}
 */
function calculateRectangleMetrics(length, width) {
	console.log(`\nRectangle with length ${length} and width ${width}:`);
	console.log(`Area: ${round(rectangle.area(length, width), 2)}`);
	console.log(`Perimeter: ${round(rectangle.perimeter(length, width), 2)}`);
}

calculateCircleMetrics(5);
calculateRectangleMetrics(10, 5);