# Hashing with bcrypt

Passwords should never be stored in plain text and should instead be stored in a hashed form. Passwords
are transformed into a hashed form using a **hashing function**. Hashing functions use an algorithm to
transform a value into unrecognizable data. The transformation is one-way, meaning it’s unlikely to
be possible to determine the value from the hash. A website will validate a user’s password input by
applying the hashing function to the supplied password and comparing it to the stored hash.

Hashing is typically combined with a technique called **salting**. Salting is where a unique value, referred
to as the salt, is appended to the password before the hash is generated. This helps to protect against
brute-force attacks and makes it more difficult to crack the password.

`bcrypt` (<https://www.npmjs.com/package/bcrypt>) is a popular module that’s used to
hash passwords in Node.js

Run the program with the following command. You should expect a unique hash to be generated:

```Bash
$ node hash.js 'badpassword'
$2b$10$7/156fF/0lyqzB2pxHQJE.czJj5xZjN3N8jofXUxXi.UG5X3KAzDO
```

Run the `validate-password.js` program. The first argument should be the same password
you supplied to the `hash.js` program. The second argument should be the hash that your
`hash.js` program created:

```Bash
$ node validate-password.js 'badpassword' '$2b$10$7/156fF/0lyqzB2pxHQJE.czJj5xZjN3N8jofXUxXi.UG5X3KAzDO'
true
```

Note that the argument values should be wrapped in single quotes to ensure the literal values
are preserved.

This demonstrates how we can use the bcrypt module to create a hash, as well as how to validate a
value against an existing hash.
