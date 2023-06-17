const { Router } = require("express");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/auth", authRoutes);

routes.post("/test", (req, res) => {
  sendMessage(req.body)
    .catch(console.log)
    .finally(() => {
      res.send("done");
    });
});

routes.get('/test', (req, res) => {
  res.send('Stock Master REST API...');
});


module.exports = routes;
