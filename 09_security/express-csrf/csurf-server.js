const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const csurf = require('csurf');

const csrf = csurf();
const app = express();

const mockUser = {
	username: 'user',
	password: 'badpassword',
	email: 'user@example.com'
};

app.use(
	session({
		secret: 'Node Cookbook',
		name: 'SESSIONID',
		resave: false,
		saveUninitialized: false,
		cookie: { sameSite: true }
	})
);

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	if (req.session.user) return res.redirect('/account');
	res.send(`
    <h1>Social Media Account - Login</h1>
    <form method="POST" action="/">
      <label> Username <input name=username> </label>
      <label> Password <input name=password type=password> </label>
      <input type=submit>
    </form>
  `);
});

app.post('/', (req, res) => {
	if (
		req.body.username === mockUser.username &&
		req.body.password === mockUser.password
	) {
		req.session.user = req.body.username;
	}
	if (req.session.user) res.redirect('/account');
	else res.redirect('/');
});

/** We generate and inject csrfToken using the req.csrfToken()
method of the request object. We inject the token into the HTML template as a hidden field
named _csrf. The csrf middleware looks for a token with that name. */
app.get('/account', csrf, (req, res) => {
	if (!req.session.user) return res.redirect('/');
	res.send(`
      <h1>Social Media Account - Settings</h1>
      <p> Email: ${mockUser.email} </p>
      <form method="POST" action=/update>
        <input type=hidden name=_csrf value="${req.csrfToken()}">
        <input name=email value="${mockUser.email}">
        <input type=submit value=Update >
      </form>
    `);
});

/** Upon an HTTP POST request, the csrf middleware will check the body of a request for the
token stored in the _csrf field. The middleware then validates the supplied token with the
token stored in the user’s session. */
app.post('/update', csrf, (req, res) => {
	if (!req.session.user) return res.sendStatus(403);
	mockUser.email = req.body.email;
	res.redirect('/');
});

app.listen(3000, () => {
	console.log('Server listening on port 3000');
});