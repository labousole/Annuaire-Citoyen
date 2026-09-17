document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generate-pdf").addEventListener("click", () => {
    const val = (id) => document.getElementById(id).value.trim();
    const nom = val("nom");
    const danger = val("danger");

    if (!nom || !danger) {
      alert("Merci de renseigner au moins votre nom et la description du danger.");
      return;
    }

    CitoyenKit.generatePdf({
      title: "Attestation d'exercice du droit de retrait",
      subtitle: "Article L4131-1 du code du travail",
      sections: [
        { heading: "Salarié", lines: [nom, val("poste") ? `Poste : ${val("poste")}` : ""] },
        { heading: "Employeur", lines: [val("employeur")] },
        { heading: "Circonstances", lines: [
          val("date-fait") ? `Date : ${val("date-fait")}` : "",
          val("heure-fait") ? `Heure : ${val("heure-fait")}` : "",
        ] },
        { heading: "Description du danger", lines: [danger] },
        { heading: "Alerte", lines: [val("alerte") || "Alerte donnée à ma hiérarchie."] },
      ],
      closing: [
        "J'atteste avoir exercé mon droit de retrait de bonne foi, ayant un motif raisonnable de penser que la situation décrite ci-dessus présentait pour moi un danger grave et imminent, conformément à l'article L4131-1 du code du travail.",
        "",
        "Fait à _______________________, le _______________________",
        "Signature :",
      ],
      legalNote: "Rappel : aucune sanction, retenue de salaire ou discrimination ne peut être appliquée à un salarié ayant exercé de bonne foi son droit de retrait.",
      filename: "attestation-droit-de-retrait.pdf",
    });
  });
});
