const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const port = process.env.PORT;
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Database Connected Successfully!");
  })
  .catch(err => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`App running on http://127.0.0.1:${port}`);
});
