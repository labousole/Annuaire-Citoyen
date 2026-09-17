// Utilitaires partagés entre les outils. Aucune donnée saisie dans les
// formulaires n'est envoyée à un serveur : tout se passe dans le navigateur.

const CitoyenKit = (() => {

  function fmtDate(d) {
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  /**
   * Délai "avant" : une action doit être notifiée au moins `minDays`
   * jours francs avant une date de référence (ex. préavis de grève,
   * déclaration de manifestation).
   */
  function checkNoticeBefore(referenceDateStr, minDays, label) {
    const ref = new Date(referenceDateStr + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysUntil = Math.round((ref - today) / 86400000);

    if (daysUntil < 0) return { ok: false, text: "Cette date est déjà passée." };
    if (daysUntil < minDays) {
      return {
        ok: false,
        text: `Trop tard : ${label} doit parvenir au moins ${minDays} jours francs avant. Il ne reste que ${daysUntil} jour(s).`,
      };
    }
    const deadline = new Date(ref);
    deadline.setDate(deadline.getDate() - minDays);
    return { ok: true, text: `Envoyez au plus tard le ${fmtDate(deadline)} pour respecter le délai de ${minDays} jours francs.` };
  }

  /**
   * Délai "après" : compte à rebours pour agir après un événement
   * déclencheur (ex. délai de rétractation, délai de recours).
   */
  function checkDeadlineAfter(triggerDateStr, maxDays, label) {
    const trigger = new Date(triggerDateStr + "T00:00:00");
    const deadline = new Date(trigger);
    deadline.setDate(deadline.getDate() + maxDays);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysLeft = Math.round((deadline - today) / 86400000);

    if (daysLeft < 0) {
      return { ok: false, text: `Le délai de ${label} (${maxDays} jours) semble dépassé depuis le ${fmtDate(deadline)}. Une action reste parfois possible : renseignez-vous vite.` };
    }
    return { ok: true, text: `Vous avez jusqu'au ${fmtDate(deadline)} inclus (${daysLeft} jour(s) restant(s)) pour ${label}.` };
  }

  /**
   * Génère un PDF simple à partir d'une structure de sections.
   * config = {
   *   title, subtitle, intro,
   *   sections: [{ heading, lines: [string,...] }],
   *   closing: [string,...],   // ex. formule de politesse, signature
   *   legalNote: string,       // rappel légal en bas de page, en gras
   *   filename
   * }
   */
  function generatePdf(config) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const marginX = 20;
    const pageWidth = 210 - marginX * 2;
    let y = 22;

    const addWrapped = (text, size = 11, gap = 6, style = "normal") => {
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, pageWidth);
      lines.forEach((line) => {
        if (y > 275) { doc.addPage(); y = 22; }
        doc.text(line, marginX, y);
        y += gap;
      });
    };

    addWrapped(config.title.toUpperCase(), 14, 8, "bold");
    if (config.subtitle) addWrapped(config.subtitle, 9, 7, "normal");
    y += 2;
    if (config.intro) addWrapped(config.intro, 9.5);
    y += 3;

    (config.sections || []).forEach((section) => {
      if (section.heading) addWrapped(section.heading, 12, 7, "bold");
      (section.lines || []).forEach((line) => {
        if (line) addWrapped(line, 10.5, 6, "normal");
      });
      y += 3;
    });

    if (config.closing && config.closing.length) {
      y += 4;
      config.closing.forEach((line) => addWrapped(line, 10.5, 6.5, "normal"));
      y += 6;
    }

    if (config.legalNote) {
      y += 4;
      addWrapped(config.legalNote, 8.5, 4.5, "bold");
    }

    doc.save(config.filename || "document.pdf");
  }

  return { fmtDate, escapeHtml, checkNoticeBefore, checkDeadlineAfter, generatePdf };
})();
