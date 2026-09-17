// Tout le traitement se fait dans le navigateur. Aucune donnée saisie
// n'est envoyée à un serveur, ni stockée au-delà de la session en cours.

document.addEventListener("DOMContentLoaded", () => {
  setupDelayCalculator();
  setupPrefectureLookup();
  setupPdfGenerator();
});

/* ---------- 1. Calculateur de délai ---------- */

function setupDelayCalculator() {
  const dateInput = document.getElementById("event-date");
  const result = document.getElementById("delay-result");

  dateInput.addEventListener("change", () => {
    if (!dateInput.value) {
      result.textContent = "";
      result.className = "delay-result empty";
      return;
    }

    const eventDate = new Date(dateInput.value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const msPerDay = 24 * 60 * 60 * 1000;
    const daysUntil = Math.round((eventDate - today) / msPerDay);

    const fmt = (d) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

    const earliest = new Date(eventDate);
    earliest.setDate(earliest.getDate() - 15);
    const latest = new Date(eventDate);
    latest.setDate(latest.getDate() - 3);

    if (daysUntil < 0) {
      result.textContent = "Cette date est déjà passée.";
      result.className = "delay-result bad";
    } else if (daysUntil < 3) {
      result.textContent = `Trop tard : la déclaration doit parvenir à l'autorité au moins 3 jours francs avant l'événement. Il ne reste que ${daysUntil} jour(s).`;
      result.className = "delay-result bad";
    } else if (daysUntil > 15) {
      result.textContent = `Trop tôt : vous pouvez déposer votre déclaration à partir du ${fmt(earliest)}, pas avant.`;
      result.className = "delay-result bad";
    } else {
      result.textContent = `Fenêtre de dépôt : entre le ${fmt(earliest)} et le ${fmt(latest)}. Déposez dès que possible.`;
      result.className = "delay-result ok";
    }
  });
}

/* ---------- 2. Annuaire des préfectures ---------- */

function setupPrefectureLookup() {
  const select = document.getElementById("departement-select");
  const details = document.getElementById("prefecture-details");

  fetch("prefectures.json")
    .then((r) => r.json())
    .then((data) => {
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Choisissez un département…";
      select.appendChild(placeholder);

      data.departements
        .sort((a, b) => a.nom.localeCompare(b.nom, "fr"))
        .forEach((dep) => {
          const opt = document.createElement("option");
          opt.value = dep.code;
          opt.textContent = `${dep.code} — ${dep.nom}`;
          select.appendChild(opt);
        });

      select.addEventListener("change", () => {
        const dep = data.departements.find((d) => d.code === select.value);
        if (!dep) {
          details.innerHTML = "";
          return;
        }
        details.innerHTML = `
          <p><strong>${escapeHtml(dep.autorite)}</strong></p>
          ${dep.adresse ? `<p>${escapeHtml(dep.adresse)}</p>` : ""}
          ${dep.telephone ? `<p>Téléphone : ${escapeHtml(dep.telephone)}</p>` : ""}
          ${dep.email ? `<p>Courriel : ${escapeHtml(dep.email)}</p>` : ""}
          ${dep.remarque ? `<p>${escapeHtml(dep.remarque)}</p>` : ""}
          ${dep.source ? `<p class="source">Source : ${escapeHtml(dep.source)}</p>` : ""}
          ${!dep.email && !dep.telephone ? `<p class="source">Coordonnées précises non répertoriées pour l'instant — consultez le site officiel du département pour trouver le bureau des sécurités / manifestations.</p>` : ""}
        `;
      });
    })
    .catch(() => {
      details.innerHTML = "<p>Impossible de charger l'annuaire pour le moment. Consultez directement le site de votre préfecture.</p>";
    });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- 3. Génération du PDF ---------- */

function setupPdfGenerator() {
  document.getElementById("generate-pdf").addEventListener("click", () => {
    const val = (id) => document.getElementById(id).value.trim();

    const fields = {
      orgNom: val("org-nom"),
      orgNaissance: val("org-naissance"),
      orgDomicile: val("org-domicile"),
      orgTel: val("org-tel"),
      orgMail: val("org-mail"),
      orgStructure: val("org-structure"),
      objet: val("objet"),
      ville: val("ville"),
      dateManif: val("date-manif"),
      heureDebut: val("heure-debut"),
      heureFin: val("heure-fin"),
      lieu: val("lieu"),
      itineraire: val("itineraire"),
      participants: val("participants"),
      observations: val("observations"),
    };

    if (!fields.orgNom || !fields.objet) {
      alert("Merci de renseigner au moins le nom de l'organisateur et l'objet de la manifestation.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const marginX = 20;
    let y = 22;
    const lineHeight = 6;
    const pageWidth = 210 - marginX * 2;

    const addWrapped = (text, size = 11, gap = lineHeight) => {
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, pageWidth);
      lines.forEach((line) => {
        if (y > 275) { doc.addPage(); y = 22; }
        doc.text(line, marginX, y);
        y += gap;
      });
    };

    doc.setFont("helvetica", "bold");
    addWrapped("DÉCLARATION DE MANIFESTATION SUR LA VOIE PUBLIQUE", 14, 8);
    doc.setFont("helvetica", "normal");
    addWrapped("(Articles L.211-1 à L.211-4 du code de la sécurité intérieure)", 9, 8);
    y += 2;

    addWrapped(
      "En application des articles L.211-1 à L.211-4 du code de la sécurité intérieure, les cortèges, défilés, " +
      "rassemblements de personnes et toute manifestation sur la voie publique sont soumis à une déclaration " +
      "préalable auprès du préfet du département (zone police) ou du maire (zone gendarmerie), trois jours francs " +
      "au moins et quinze jours francs au plus avant la date de la manifestation.",
      9.5
    );
    y += 3;

    doc.setFont("helvetica", "bold");
    addWrapped("Organisateur(s)", 12, 7);
    doc.setFont("helvetica", "normal");
    addWrapped(`Nom et prénom : ${fields.orgNom}`);
    if (fields.orgNaissance) addWrapped(`Date de naissance : ${fields.orgNaissance}`);
    if (fields.orgDomicile) addWrapped(`Domicile : ${fields.orgDomicile}`);
    if (fields.orgTel) addWrapped(`Téléphone : ${fields.orgTel}`);
    if (fields.orgMail) addWrapped(`Courriel : ${fields.orgMail}`);
    if (fields.orgStructure) addWrapped(`Représente : ${fields.orgStructure}`);
    y += 3;

    doc.setFont("helvetica", "bold");
    addWrapped("Objet de la manifestation", 12, 7);
    doc.setFont("helvetica", "normal");
    addWrapped(fields.objet);
    y += 3;

    doc.setFont("helvetica", "bold");
    addWrapped("Modalités", 12, 7);
    doc.setFont("helvetica", "normal");
    if (fields.ville) addWrapped(`Commune : ${fields.ville}`);
    if (fields.dateManif) addWrapped(`Date : ${fields.dateManif}`);
    if (fields.heureDebut) addWrapped(`Heure de rassemblement : ${fields.heureDebut}`);
    if (fields.heureFin) addWrapped(`Heure de dispersion prévue : ${fields.heureFin}`);
    if (fields.lieu) addWrapped(`Lieu de rassemblement : ${fields.lieu}`);
    if (fields.itineraire) addWrapped(`Itinéraire projeté : ${fields.itineraire}`);
    if (fields.participants) addWrapped(`Nombre de participants attendus : ${fields.participants}`);
    if (fields.observations) addWrapped(`Observations : ${fields.observations}`);
    y += 4;

    doc.setFont("helvetica", "italic");
    addWrapped(
      "Les soussignés déclarent disposer de moyens propres à assurer le caractère pacifique de cette " +
      "manifestation et s'engagent à prendre toutes dispositions pour en assurer le bon déroulement jusqu'à " +
      "complète dispersion.",
      9.5
    );
    y += 8;

    doc.setFont("helvetica", "normal");
    addWrapped("Fait à _______________________, le _______________________");
    y += 10;
    addWrapped("Signature(s) :");
    y += 14;

    doc.setFont("helvetica", "bold");
    addWrapped(
      "Rappel — article 431-9 du code pénal : organiser une manifestation sans déclaration préalable, malgré " +
      "une interdiction, ou avec une déclaration incomplète ou inexacte, est puni de six mois d'emprisonnement " +
      "et 7 500 € d'amende.",
      8.5
    );

    doc.save("declaration-manifestation.pdf");
  });
}
