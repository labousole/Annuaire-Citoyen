document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("reception-date");
  const result = document.getElementById("delay-result");

  dateInput.addEventListener("change", () => {
    if (!dateInput.value) { result.textContent = ""; result.className = "delay-result empty"; return; }
    const check = CitoyenKit.checkDeadlineAfter(dateInput.value, 14, "envoyer votre rétractation");
    result.textContent = check.text;
    result.className = "delay-result " + (check.ok ? "ok" : "bad");
  });

  document.getElementById("generate-pdf").addEventListener("click", () => {
    const val = (id) => document.getElementById(id).value.trim();
    const nom = val("nom");
    const produit = val("produit");

    if (!nom || !produit) {
      alert("Merci de renseigner au moins votre nom et le bien ou service concerné.");
      return;
    }

    CitoyenKit.generatePdf({
      title: "Lettre de rétractation",
      subtitle: "Article L221-18 du code de la consommation",
      sections: [
        { heading: "Consommateur", lines: [nom, val("adresse")] },
        { heading: "Destinataire", lines: [val("vendeur")] },
        { heading: "Commande concernée", lines: [
          val("commande") ? `Référence de commande : ${val("commande")}` : "",
          val("date-commande") ? `Date de commande : ${val("date-commande")}` : "",
          val("date-reception") ? `Date de réception : ${val("date-reception")}` : "",
        ] },
        { heading: "Bien(s) ou service(s)", lines: [produit] },
      ],
      closing: [
        "Je vous notifie par la présente ma rétractation du contrat portant sur le bien ou le service ci-dessus, conformément à l'article L221-18 du code de la consommation.",
        "Je vous remercie de me confirmer la bonne réception de cette lettre et de procéder au remboursement des sommes versées.",
        "",
        "Fait à _______________________, le _______________________",
        "Signature :",
      ],
      legalNote: "Rappel : le vendeur doit rembourser l'ensemble des sommes versées, y compris les frais de livraison standard, dans un délai de 14 jours à compter de la notification de la rétractation ou de la récupération du bien.",
      filename: "lettre-de-retractation.pdf",
    });
  });
});
