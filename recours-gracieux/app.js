document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("notif-date");
  const result = document.getElementById("delay-result");

  dateInput.addEventListener("change", () => {
    if (!dateInput.value) { result.textContent = ""; result.className = "delay-result empty"; return; }

    const notif = new Date(dateInput.value + "T00:00:00");
    const deadline = new Date(notif);
    deadline.setMonth(deadline.getMonth() + 2);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysLeft = Math.round((deadline - today) / 86400000);

    if (daysLeft < 0) {
      result.textContent = `Le délai de deux mois semble dépassé depuis le ${CitoyenKit.fmtDate(deadline)}. Un recours reste parfois recevable : agissez sans tarder et faites-vous confirmer la mention des voies de recours sur la décision reçue.`;
      result.className = "delay-result bad";
    } else {
      result.textContent = `Vous avez jusqu'au ${CitoyenKit.fmtDate(deadline)} inclus (${daysLeft} jour(s) restant(s)) pour former votre recours.`;
      result.className = "delay-result ok";
    }
  });

  document.getElementById("generate-pdf").addEventListener("click", () => {
    const val = (id) => document.getElementById(id).value.trim();
    const nom = val("nom");
    const objet = val("objet");
    const motifs = val("motifs");

    if (!nom || !objet || !motifs) {
      alert("Merci de renseigner au moins votre nom, l'objet de la décision et vos motifs de contestation.");
      return;
    }

    CitoyenKit.generatePdf({
      title: "Recours gracieux",
      subtitle: "Contestation d'une décision administrative",
      sections: [
        { heading: "Expéditeur", lines: [nom, val("adresse")] },
        { heading: "Destinataire", lines: [val("organisme")] },
        { heading: "Objet", lines: [`Recours gracieux contre : ${objet}`, val("reference") ? `Référence : ${val("reference")}` : ""] },
        { heading: "Exposé des motifs", lines: [motifs] },
        { heading: "Pièces jointes", lines: [val("pieces") || "Copie de la décision contestée"] },
      ],
      closing: [
        "Je vous prie de bien vouloir reconsidérer cette décision au vu des éléments exposés ci-dessus.",
        "Je vous remercie de l'attention que vous porterez à ma demande et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
        "",
        "Fait à _______________________, le _______________________",
        "Signature :",
      ],
      legalNote: "Ce recours gracieux, s'il est formé dans le délai de recours contentieux, interrompt ce délai : un nouveau délai de deux mois recommence à courir à compter de la réponse de l'administration ou, à défaut de réponse, à l'expiration d'un délai de deux mois valant rejet implicite.",
      filename: "recours-gracieux.pdf",
    });
  });
});
