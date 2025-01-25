const { exec } = require('child_process');

const port = process.env.PORT || 8080; // Fallback to 8080 if PORT is not set
const command = `vite preview --host 0.0.0.0 --port ${port}`;

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err.message}`);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});