//const debug = require('debug')('loopback:boot:roles');
const app = require('../server.js');
//debug.log = console.log.bind(console);
var fs = require('fs');
//var pdf = require('html-pdf');
var options = app.get('options');
//const contractHtmlHandler = require('../templates/contracts/businesscard.js');
//var decode = require('decode-html');
module.exports = async function(app)
{
  try
  {
    // used the models
  
    const {Member, Project, Assignproject} = app.models;



    // create custom role Admin
   /* const AdminRole = await Role.findOne({where: {name: 'Admin'}});
    if (!AdminRole)
    {
      await Role.create({name: 'Admin', role_id : 1});
      debug('Created Admin role');
    }

    // create custom role Staff
    const orgStaffRole = await Role.findOne({where: {name: 'Staff'}});
    if (!orgStaffRole)
    {
      await Role.create({name: 'Staff', role_id : 2});
      debug('Created Staff role');
    }

    // create custom role Regional Manager
    const orgRegionalManager = await Role.findOne({where: {name: 'Regional Manager'}});
    if (!orgRegionalManager)
    {
      await Role.create({name: 'Regional Manager', role_id : 3});
      debug('Created Regional Manager role');
    }

// create custom role Account Manager
    const accountManager = await Role.findOne({where: {name: 'Account Manager'}});
    if (!accountManager)
    {
      await Role.create({name: 'Account Manager', role_id : 4});
      debug('Created Account Manager role');
    }


    const dealer = await Role.findOne({where: {name: 'Dealer'}});
    if (!dealer)
    {
      await Role.create({name: 'Dealer', role_id : 5});
      debug('Dealer added');
    }


    const supplier = await Role.findOne({where: {name: 'Supplier'}});
    if (!supplier)
    {
      await Role.create({name: 'Supplier', role_id : 6});
      debug('Supplier added');
    }

    const sales_person = await Role.findOne({where: {name: 'Sales Person'}});
    if (!sales_person)
    {
      await Role.create({name: 'Sales Person', role_id : 7});
      debug('Supplier added');
    }

    const production_coordinator = await Role.findOne({where: {name: 'Production Coordinator'}});
    if (!production_coordinator)
    {
      await Role.create({name: 'Production Coordinator', role_id : 8});
      debug('Supplier added');
    }

*/
    // fix the mongo db object assignment
    const ObjectID = Project.getDataSource().connector.getDefaultIdType();
  
    
    // Because of this:
    // https://github.com/strongloop/loopback-connector-mongodb/issues/128
    Project.defineProperty('memberId', {
      type: ObjectID,
    });

    Assignproject.defineProperty('projectId', {
      type: ObjectID,
    });

    Assignproject.defineProperty('memberId', {
      type: ObjectID,
    });
    

    // Helps to get the include relationship
    //Project.belongsTo(Member);
    //Assignproject.belongsTo(Project);
    //Assignproject.belongsTo(Member);
    //Member.hasMany(Project, {foreignKey: 'memberId'});
    //Member.hasMany(Assignproject, {foreignKey: 'memberId'});
    //Project.hasMany(Assignproject, {foreignKey: 'projectId'});

  }
  catch (roleCreationErr)
  {
    console.log(roleCreationErr);
    throw roleCreationErr;
  }
};
