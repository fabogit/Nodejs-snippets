/**
 * Rounds a number to a specified precision.
 * @param {number} number - The number to round.
 * @param {number} precision - The number of decimal places to round to.
 * @returns {number} The rounded number.
 */
export function round(number, precision) {
	const factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
}