console.log("What is your name?");
process.stdin.on("data", (data) => {
	// processing on each data event
	const name = data.toString().trim();
	if (name !== "") {
		process.stdout.write(`Hello ${name}!\n`);
	} else {
		process.stderr.write("Input was empty.\n");
	}
});