/* eslint-disable linebreak-style */
class BadRequest extends Error {
  constructor(message) {
    super();
    this.name = this.constructor.name;
    this.message = message;
    this.status = 400;
  }
}

module.exports = BadRequest;
