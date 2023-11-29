const app = require('./app');

const port = process.env.API_PORT || 4000;

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
