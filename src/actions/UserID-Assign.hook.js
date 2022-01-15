const AdminBro = require('admin-bro');

/** @type {AdminBro.Before} */
const before = async (request, currentAdmin ) => {
  request.payload = {
    ...request.payload,
    userID: currentAdmin._id
  }; return request
};

module.exports = before