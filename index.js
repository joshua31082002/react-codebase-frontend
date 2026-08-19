const express = require('express');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

if (require.main === module) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Express server listening on port ${port}`);
  });
}

module.exports = app;
