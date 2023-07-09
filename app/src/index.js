const Env = require("./configs/env");
const express = require("express");
const colors = require("colors");
const cors = require("cors");
const {
  errorHandler,
  errorConverter,
  notFoundErrorHandler,
} = require("./middlewares/errorMiddleware");
const connectDB = require("./configs/db");
const port = Env.port;
const cookieParser = require("cookie-parser")
const routes = require("./routes");
const seedData = require("./services/seedData");

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())

app.use("/api/app", routes);

app.use(notFoundErrorHandler);
app.use(errorConverter);
app.use(errorHandler);

connectDB().then(async () => {
  // await seedData();
  app.listen(port, () => console.log(`Server started on port ${port}`));
});
