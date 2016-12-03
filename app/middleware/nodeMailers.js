var nodemailer = require('nodemailer');
var stubTransport = require('nodemailer-stub-transport');

var mailers = {};

mailers.mailerTransport  = function (docs, callback) {

  var emailer = 'HiveEmailer@gmail.com';

  var connection = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailer,
      pass: 'ch4ng3m3'
    },
    logger: true
  };

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport(connection);

  var message = '<p>Thank you ' + docs.organization.name + ' for joining Hive!</p>';
  message += '<p>Your admin credentials are listed below!</p>';
  message += '<p>username: ' + docs.user.username + '</p>';
  message += '<p>password: ' + docs.user.password + '</p>';

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: '"HiveEmailer" <' + emailer + '>', // sender address
    //to: '"Danny Peck" <danieljpeck93@gmail.com>',
    to: '"' + docs.user.username + '"' + ' <' + docs.user.email + '>', // list of receivers
    subject: 'Welcome to Hive', // Subject line
    text: 'Here is your admin username and password:', // plaintext body
    html: message
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(err, info){
    if (err) { return callback (err); }

    console.log('Message sent: ' + info.response);
    callback (null, {org_id: docs.organization._id, admin_id: docs.user._id});
  });
}

mailers.mailerStub  = function (docs, callback) {
  var transport = nodemailer.createTransport(stubTransport());

  var emailer = 'HiveEmailer@gmail.com';

  var message = '<p>Thank you ' + docs.organization.name + ' for joining Hive!</p>';
  message += '<p>Your admin credentials are listed below!</p>';
  message += '<p>username: ' + docs.user.username + '</p>';
  message += '<p>password: ' + docs.user.password + '</p>';

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: '"HiveEmailer" <' + emailer + '>', // sender address
    //to: '"Danny Peck" <danieljpeck93@gmail.com>',
    to: '"' + docs.user.username + '"' + ' <' + docs.user.email + '>', // list of receivers
    subject: 'Welcome to Hive', // Subject line
    text: 'Here is your admin username and password:', // plaintext body
    html: message
  };

  transport.sendMail(mailOptions, function(error, info){
    if (error) { return callback (error); }
      callback (null, {org_id: docs.organization._id, admin_id: docs.user._id});
  });
}

mailers.resolveMailer = function () {
  if (process.env.NODE_ENV == 'test') {
    return mailers.mailerStub;
  }
  else{
    return mailers.mailerTransport;
  }
}

module.exports = exports = mailers;
