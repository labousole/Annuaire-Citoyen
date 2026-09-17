document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date-greve");
  const result = document.getElementById("delay-result");

  dateInput.addEventListener("change", () => {
    if (!dateInput.value) { result.textContent = ""; result.className = "delay-result empty"; return; }
    const check = CitoyenKit.checkNoticeBefore(dateInput.value, 5, "le préavis");
    result.textContent = check.text;
    result.className = "delay-result " + (check.ok ? "ok" : "bad");
  });

  document.getElementById("generate-pdf").addEventListener("click", () => {
    const val = (id) => document.getElementById(id).value.trim();
    const syndicat = val("syndicat");
    const motifs = val("motifs");

    if (!syndicat || !motifs) {
      alert("Merci de renseigner au moins le nom du syndicat et les motifs.");
      return;
    }

    CitoyenKit.generatePdf({
      title: "Préavis de grève",
      subtitle: "Article L2512-2 du code du travail — services publics",
      sections: [
        { heading: "Organisation syndicale", lines: [syndicat, val("signataire")] },
        { heading: "Destinataire", lines: [val("destinataire")] },
        { heading: "Champ concerné", lines: [val("champ")] },
        { heading: "Modalités de la grève", lines: [
          val("heure-debut") ? `Heure de début : ${val("heure-debut")}` : "",
          val("duree") ? `Durée envisagée : ${val("duree")}` : "",
        ] },
        { heading: "Motifs du recours à la grève", lines: [motifs] },
      ],
      closing: [
        "Conformément à l'article L2512-2 du code du travail, nous vous informons du dépôt du présent préavis de grève.",
        "Nous restons à votre disposition pour toute négociation pendant la durée de ce préavis.",
        "",
        "Fait à _______________________, le _______________________",
        "Signature :",
      ],
      legalNote: "Rappel : ce préavis doit parvenir à l'autorité hiérarchique cinq jours francs avant le déclenchement de la grève et émaner d'une organisation syndicale représentative.",
      filename: "preavis-de-greve.pdf",
    });
  });
});
