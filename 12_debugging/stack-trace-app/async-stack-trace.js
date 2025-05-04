// This script contains an asynchronous function, foo(), that awaits a function named bar().
// The bar() function automatically resolves Promise and then throws an error.

foo().then(
	() => console.log('success'),
	(error) => console.error(error.stack)
);

async function foo() {
	await bar();
}
3.;

async function bar() {
	await Promise.resolve();
	throw new Error('Fail');
}