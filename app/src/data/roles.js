const permissions = require("./permissions");

const roleNames = {
  admin: "admin",
  manager: "manager",
  staff: "staff",
  supplier: "supplier",
};

const roles = [
  {
    name: roleNames.superAdmin,
    permissions: [],
  },
  {
    name: roleNames.centerAdmin,
    permissions: [
      permissions.createStock,
      permissions.updateStock,
      permissions.deleteStock,
    ],
  },
  {
    name: roleNames.seller,
    permissions: [
      permissions.createStock,
      permissions.updateStock,
      permissions.deleteStock,
    ],
  },
  {
    name: roleNames.user,
    permissions: [],
  },
];

module.exports = { roles, roleNames };
