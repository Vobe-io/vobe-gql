import {Module} from "../lib/ModuleLoader.js";
import nodemailer from 'nodemailer';
import Status from "../lib/Status.js";

export let transporter;

export default class MailModule extends Module {

    name = 'Mail';
    index = 0;

    async load() {
        transporter = nodemailer.createTransport({
            pool: true,
            host: 'mail.vobe.io',
            port: 465,
            secure: true,
            auth: {
                user: vobeJson.mailUsername,
                pass: vobeJson.mailPassword
            }
        });
        transporter.verify((error, success) => {
            if (error) {
                return new Status(false, error);
            }
        });
        return new Status(true, "MailServer is ready to take our messages");
    }
}
