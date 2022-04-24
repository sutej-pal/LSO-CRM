const Mail = require('./mail');

module.exports = class RequestPasswordResetMail extends Mail {

    /**
     * Change your options here
     */
    prepare() {

        this.subject = "ABC-CRM Password Reset Request";

        this.html = `
        Hi ${this.other.name},<br>
        We have recieved a password reset request for ABC-CRM,<br>
        please click <a href="${this.other.link}">here</a> to reset your password.
        Ignore this if it wasn't you.
      `;

    }
}
