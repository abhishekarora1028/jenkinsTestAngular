'use strict';

var config = require('../../server/config.json');
var path = require('path');
const ejs = require('ejs');
const Fs = require('fs');
const app = require('../server.js');
//const inlineCss = require('inline-css');
var async = require('async');

module.exports = function(Member) {

	const passwordEmailTemplatePath = path.normalize(path.join(
    __dirname,
    '../',
    'templates', 'emails', 'reset-password.ejs'
  ));

  const passwordEmailTemplate = Fs.readFileSync(passwordEmailTemplatePath, 'utf8');

  Member.on('resetPasswordRequest', async function(info)
  {
    
    //console.log(info);
    const userEmail = info.email;
     const {Email,EmailContent} = app.models;
    //console.log('Finding customer with id', userEmail);
    const member = await Member.findOne({where: {email: userEmail}});
    console.log(11111111111)
    //const emailHtml = await EmailContent.findOne({where : {code : 'forgot-password'}});
   //console.log(emailHtml);
   console.log(22222222222)

    const url = app.get('portalUrl')+`/#/resetpassword/${member.id}/${info.accessToken.id}`;

    let replaceArray = ['username', 'reset_password_url'];
    let replaceWith = [ member.username, url];

    const emailTemplateParams = {
      logoUrl: '',
      url,
      member
    };


    Email.send(
      {
        to: info.email,
        from: {
          name: 'Esquared',
          address: 'noreply@esquared.com'
        },
        subject: 'Forgot Password',
        html: passwordEmailTemplate
      },
      function(err)
      {
        if (err)
        {
          console.log('> error sending password reset email');
        }
        else
        {
          console.log('> sending password reset email to:', info.email);
        }
      }
    );

/*    Email.send({
                      to: member.email,
                      from: {
                      name: 'Esquared SalesEvent',
                      address: app.get('email')
                    }, 
                      subject: 'Forgot Password',
                      html: html
                    }, (err) =>
                    {
                      if (err)
                      {
                        console.log(err);
                        return reject(err);
                      }
                      // email sent
                      //return resolve();
                      console.log('> Email Sent!!')
                      //next();
                    });*/
    
    //const emailHtml = ejs.render(passwordEmailTemplate, emailTemplateParams);
   // const emailHtml = emailHtml.emailcontent;
   /* let emailContent = '';
             async.each(replaceArray,  function (item, callback) {
               console.log(emailContent);
               emailContent  = emailContent.replace(new RegExp('{{' + item + '}}', 'gi'), replaceWith[replaceArray.indexOf(item)]);
               
               callback();
              }, function(err){
                  
                  const template = verifyAccountEmail(emailContent);

                  //const subject = 'Verify your email to get started';
                  inlineCss(template,  { url: 'http://localhost:4200/'})
                  .then(function(html) {
                    
                    Email.send({
                      to: member.email,
                      from: {
                      name: 'Esquared SalesEvent',
                      address: app.get('email')
                    }, 
                      subject: emailHtml.subject,
                      html: html
                    }, (err) =>
                    {
                      if (err)
                      {
                        console.log(err);
                        return reject(err);
                      }
                      // email sent
                      //return resolve();
                      console.log('> Email Sent!!')
                      //next();
                    });
                })
              })*/

   
    /*Email.send(
      {
        to: info.email,
        from: {
          name: 'Bullseye',
          address: 'noreply@bullseye.com'
        },
        subject: 'Reset your Bullseye password',
        html: emailHtml
      },
      function(err)
      {
        if (err)
        {
          console.log('> error sending password reset email');
        }
        else
        {
          console.log('> sending password reset email to:', info.email);
        }
      }
    );*/
  });

};
