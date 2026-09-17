document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generate-pdf").addEventListener("click", () => {
    const val = (id) => document.getElementById(id).value.trim();
    const nom = val("nom");
    const faits = val("faits");

    if (!nom || !faits) {
      alert("Merci de renseigner au moins votre nom et l'exposé des faits.");
      return;
    }

    CitoyenKit.generatePdf({
      title: "Saisine du Défenseur des droits",
      subtitle: val("domaine"),
      sections: [
        { heading: "Auteur de la saisine", lines: [nom, val("adresse")] },
        { heading: "Organisme ou personne mise en cause", lines: [val("mis-en-cause")] },
        { heading: "Exposé des faits", lines: [faits] },
        { heading: "Pièces jointes", lines: [val("pieces")] },
      ],
      closing: [
        "Par la présente, je saisis le Défenseur des droits des faits exposés ci-dessus et vous remercie de l'attention que vous porterez à ma demande.",
        "Je reste à votre disposition pour tout complément d'information.",
        "",
        "Fait à _______________________, le _______________________",
        "Signature :",
      ],
      legalNote: "La saisine du Défenseur des droits est gratuite et peut être déposée en ligne sur defenseurdesdroits.fr, par courrier, ou auprès d'un délégué territorial.",
      filename: "saisine-defenseur-des-droits.pdf",
    });
  });
});
