console.log('Start');

process.nextTick(() => {
	console.log('Callback scheduled with process.nextTick #1');
});

setTimeout(() => {
	console.log('setTimeout #1 callback');
}, 0);

process.nextTick(() => {
	console.log('Callback scheduled with process.nextTick #2');
});

console.log('End');

// Start
// End
// Callback scheduled with process.nextTick #1
// Callback scheduled with process.nextTick #2
// setTimeout #1 callback