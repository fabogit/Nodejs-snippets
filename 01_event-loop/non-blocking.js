console.log('Before non-blocking operation');
// Non-blocking operation (setTimeout)
setTimeout(() => {
	// Simulate a non-blocking operation that takes 2seconds;
	console.log('Non-blocking operation completed');
}, 2000);

console.log('After non-blocking operation');

// Before non-blocking operation
// After non-blocking operation
// Non-blocking operation completed