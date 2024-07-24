const nodemailer = require("nodemailer");
const ejs = require("ejs");
const dotenv = require("dotenv");
dotenv.config();

var transporter = ''
var hostMail = '', userName = '', Password = '';

/**
 * This function will create authentication for SMTP for sending emails
 */
exports.createDynamicTransport = function (host, username, password) {
  transporter = nodemailer.createTransport(
    {
      host: host,
      port: process.env.EMAIL_SMTP_PORT,
      // secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
      auth: {
        user: username,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false // Accept self-signed certificates
      }
    });
  return transporter
}

/**
 * This function will send email to respective email address
 * @param to
 * @param from
 * @param subject
 * @param html
 * @returns {Promise<{always: function(): this, pipe: function(): *, promise: function(*=): (*), state: function(): {loc: null}|((name: string, styles: AnimationStyleMetadata, options?: {params: {[p: string]: any}}) => AnimationStateMetadata)|{parsedOptions: {}, positionals: [], ignored: [], warnings: [], options: *, leftovers: [], errors: []}|null, catch: function(*=): *, then: function(*=, *=, *=): *}|{always: function(): this, pipe: function(): *, promise: function(*=): (*), state: function(): {loc: null}|((name: string, styles: AnimationStyleMetadata, options?: {params: {[p: string]: any}}) => AnimationStateMetadata)|{parsedOptions: {}, positionals: [], ignored: [], warnings: [], options: *, leftovers: [], errors: []}|null, catch: function(*=): *, then: function(*=, *=, *=): *}|{always: function(): this, pipe: function(): *, promise: function(*=): (*), state: function(): {loc: null}|((name: string, styles: AnimationStyleMetadata, options?: {params: {[p: string]: any}}) => AnimationStateMetadata)|{parsedOptions: {}, positionals: [], ignored: [], warnings: [], options: *, leftovers: [], errors: []}|null, catch: function(*=): *, then: function(*=, *=, *=): *}>}
 */
exports.sendMailToCorrespondence = async function (to, from, subject, html) {
  return transporter.sendMail({
    from: process.env.SEND_FROM_EMAIL,
    to: to,
    subject: subject,
    html: html
  });
};

/**
 * THis function will always sent email with attachments
 * @param sendTo
 * @param Subject
 * @param emailBody
 * @param Attachment
 * @returns {{always: (function(): promise), pipe: (function(): jQuery), promise: (function(*=): *), state: (function(): string), catch: (function(*=): *), then: (function(*=, *=, *=): jQuery)}|{always: (function(): promise), pipe: (function(): jQuery), promise: (function(*=): *), state: (function(): string), catch: (function(*=): *), then: (function(*=, *=, *=): jQuery)}|{always: (function(): promise), pipe: (function(): jQuery), promise: (function(*=): *), state: (function(): string), catch: (function(*=): *), then: (function(*=, *=, *=): jQuery)}}
 */
exports.sendwithAttachmentImage = async function (
  sendTo,
  Subject,
  emailBody,
  Attachment
) {

  try {
    const sendMail = await transporter.sendMail({
      // from: process.env.SEND_FROM_EMAIL,
      from: process.env.EMAIL_SENDER_NAME + "<" + process.env.SEND_FROM_EMAIL + ">",
      to: sendTo,
      subject: Subject,
      html: emailBody,
      attachments: Attachment
    });
    return sendMail;
  } catch (e) {
    // Send error message on fail
  }
};

/**
 * This functin will generate email template with dynamic data and will used as HTML form email
 * @param sendEmailTemplateData
 * @param replaceEmailTemplateData
 * @returns {Promise<void>}
 */
exports.generateHtmlForEmail = async function (
  sendEmailTemplateData,
  replaceEmailTemplateData
) {
  const host = process.env.SMTP_HOST;
  const username = process.env.SMTP_USERNAME;
  const password = process.env.SMTP_PASSWORD;

  await this.createDynamicTransport(host, username, password);

  let linkReplaceData = {
    siteUrl: process.env.SITE_REDIRECT_URL
  };

  const emailHTML = await ejs.renderFile(
    process.env.EMAIL_TEMPLATE_LOCATION + sendEmailTemplateData.templateName,
    {
      replaceEmailTemplateData: replaceEmailTemplateData,
      linkReplaceData: linkReplaceData
    }
  );
  const attachments = [
    {
      filename: "logo.png",
      path: process.env.EMAIL_TEMPLATE_IMAGE_LOCATION + "images/logos/logo.png",
      cid: "logo"
    },
    {
      filename: "app-store.png",
      path: process.env.EMAIL_TEMPLATE_IMAGE_LOCATION + "images/logos/app-store.png",
      cid: "app-store"
    },
    {
      filename: "google-play-badge.png",
      path: process.env.EMAIL_TEMPLATE_IMAGE_LOCATION + "images/logos/google-play-badge.png",
      cid: "google-play-badge"
    },
    {
      filename: "social-icon-fb.png",
      path: process.env.EMAIL_TEMPLATE_IMAGE_LOCATION + "images/logos/social-icon-fb.png",
      cid: "social-icon-fb"
    },
    {
      filename: "social-icon-ig.png",
      path: process.env.EMAIL_TEMPLATE_IMAGE_LOCATION + "images/logos/social-icon-ig.png",
      cid: "social-icon-ig"
    },
    {
      filename: "social-icon-twitter.png",
      path: process.env.EMAIL_TEMPLATE_IMAGE_LOCATION + "images/logos/social-icon-twitter.png",
      cid: "social-icon-twitter"
    },
  ]

  if (sendEmailTemplateData.templateName == "forgot-password-verification-template.ejs") {
    attachments.push({
      filename: "reset-image.png",
      path: process.env.EMAIL_TEMPLATE_IMAGE_LOCATION + "images/logos/reset-image.png",
      cid: "reset-image"
    })
  } else if (sendEmailTemplateData.templateName == "registered-in-carnawash.ejs") {
    attachments.push({
      filename: "welcome-image.png",
      path: process.env.EMAIL_TEMPLATE_IMAGE_LOCATION + "images/logos/welcome-image.png",
      cid: "welcome-image"
    })
  } else if (sendEmailTemplateData.templateName == "forgot-password-otp-template.ejs") {
    attachments.push({
      filename: "verification-image.png",
      path: process.env.EMAIL_TEMPLATE_IMAGE_LOCATION + "images/logos/verification-image.png",
      cid: "verification-image"
    })
  }




  this.sendwithAttachmentImage(sendEmailTemplateData.emailToUser, sendEmailTemplateData.subject, emailHTML, attachments);

  // this.sendwithAttachmentImage(
  //   sendEmailTemplateData.emailToUser,
  //   sendEmailTemplateData.subject,
  //   emailHTML
  // );
};
