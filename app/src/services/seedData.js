const permissions = require("../data/permissions");
const { roles } = require("../data/roles");
// const {
//   createBulkPermissionsIfEmpty,
//   getPermissions,
// } = require("./permissionServices");
// const { insertOrUpdateRoles } = require("./roleServices");

// Function to seed data
const seedData = async () => {
  try {
    // Create an array of permission objects using the values from the permissions module
    const permissionsList = Object.values(permissions).map((permission) => ({
      name: permission,
    }));

    // Create bulk permissions if the permissions collection is empty
    await createBulkPermissionsIfEmpty(permissionsList);

    // Retrieve the permissions from the database
    const permissionsObjs = await getPermissions();

    // Create role objects by mapping over the roles array
    const roleObjs = roles.map((role) => ({
      ...role,
      permissions: permissionsObjs
        .filter((permission) => role.permissions.includes(permission.name)) // Filter permissions based on role's permissions
        .map((permission) => permission._id), // Map filtered permissions to their respective _id values
    }));

    // Insert or update the roles in the database
    await insertOrUpdateRoles(roleObjs);
  } catch (error) {
    console.log(error);
  }
};

module.exports = seedData;
