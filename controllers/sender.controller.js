import nodemailer from "nodemailer";
import dotenv from "dotenv";
import pQueue from "p-queue";

dotenv.config();

const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

export const senderEmail = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const {
      smtps,
      emailList,
      senderName,
      emailSubject,
      attachment,
      attachmentName,
      letter,
    } = req.body;

    const smtpServers = smtps.map(({ host, port, email, password }) => ({
      host,
      port,
      secure: true,
      auth: { user: email, pass: password },
    }));

    const createTransporter = (smtpConfig) => nodemailer.createTransport(smtpConfig);
    
    const getRandomTransporter = () => createTransporter(getRandomElement(smtpServers));

    const emailQueue = new pQueue({ concurrency: 100 });

    const mailOptions = {
      from: {
        name: senderName,
        address: '',
      },
      subject: emailSubject,
      html: letter,
    };

    if (attachmentName && attachment) {
      mailOptions.attachments = [
        {
          filename: attachmentName,
          path: attachment,
          //encoding: 'base64',
        },
      ];
    }

    const sendEmail = async (email) => {
      const transporter = getRandomTransporter();
      const options = { ...mailOptions, to: email, from: { ...mailOptions.from, address: transporter.options.auth.user } };

      try {
        const info = await transporter.sendMail(options);
        console.log(`Email sent to ${email}: ${info.response}`);
        return { email, status: 'success' };
      } catch (error) {
        console.error(`Failed to send email to ${email}: ${error.message}`);
        return { email, status: 'failed', error: error.message };
      }
    };

    const results = await Promise.all(emailList.map((email) => emailQueue.add(() => sendEmail(email))));

    res.status(200).json({ message: "Emails sent successfully", results });
  } catch (error) {
    console.error(`Failed to send emails: ${error.message}`);
    res.status(500).json({ message: "Failed to send emails", error: error.message });
  }
};