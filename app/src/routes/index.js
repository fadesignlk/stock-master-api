const { Router } = require("express");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");
const brandRoutes = require("./brandRoutes");
const supplierRoutes = require("./supplierRoutes");
const productRoutes = require("./productRoutes");
const locationRoutes = require("./locationRoutes");
const stockRoutes = require("./stockRoutes");
const customerRoutes = require("./customerRoutes");
const purchaseOrderRoutes = require("./purchaseOrderRoutes");
const saleRoutes = require("./saleRoutes");

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/auth", authRoutes);
routes.use("/category", categoryRoutes);
routes.use("/brand", brandRoutes);
routes.use("/supplier", supplierRoutes);
routes.use("/product", productRoutes);
routes.use("/location", locationRoutes);
routes.use("/stock", stockRoutes);
routes.use("/customer", customerRoutes);
routes.use("/purchaseOrder", purchaseOrderRoutes);
routes.use("/sale", saleRoutes);

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
