const express = require("express");
const app = express();
const cors = require("cors");
const printBill = require("./printer");
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Local Print Server Ready");
});
app.post("/", (req, res) => {
  printBill(req.body);
  res.send("Accepted Print");
});

// error handler
app.use(function (err, req, res, next) {
  res.status(200).json({
    error: true,
    status: err.status || 500,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
