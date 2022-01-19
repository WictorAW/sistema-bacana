
// Database
const mongoose = require("mongoose");
//localupload
const fs = require('fs')

// Admin Bro
const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");

// Custom Actions Imports
const userIdAssign = require('./src/actions/UserID-Assign.hook')

const { 
  after: ImageUploadAfterHook, 
  before: ImageUploadBeforeHook 
} = require('./src/actions/Image-Upload.hook.shakensho')

const { 
  after: ImageDeleteAfterHook, 
  before: ImageDeleteBeforeHook 
} = require('./src/actions/Image-Delete.hook')

// Use Mongoose in AdminBro
AdminBro.registerAdapter(AdminBroMongoose);

// Resources Definintions
const User = mongoose.model('User', {
  email: {type: String, required: true},
  usuario: {type: String, required: true},
  senhaCriptografada: {type: String, required: true},
  tipo: {type: String, enum: ['admin', 'restricted'], required: true},
});

// Cars Collection
const Carros = mongoose.model('car', {
  userID: {
    type: mongoose.Types.ObjectId,
    ref: 'User',},

  Marca: String,
  Modelo: String,
  Cor: String,
  Ano: String,
  Km: String,
  Chassis: String,
  Shaken: String,
  Katashiki: String,
  GoKeta: String,
  YonKeta: String,
  Pneu: Boolean,
  Oleo: Boolean,
  Waipa: Boolean,
  Milha: Boolean,
  Pastilha: Boolean,
  Filtro: Boolean,
  Farol: Boolean,
  Lanterna: Boolean,
  LuzDeRé: Boolean,
  LuzDeFreio: Boolean,
  Bateria: Boolean,
  PortasAutomatica: Boolean,
  Retrovisor: Boolean,
  Direita: Boolean,
  Esquerda: Boolean,
  Chave: String,
  Estofado: String,
  ETC: Boolean,
  Suspenção: String,
  Cheiro: String,
  ArCondicionado: Boolean,
  Navi: String,
  Tapete: Boolean,
  DriveRecord: String,
  CameraDeRé:Boolean,
  AntiRadar: String,
  Bluetooth:Boolean,
  Som: String,
  TV: Boolean,
  Volante: String,
  Cambio: String,
  Painel: String,
  EstadoDoCarro: String,
  Obs: String,
  imagens_shakensho: String,
  imagens_fotoDoCarro: String,
  imagens_shupinhyo: String
})
// Edit Permissions
const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.tipo === 'admin'

const canModifyCars = ({ currentAdmin, record}) => {
  return currentAdmin && (
    currentAdmin.tipo === 'admin' || currentAdmin._id === record.param('userID'))}


