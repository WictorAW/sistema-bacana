
const path = require('path')
const fs = require('fs')
const AdminBro = require('admin-bro')

// AQUI FAZ O UPLOAD DA IMAGEM

/** @type { AdminBro.After<AdminBro.ActionResponse> } */
const after = async ( response, request, context  ) => {
  const { record } = context;


  if(record.isValid()) {
    const filePath = path.join('uploads', record.id().toString())
 
    await fs.promises.rmdir(filePath, { recursive: true, force: true });
  }
  
  return response;
};

/** @type { AdminBro.Before } */
const before = async (request) => {
  return request
};

module.exports = { after, before }