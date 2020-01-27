// Copyright (c) 2017-2019 dirigeants. All rights reserved. MIT license.
const { Language } = require('klasa');

module.exports = class extends Language {
  constructor(...args) {
    super(...args);
    this.language = {
      COMMAND_INFO: ['Meow?'],
    };
  }

  async init() {
    await super.init();
  }
};
