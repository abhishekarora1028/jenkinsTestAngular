'use strict';

var config = require('../../server/config.json');
var path = require('path');
const ejs = require('ejs');
const Fs = require('fs');
const app = require('../server.js');
//const inlineCss = require('inline-css');
var async = require('async');
//const {ObjectId} = require('mongodb');

module.exports = function(Timesheet) {

	var ObjectID = require('mongodb').ObjectID

	 Timesheet.observe('before save', function(ctx, next) {
      const {Timesheet} = app.models;

      if (ctx.instance) {
      	ctx.instance.member_id  = new ObjectID(ctx.instance.member_id),
      	ctx.instance.project_id = new ObjectID(ctx.instance.project_id)
      }

      next();

      });

};