// Config
const bcrypt = require('bcrypt')
const adminBroOptions = new AdminBro({
  assets: {
    styles: ['/css/admin.css'], // here you can hide the default images and re-position the boxes or text.
  },
  resources: [
    {
    resource: Carros,
    options: {
      properties: {
        imagens_fotoDoCarro: {isVisible: {
          list: false,
          edit: false,
          filter: false,
          show: false
        }},
        imagens_shakensho: {isVisible: {
          list: false,
          edit: false,
          filter: false,
          show: false

        }},
        imagens_shupinhyo: {isVisible: {
          list: false,
          edit: false,
          filter: false,
          show: false
        }},
        _id: {
          isVisible: {list: false, edit: false, filter: true, show: true}
        },
        Modelo: {isTitle: true},
        Ano: {isTitle: true},
        Km: {isTitle: true},
        Obs: {
          type: 'richtext',
          custom: {
            modules: {
              toolbar: [
            
              ['clean'], ]}},
        },
        shakensho: {
          isVisible: {list: false, edit: true, filter: false, show: true},
          components: {
            edit: AdminBro.bundle('./src/components/Image-Upload.edit.tsx'),
            list: AdminBro.bundle('./src/components/Image-Upload-Shakensho.list.tsx'),
            show: AdminBro.bundle('./src/components/Image-Upload-Shakensho.list.tsx')
          }
        },
        fotoDoCarro: {
          isTitle: true,
          isVisible: {list: true, edit: true, filter: false, show: true},
          components: {
            edit: AdminBro.bundle('./src/components/Image-Upload.edit.tsx'),
            list: AdminBro.bundle('./src/components/Image-Upload-Car.list.tsx'),
            show: AdminBro.bundle('./src/components/Image-Upload-Car.list.tsx'),
          }
        },
        shupinhyo: {
          isVisible: {list: false, edit: true, filter: false, show: true},
          components: {
            edit: AdminBro.bundle('./src/components/Image-Upload.edit.tsx'),
            list: AdminBro.bundle('./src/components/Image-Upload-Shupinhyo.tsx'),
            show: AdminBro.bundle('./src/components/Image-Upload-Shupinhyo.tsx'),
          }
        },
        userID: {isVisible: {list: true, edit: false, filter: true, show: true}}},
    actions: {
      new: { 
       before: async (request, context) => {
         modifiedRequest = await userIdAssign(request, context.currentAdmin);
         return ImageUploadBeforeHook(modifiedRequest, context);
        },
        

        after: async (response, request, context) => {
          return ImageUploadAfterHook(response, request, context)
        },

        component: AdminBro.bundle('./src/components/NewCar.tsx')
        
      },
      edit: {isAccessible: canModifyCars,
        before: async (request, context) => {
          modifiedRequest = await userIdAssign(request, context.currentAdmin);
          return ImageUploadBeforeHook(modifiedRequest, context);
         },
         
 
         after: async (response, request, context) => {
           return ImageUploadAfterHook(response, request, context)
         },
        component: AdminBro.bundle('./src/components/EditCar.tsx')},
      delete: {isAccessible: canModifyCars,

        before: async (request, context) => {
          modifiedRequest = await userIdAssign(request, context.currentAdmin);
          return ImageDeleteBeforeHook(modifiedRequest, context);
         },
         
 
         after: async (response, request, context) => {
           return ImageDeleteAfterHook(response, request, context)
         },
      },
    }}
    },{
    resource: User,
    options: {
      properties: {
        senhaCriptografada: {isVisible: false},
        password: {
          type: String,
          isVisible: {list: false, edit: true, filter: false, show: false}
        }
      },
    actions: {
      new: {
        isAccessible: canModifyUsers,
        before: async (request) => {
            request.payload = {
              ...request.payload,
              senhaCriptografada: await bcrypt.hash(request.payload.password, 10),
              password: undefined,
            }; 
            return request
          },
        },
      
        edit: {isAccessible: canModifyUsers},
        delete: {isAccessible: canModifyUsers},
    }}
  },
  ],
  branding: {
    companyName: "Bacana`s Garage",
    logo: 'http://localhost:5500/uploads/BACANAS-SIMBOLO-LOGO3.png',
    softwareBrothers: false,
    
    

  },
  locale: {
    translations: {
        messages: {
            successfullyBulkDeleted: 'removido(s) {{count}} registro(s)',
            successfullyBulkDeleted_plural: 'removidos {{count}} registros',
            successfullyDeleted: 'Registro deletado',
            successfullyUpdated: 'Registro atualizado',
            thereWereValidationErrors: 'Erros de validação, cheque-os abaixo',
            forbiddenError: 'Você não pode executar a ação {{actionName}} em {{resourceId}}',
            anyForbiddenError: 'Você não pode executar esta ação',
            successfullyCreated: 'Criado novo registro',
            bulkDeleteError: 'Houve um erro deletando registros, cheque o console para saber mais.',
            errorFetchingRecords: 'Houve um erro buscando registros, cheque o console para saber mais.',
            errorFetchingRecord: 'Houve um erro buscando record, cheque o console para saber mais.',
            noRecordsSelected: 'Você não selecionou nenhum dos registros',
            theseRecordsWillBeRemoved: 'O(s) seguinte(s) registro(s) vai(ão) ser deletado(s)',
            theseRecordsWillBeRemoved_plural: 'Os seguintes registros vão ser deletados',
            pickSomeFirstToRemove: 'Para deletar registros, você precisa selecionar primeiro',
            loginWelcome: 'Sistema feito por Code-fy', // the smaller text
            error404Resource: 'Recurso de id: {{resourceId}} não encontrado',
            error404Action: 'Recurso de id: {{resourceId}} não tem nenhuma ação nomeada de: {{actionName}}',
            error404Record: 'Recurso de id: {{resourceId}} não tem nenhum registro com o ID: {{recordId}}',
            seeConsoleForMore: 'Veja o console de desenvolvimento para mais detalhes...',
            noActionComponent: 'Você deve implementar o componente de ação para a sua Ação',
            noRecordsInResource: 'Não há registros neste recurso',
            noRecords: 'Sem registros',
            confirmDelete: 'Tem certeza de que deseja remover este item?',
            welcomeOnBoard_title: 'Bem-vindo a bordo!',
            welcomeOnBoard_subtitle: 'Agora você é um de nós! Preparamos algumas dicas para você começar:',
            addingResources_title: 'Adicionando recursos',
            addingResources_subtitle: 'Como adicionar novos recursos à barra lateral',
            customizeResources_title: 'Recursos Personalizados',
            customizeResources_subtitle: 'Definindo comportamento, adicionando propriedades e mais ...',
            customizeActions_title: 'Personalizar Ações',
            customizeActions_subtitle: 'Modificando ações existentes e adicionando novas',
            writeOwnComponents_title: 'Escreva os Componentes',
            writeOwnComponents_subtitle: 'Como modificar a aparência do AdminBro',
            customDashboard_title: 'Painel Personalizado',
            customDashboard_subtitle: 'Como modificar esta visualização e adicionar novas páginas na barra lateral',
            roleBasedAccess_title: 'Controle de acesso baseado em função',
            roleBasedAccess_subtitle: 'Crie funções de usuário e permissões no AdminBro',
            community_title: 'Junte-se à comunidade slack',
            community_subtitle: 'Fale com os criadores do AdminBro e outros usuários AdminBro',
            foundBug_title: 'Encontrou um bug? precisa de melhorias?',
            foundBug_subtitle: 'Levantar um problema em nosso repositório GitHub',
            needMoreSolutions_title: 'Precisa de soluções mais avançadas?',
            needMoreSolutions_subtitle: 'Estamos aqui para fornecer a você um belo design de UX/UI e um software feito sob medida com base (não apenas) no AdminBro',
            invalidCredentials: 'Email e/ou senha errados',
        },
        labels: {
            loginWelcome: 'Sistema de gerenciamento de carros', // this could be your project name
            car: 'Carros',
            User: 'Usuários',
            navigation: 'Navegação',
            pages: 'Páginas',
            selectedRecords: 'Selecionados ({{selected}})',
            filters: 'Filtros',
          
        },
        actions: {
          new: 'Criar novo',
          edit: 'Editar',
          show: 'Mostrar',
          delete: 'Deletar',
          bulkDelete: 'Deletar tudo',
          list: 'Listagem',
        },
        buttons:{
          save: 'Salvar',
          addNewItem: 'Adicionar Novo Item',
          filter: 'Filtro',
          applyChanges: 'Aplicar Mudanças',
          resetFilter: 'Resetar',
          confirmRemovalMany: 'Confirmar a remoção de {{count}} registro(s)',
          confirmRemovalMany_plural: 'Confirmar a remoção de {{count}} registros',
          logout: 'Logout',
          seeTheDocumentation: 'Ver: <1>a documentação</1>',
          createFirstRecord: 'Criar primeiro registro',
        }
  },  
},
 
  dashboard: {
    handler: async () => {
      return { some: 'output' }
    },
    component: AdminBro.bundle('./src/components/Dashboard.jsx')
  },

  rootpath: '/admin',
});

// REMOVER COMENTARIO DESSA PARTE PARA PODER LOGAR SEM NADA, PRECISA COMENTAR A ROUTER DE BAIXO INTEIRA
//const router = AdminBroExpress.buildRouter(adminBroOptions);

// Build and use a router which will handle all AdminBro routes

const router = AdminBroExpress.buildAuthenticatedRouter(adminBroOptions, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(password, user.senhaCriptografada)
      if (matched) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
})
// Server
const express = require("express");
const { useActionResponseHandler } = require("admin-bro");
const server = express();

server.use(adminBroOptions.options.rootpath, router);
server.use('/uploads', express.static('uploads'));
server.use(express.static("css"));
server.use(express.static(__dirname + '/public'));
// Run App
const run = async () => {
  await mongoose.connect("mongodb://localhost:27017/teste", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await server.listen(5500, () => console.log("Servidor iniciado com Sucesso! http://localhost:5500"));
};

run();