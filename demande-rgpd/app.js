document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("envoi-date");
  const result = document.getElementById("delay-result");

  dateInput.addEventListener("change", () => {
    if (!dateInput.value) { result.textContent = ""; result.className = "delay-result empty"; return; }
    const check = CitoyenKit.checkDeadlineAfter(dateInput.value, 30, "obtenir une réponse (délai de base d'un mois)");
    result.textContent = check.text + " Ce délai peut être prolongé de deux mois pour une demande complexe, à condition que l'organisme vous en informe dans le premier mois.";
    result.className = "delay-result " + (check.ok ? "ok" : "bad");
  });

  document.getElementById("generate-pdf").addEventListener("click", () => {
    const val = (id) => document.getElementById(id).value.trim();
    const nom = val("nom");
    const droit = val("droit");

    if (!nom) {
      alert("Merci de renseigner au moins votre nom.");
      return;
    }

    CitoyenKit.generatePdf({
      title: "Demande d'exercice des droits RGPD",
      subtitle: "Articles 15 à 21 du règlement général sur la protection des données",
      sections: [
        { heading: "Demandeur", lines: [nom, val("adresse")] },
        { heading: "Destinataire", lines: [val("organisme")] },
        { heading: "Droit exercé", lines: [droit] },
        { heading: "Précisions", lines: [val("precisions")] },
      ],
      closing: [
        `Conformément au règlement général sur la protection des données, je souhaite exercer mon ${droit}.`,
        "Je vous prie de bien vouloir donner suite à cette demande dans le délai légal d'un mois et de me tenir informé(e) de toute prolongation éventuelle.",
        "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
        "",
        "Fait à _______________________, le _______________________",
        "Signature :",
      ],
      legalNote: "Rappel : à défaut de réponse ou en cas de réponse insatisfaisante, vous pouvez adresser une plainte à la CNIL (cnil.fr).",
      filename: "demande-droits-rgpd.pdf",
    });
  });
});
