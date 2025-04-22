const express = require('express');
const app = express();
const escapeHTML = require('escape-html');

const getServiceStatus = (callback) => {
  const status = 'All systems are running.';
  callback(status);
};

app.get('/', (req, res) => {
  const { previous, lang, token } = req.query;
  getServiceStatus((status) => {
    const href = escapeHTML(`/${previous}${token}/${lang}`);
    res.send(`
      <h1>Service Status</h1>
      <div id=status>
        ${status}
      </div>
      <div>
      <a href="${href}">Back</a>
      </div>
    `);
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});