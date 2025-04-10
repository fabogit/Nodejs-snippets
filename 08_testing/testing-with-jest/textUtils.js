/**
 * @param {string} str
 * @returns {string}
 */
function lowercase(str) {
	return str.toLowerCase();
}

/**
 * @param {string} str
 * @returns {string}
 */
function uppercase(str) {
	return str.toUpperCase();
}

/**
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = { lowercase, uppercase, capitalize };