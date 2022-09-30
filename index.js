require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());

const cors = require("cors");
app.use(cors());

const videoRouter = require("./routes/videos");

const PORT = process.env.PORT || 8080;

app.use("/videos", videoRouter);

app.get("/", (_request, response) => {
  response.status(200).send("<h1>Hello there!</h1>");
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
