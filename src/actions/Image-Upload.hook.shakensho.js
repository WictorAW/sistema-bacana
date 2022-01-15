
const path = require('path')
const fs = require('fs')
const AdminBro = require('admin-bro')

// AQUI FAZ O UPLOAD DA IMAGEM

/** @type { AdminBro.After<AdminBro.ActionResponse> } */
const after = async ( response, request, context ) => {
  const { record, shakensho, fotoDoCarro, shupinhyo } = context;

  if(record.isValid() && shakensho) {
    const filePath = path.join('uploads', record.id().toString(), shakensho.name)
    await fs.promises.mkdir(path.dirname(filePath), {recursive: true})
    await fs.promises.rename(shakensho.path, filePath)
    await record.update({ imagens_shakensho: `/${filePath}`  })
  }
  if(record.isValid() && fotoDoCarro) {
    const filePath = path.join('uploads', record.id().toString(), fotoDoCarro.name)
    await fs.promises.mkdir(path.dirname(filePath), {recursive: true})
    await fs.promises.rename(fotoDoCarro.path, filePath)
    await record.update({ imagens_fotoDoCarro: `/${filePath}`  })
  } 
  if(record.isValid() && shupinhyo) {
    const filePath = path.join('uploads', record.id().toString(), shupinhyo.name)
    await fs.promises.mkdir(path.dirname(filePath), {recursive: true})
    await fs.promises.rename(shupinhyo.path, filePath)
    await record.update({ imagens_shupinhyo: `/${filePath}`  })
  } 
  
  return response;
};

/** @type { AdminBro.Before } */
const before = async (request, context) => {
  if(request.method === 'post'){
    const { shakensho, fotoDoCarro, shupinhyo, ...otherParams } = request.payload;

    // eslint-disable-next-line no-param-reassign
    context.shakensho = shakensho;
    context.fotoDoCarro = fotoDoCarro;
    context.shupinhyo = shupinhyo;
    
    return {
      ...request,
      payload: otherParams
    };
  }
  return request
};

module.exports = { after, before }