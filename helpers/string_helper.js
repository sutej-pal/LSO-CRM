module.exports = class StringHelper {
    static makeCode(text) {
        return text.replace(/([^a-zA-Z0-9]*)/g, '').toLowerCase();
    }
}