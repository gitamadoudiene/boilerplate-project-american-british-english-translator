'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body;

      // Vérification des données reçues
      if (text === undefined || locale === undefined) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (text === '') {
        return res.json({ error: 'No text to translate' });
      }

      // Vérifier la validité du locale
      const validLocales = ['american-to-british', 'british-to-american'];
      if (!validLocales.includes(locale)) {
        return res.json({ error: 'Invalid value for locale field' });
      }

      // Faire la traduction
      const translation = translator.translate(text, locale);

      // Si la traduction est identique au texte reçu
      if (translation === text) {
        return res.json({ text, translation: 'Everything looks good to me!' });
      }

      // Sinon, renvoyer la traduction
      return res.json({ text, translation });
    });
};
