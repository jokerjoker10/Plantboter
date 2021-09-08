const config = require('./settings').getSettings();
const nodemailer = require("nodemailer");
const mail_model = require("../Model/mail.model");
const fs = require('fs')

const sendVerificationMail = (user) => {
    return new Promise((resolve, reject) => {
        email = user.dataValues.email;
        createMailCode(user, 'mail_verification')
        .then((mail_key) => {
            if(!mail_key){
                reject("Key Generation Failed");
                return;
            }

            sendMailVerification(mail_key.dataValues.key, email)
            .then((mail_report) => {
                updateMailSendData(mail_key, mail_report)
                .then(() => {
                    resolve(mail_report);
                    return;
                })
                .catch(() => {
                    reject("Mail send but saving mail report failed");
                    return;
                })
            })
            .catch(() => {
                reject("Error Sending Mail");
                return;
            });
        })
        .catch((error) => {
            reject("Error Creating identifying code: " + error);
            return;
        });  
    }); 
}

const createMailCode = (user, mail_type) => {
    return new Promise((resolve, reject) => {
        email = user.dataValues.email;
        if(mail_type != ('mail_verification' || 'password_reset')){
            reject("Mail Type must either be 'mail_verification' or 'password_reset'");
            return;
        }
        
        if(!user){
            reject("Email not found");
            return;
        }

        if(user.dataValues.email_confirmed){
            reject("Email already Confirmed");
            return;
        }

        mail_model.update({active: false}, {where: {user_id: user.dataValues.id}})
        .catch((error) => {
            reject("Clearing old keys failed: " + error);
            return;
        });

        //generate code
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-+';
        var generated_key = '';
        for ( var i = 0; i < 8; i++ ) {
            generated_key += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        mail_model.findOne({where: {key: generated_key}})
        .then((mail_key) => {
            if(!mail_key){
                mail_model.create({
                    key: generated_key,
                    active: true,
                    mail_type: mail_type,
                    userId: user.dataValues.id
                })
                .then((user)=> {
                    resolve(user);
                    return;
                })
                .catch((error) => {
                    reject("Creating Database Entrance Failed: " + error);
                    return;
                });
            }
            else{
                reject("Generated Key already exists");
                return;
            }
        })
        .catch((error) => {
            reject("Error Finding Key: " + error);
            return;
        });
    });
}

const updateMailSendData = (mail_key, mail_report) => {
    return new Promise((resolve, reject) => {
        mail_model.update({mail_send_report: mail_report}, {where: {id: mail_key.dataValues.id}})
        .then((data) => resolve(data))
        .catch((error) => reject(error))
    });
}

async function sendMailVerification(key, email){
    let transporter = getTransporter();
    let html_content = String(fs.readFileSync('Utils/MailHtml/mailverification.html', 'utf-8'))
    .replaceAll('{key}', key)
    .replaceAll('{url}', config.domain)
    .replaceAll('{email}', email)
    .replaceAll('{year}', new Date().getFullYear());
    
    let mail_info = await transporter.sendMail({
        from: 'Plantboter 🌱 <' + config.email.auth.user + '>',
        to: email,
        subject: 'Email verification',
        text: 'Your activation code is: ' + key,
        html: html_content
    });
    
    return mail_info;
} 

function getTransporter(){
    return nodemailer.createTransport(config.email);
}

module.exports = {
    sendVerificationMail 
}