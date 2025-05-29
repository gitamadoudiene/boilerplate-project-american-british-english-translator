class Translator {
  translate(text, locale) {
    if (!text) return { text, translation: "No text to translate" };
    if (!locale) return { text, translation: "No locale specified" };

    let translation = text;

    if (locale === "american-to-british") {
      // 1. Remplacer les mots uniquement américains
      for (const [usTerm, ukTerm] of Object.entries(americanOnly)) {
        const regex = new RegExp(`\\b${usTerm}\\b`, 'gi');
        translation = translation.replace(regex, (match) => {
          // Respecter la casse (majuscule ou minuscule)
          const firstChar = match.charAt(0);
          if (firstChar === firstChar.toUpperCase()) {
            return `<span class="highlight">${ukTerm.charAt(0).toUpperCase()}${ukTerm.slice(1)}</span>`;
          } else {
            return `<span class="highlight">${ukTerm}</span>`;
          }
        });
      }

      // 2. Remplacer l'orthographe US par UK
      for (const [usSpell, ukSpell] of Object.entries(americanToBritishSpelling)) {
        const regex = new RegExp(`\\b${usSpell}\\b`, 'gi');
        translation = translation.replace(regex, (match) => {
          // Respecter la casse
          const firstChar = match.charAt(0);
          if (firstChar === firstChar.toUpperCase()) {
            return `<span class="highlight">${ukSpell.charAt(0).toUpperCase()}${ukSpell.slice(1)}</span>`;
          } else {
            return `<span class="highlight">${ukSpell}</span>`;
          }
        });
      }

      // 3. Remplacer les titres (ex : Mr. -> Mr)
      for (const [usTitle, ukTitle] of Object.entries(americanToBritishTitles)) {
        const regex = new RegExp(`\\b${usTitle}`, 'gi');
        translation = translation.replace(regex, (match) => {
          if (match[0] === match[0].toUpperCase()) {
            return `<span class="highlight">${ukTitle.charAt(0).toUpperCase()}${ukTitle.slice(1)}</span>`;
          } else {
            return `<span class="highlight">${ukTitle}</span>`;
          }
        });
      }

      // TODO : gérer ponctuation spécifique et temps

    } else if (locale === "british-to-american") {
      // Tri des entrées par longueur décroissante pour éviter remplacements imbriqués
      const sortedBritishOnlyEntries = Object.entries(britishOnly).sort((a, b) => b[0].length - a[0].length);
      for (const [ukTerm, usTerm] of sortedBritishOnlyEntries) {
        const regex = new RegExp(`\\b${ukTerm}\\b`, 'gi');
        translation = translation.replace(regex, (match) => {
          // Respecter la casse
          const firstChar = match.charAt(0);
          if (firstChar === firstChar.toUpperCase()) {
            return `<span class="highlight">${usTerm.charAt(0).toUpperCase()}${usTerm.slice(1)}</span>`;
          } else {
            return `<span class="highlight">${usTerm}</span>`;
          }
        });
      }

      const sortedBritishToAmericanSpelling = Object.entries(britishToAmericanSpelling).sort((a, b) => b[0].length - a[0].length);
      for (const [ukSpell, usSpell] of sortedBritishToAmericanSpelling) {
        const regex = new RegExp(`\\b${ukSpell}\\b`, 'gi');
        translation = translation.replace(regex, (match) => {
          // Respecter la casse
          const firstChar = match.charAt(0);
          if (firstChar === firstChar.toUpperCase()) {
            return `<span class="highlight">${usSpell.charAt(0).toUpperCase()}${usSpell.slice(1)}</span>`;
          } else {
            return `<span class="highlight">${usSpell}</span>`;
          }
        });
      }

      for (const [ukTitle, usTitle] of Object.entries(britishToAmericanTitles)) {
        const regex = new RegExp(`\\b${ukTitle}(?=\\s|\\.|$)`, 'gi');
        translation = translation.replace(regex, (match) => {
          if (match[0] === match[0].toUpperCase()) {
            return `<span class="highlight">${usTitle.charAt(0).toUpperCase()}${usTitle.slice(1)}</span>`;
          } else {
            return `<span class="highlight">${usTitle}</span>`;
          }
        });
      }

      // Exemple spécifique : Paracetamol -> Tylenol
      if (/Paracetamol/gi.test(translation)) {
        translation = translation.replace(/Paracetamol/gi, '<span class="highlight">Tylenol</span>');
      }

      // Gérer le format d'heure britannique "4.30" => "4:30"
      translation = translation.replace(/(\d{1,2})\.(\d{2})/g, (match, p1, p2) => {
        return `<span class="highlight">${p1}:${p2}</span>`;
      });

      // TODO : gérer ponctuation spécifique et temps

    } else {
      return { text, translation: "Invalid locale" };
    }

    // Debug: Affiche la traduction finale
    console.log("Traduction finale:", translation);

    // Si aucun changement, retourne message spécial
    const stripTags = (str) => str.replace(/<span class="highlight">|<\/span>/gi, '');
    if (stripTags(translation) === text) {
      translation = "Everything looks good to me!";
    }

    return { text, translation };
  }
}

module.exports = Translator;
