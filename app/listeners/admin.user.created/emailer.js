var blueprint = require ('@onehilltech/blueprint')
var nodemailer = require('nodemailer');

module.exports = exports = function (){
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: '"John Doe" <foo@blurdybloop.com>', // sender address
    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    subject: 'Welcome to Hive', // Subject line
    text: 'Here is your admin username and password:', // plaintext body
    html: '<b>Hive</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
};
