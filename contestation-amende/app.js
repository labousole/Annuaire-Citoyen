document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("avis-date");
  const select = document.getElementById("majoree");
  const result = document.getElementById("delay-result");

  const update = () => {
    if (!dateInput.value) { result.textContent = ""; result.className = "delay-result empty"; return; }
    const maxDays = parseInt(select.value, 10);
    const check = CitoyenKit.checkDeadlineAfter(dateInput.value, maxDays, "envoyer votre requête en exonération");
    result.textContent = check.text;
    result.className = "delay-result " + (check.ok ? "ok" : "bad");
  };

  dateInput.addEventListener("change", update);
  select.addEventListener("change", update);

  document.getElementById("generate-pdf").addEventListener("click", () => {
    const val = (id) => document.getElementById(id).value.trim();
    const nom = val("nom");
    const motif = val("motif");

    if (!nom || !motif) {
      alert("Merci de renseigner au moins votre nom et le motif de la contestation.");
      return;
    }

    CitoyenKit.generatePdf({
      title: "Requête en exonération",
      subtitle: "Contestation d'un avis de contravention (article 529-2 du code de procédure pénale)",
      sections: [
        { heading: "Déclarant", lines: [nom, val("adresse")] },
        { heading: "Avis de contravention concerné", lines: [
          val("numero-avis") ? `Numéro de l'avis : ${val("numero-avis")}` : "",
          val("date-infraction") ? `Date de l'infraction relevée : ${val("date-infraction")}` : "",
          val("immatriculation") ? `Immatriculation : ${val("immatriculation")}` : "",
        ] },
        { heading: "Motif de la contestation", lines: [motif] },
        { heading: "Pièces jointes", lines: [val("pieces") || "Copie de l'avis de contravention"] },
      ],
      closing: [
        "Je conteste par la présente l'infraction qui m'est reprochée pour les motifs exposés ci-dessus et vous demande de bien vouloir prononcer l'exonération de cette contravention.",
        "Je vous prie d'agréer, Monsieur l'Officier du Ministère public, l'expression de mes salutations distinguées.",
        "",
        "Fait à _______________________, le _______________________",
        "Signature :",
      ],
      legalNote: "Rappel : le règlement de l'amende forfaitaire vaut reconnaissance de l'infraction et rend toute contestation ultérieure impossible. N'effectuez pas ce paiement si vous souhaitez contester.",
      filename: "requete-exoneration.pdf",
    });
  });
});
