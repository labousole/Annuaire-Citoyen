document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("envoi-date");
  const result = document.getElementById("delay-result");

  dateInput.addEventListener("change", () => {
    if (!dateInput.value) { result.textContent = ""; result.className = "delay-result empty"; return; }
    const envoi = new Date(dateInput.value + "T00:00:00");
    const silenceDate = new Date(envoi);
    silenceDate.setMonth(silenceDate.getMonth() + 1);
    const cadaDeadline = new Date(silenceDate);
    cadaDeadline.setMonth(cadaDeadline.getMonth() + 2);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today < silenceDate) {
      result.textContent = `L'administration a jusqu'au ${CitoyenKit.fmtDate(silenceDate)} pour répondre. Passé cette date sans réponse, cela vaut refus implicite.`;
      result.className = "delay-result ok";
    } else if (today <= cadaDeadline) {
      result.textContent = `Le silence vaut refus depuis le ${CitoyenKit.fmtDate(silenceDate)}. Vous pouvez saisir la CADA jusqu'au ${CitoyenKit.fmtDate(cadaDeadline)}.`;
      result.className = "delay-result ok";
    } else {
      result.textContent = `Le délai de saisine de la CADA (deux mois après le refus implicite du ${CitoyenKit.fmtDate(silenceDate)}) semble dépassé depuis le ${CitoyenKit.fmtDate(cadaDeadline)}.`;
      result.className = "delay-result bad";
    }
  });

  document.getElementById("generate-pdf").addEventListener("click", () => {
    const val = (id) => document.getElementById(id).value.trim();
    const nom = val("nom");
    const document_ = val("document");

    if (!nom || !document_) {
      alert("Merci de renseigner au moins votre nom et la description du document demandé.");
      return;
    }

    CitoyenKit.generatePdf({
      title: "Demande de communication de documents administratifs",
      subtitle: "Livre III du code des relations entre le public et l'administration",
      sections: [
        { heading: "Demandeur", lines: [nom, val("adresse")] },
        { heading: "Destinataire", lines: [val("organisme")] },
        { heading: "Document(s) demandé(s)", lines: [document_] },
        { heading: "Modalité de communication souhaitée", lines: [val("modalite")] },
      ],
      closing: [
        "Je vous prie de bien vouloir me communiquer le(s) document(s) décrit(s) ci-dessus, dans les conditions prévues par le livre III du code des relations entre le public et l'administration.",
        "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
        "",
        "Fait à _______________________, le _______________________",
        "Signature :",
      ],
      legalNote: "Rappel : l'administration dispose d'un mois pour répondre. Passé ce délai, le silence vaut refus implicite, contestable devant la CADA dans un délai de deux mois, préalable obligatoire à tout recours contentieux.",
      filename: "demande-communication-documents.pdf",
    });
  });
});
