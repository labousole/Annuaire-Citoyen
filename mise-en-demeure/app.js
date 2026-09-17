document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generate-pdf").addEventListener("click", () => {
    const val = (id) => document.getElementById(id).value.trim();
    const nom = val("nom");
    const objet = val("objet");
    const faits = val("faits");

    if (!nom || !objet || !faits) {
      alert("Merci de renseigner au moins votre nom, l'objet du litige et le rappel des faits.");
      return;
    }

    CitoyenKit.generatePdf({
      title: "Mise en demeure",
      subtitle: "Lettre recommandée avec accusé de réception",
      sections: [
        { heading: "Expéditeur", lines: [nom, val("adresse")] },
        { heading: "Destinataire", lines: [val("destinataire")] },
        { heading: "Objet", lines: [`Mise en demeure — ${objet}`] },
        { heading: "Rappel des faits", lines: [faits] },
        { heading: "Demande", lines: [val("demande")] },
      ],
      closing: [
        `Je vous mets en demeure de ${val("demande") ? val("demande").toLowerCase() : "vous exécuter"} dans un délai de ${val("delai")} à compter de la réception de la présente.`,
        "À défaut, je me verrai contraint(e) d'engager toute procédure utile pour faire valoir mes droits, sans autre préavis.",
        "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
        "",
        "Fait à _______________________, le _______________________",
        "Signature :",
      ],
      legalNote: "Conservez une copie de ce courrier et l'avis de réception : ils constituent une preuve en cas de procédure ultérieure.",
      filename: "mise-en-demeure.pdf",
    });
  });
});
