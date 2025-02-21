const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Node.js App with Docker, Jenkins, ArgoCD & K8s!</h1>");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
