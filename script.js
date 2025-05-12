// Tab-Wechsel
function switchTab(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Darkmode
document.getElementById("modeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Kunden speichern
const form = document.getElementById("kundenForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const [firma, name, email, typ, notizen] = Array.from(form.elements).map(el => el.value.trim());

  if (!firma || !name || !typ) {
    alert("Bitte Firma, Name und Typ ausfüllen.");
    return;
  }

  if (email && !/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email)) {
    alert("Bitte eine gültige E-Mail-Adresse eingeben.");
    return;
  }

  let daten = JSON.parse(localStorage.getItem("kunden")) || [];
  const doppelt = daten.some(k => k.firma === firma && k.email === email);
  if (doppelt) {
    alert("Kunde mit dieser Firma und E-Mail existiert bereits.");
    return;
  }

  daten.push({ firma, name, email, typ, notizen });
  localStorage.setItem("kunden", JSON.stringify(daten));
  form.reset();
  zeigeKunden();
  aktualisiereKundenChart();
});

function zeigeKunden() {
  const liste = document.getElementById("kundenListe");
  liste.innerHTML = "";
  const daten = JSON.parse(localStorage.getItem("kunden")) || [];

  daten.forEach((kunde, index) => {
  const li = document.createElement("li");

  const img = document.createElement("img");
  img.src = kunde.bild || "img/default-avatar.png";
  img.alt = "Profilbild";
  img.style.width = "40px";
  img.style.height = "40px";
  img.style.borderRadius = "50%";
  img.style.marginRight = "10px";
  img.style.verticalAlign = "middle";

  const span = document.createElement("span");
  span.textContent = `${kunde.firma} – ${kunde.name} (${kunde.typ})`;
  li.appendChild(img);
  li.appendChild(span)

  if (kunde.notizen) {
      const notizVorschau = document.createElement("p");
      notizVorschau.textContent = kunde.notizen.length > 100
        ? kunde.notizen.substring(0, 100) + "…"
        : kunde.notizen;
      notizVorschau.style.margin = "10px 0";
      notizVorschau.style.fontSize = "0.9rem";
      notizVorschau.style.color = "#555";
      li.appendChild(notizVorschau);
    }

    const bearbeitenBtn = document.createElement("button");
    bearbeitenBtn.textContent = "✏️";
    bearbeitenBtn.onclick = () => {
      document.getElementById("sidebarIndex").value = index;
      document.getElementById("sidebarFirma").value = kunde.firma;
      document.getElementById("sidebarName").value = kunde.name;
      document.getElementById("sidebarEmail").value = kunde.email;
      document.getElementById("sidebarTyp").value = kunde.typ;
      document.getElementById("sidebarNotizen").value = kunde.notizen;
      document.getElementById("kundenSidebar").classList.add("show");
      document.getElementById("sidebarBildVorschau").src = kunde.bild || "img/default-avatar.png";
    };

    const löschenBtn = document.createElement("button");
    löschenBtn.textContent = "🗑️";
    löschenBtn.onclick = () => {
      daten.splice(index, 1);
      localStorage.setItem("kunden", JSON.stringify(daten));
      zeigeKunden();
      aktualisiereKundenChart();
    };

    // 👉 NEU: Button-Container
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("kunden-button-container");
    buttonContainer.appendChild(bearbeitenBtn);
    buttonContainer.appendChild(löschenBtn);

    // Buttons in Container statt direkt ans <li>
    li.appendChild(buttonContainer);

    liste.appendChild(li);
  });
}

// Suche
function filterKunden() {
  const begriff = document.getElementById("sucheKunden").value.toLowerCase();
  document.querySelectorAll("#kundenListe li").forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(begriff) ? "" : "none";
  });
}

// Kunden-Chart
function aktualisiereKundenChart() {
  const daten = JSON.parse(localStorage.getItem("kunden")) || [];
  let bestandskunden = 0, interessenten = 0;
  daten.forEach(k => k.typ === "Bestandskunde" ? bestandskunden++ : interessenten++);

  const ctx = document.getElementById("kundenChart").getContext("2d");
  if (window.kundenChartInstanz) window.kundenChartInstanz.destroy();
  window.kundenChartInstanz = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Bestandskunden", "Interessenten"],
      datasets: [{
        label: "Anzahl",
        data: [bestandskunden, interessenten],
        backgroundColor: ["#2ecc71", "#3498db"]

      }]
    }
  });
}

let aktuellerMonat = new Date().getMonth();
let aktuellesJahr = new Date().getFullYear();

function erstelleKalender() {
  const container = document.getElementById("kalenderContainer");
  container.innerHTML = "";

  const erstesDatum = new Date(aktuellesJahr, aktuellerMonat, 1);
  const letzterTag = new Date(aktuellesJahr, aktuellerMonat + 1, 0).getDate();
  const wochentagStart = erstesDatum.getDay();

  document.getElementById("monatAnzeige").textContent =
    erstesDatum.toLocaleString("default", { month: "long", year: "numeric" });

  const kalender = document.createElement("table");
  const header = kalender.insertRow();
  ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"].forEach(tag => {
    const th = document.createElement("th");
    th.textContent = tag;
    header.appendChild(th);
  });

  let zeile = kalender.insertRow();
  for (let i = 0; i < wochentagStart; i++) zeile.insertCell();

    let termine = JSON.parse(localStorage.getItem("termine")) || {};
    let selektierteZelle = null;

    const feiertage = [
      `${aktuellesJahr}-01-01`, // Neujahr
      `${aktuellesJahr}-10-03`, // Tag der Deutschen Einheit
      `${aktuellesJahr}-12-25`, // Weihnachten
      `${aktuellesJahr}-12-26`  // 2. Weihnachtstag
    ];


    for (let tag = 1; tag <= letzterTag; tag++) {
      if (zeile.cells.length === 7) zeile = kalender.insertRow();
      const zelle = zeile.insertCell();
      zelle.textContent = tag;
      zelle.classList.add("kalenderTag");

      const datumKey = `${aktuellesJahr}-${String(aktuellerMonat + 1).padStart(2, '0')}-${String(tag).padStart(2, '0')}`;
      if (feiertage.includes(datumKey)) {
          zelle.classList.add("feiertag");
        }

      if (termine[datumKey]) {
          zelle.classList.add("mitTermin");
          zelle.title = termine[datumKey].join(" • ");
        }


      zelle.onclick = () => {
        if (selektierteZelle) selektierteZelle.classList.remove("aktiv");
        zelle.classList.add("aktiv");
        selektierteZelle = zelle;

        document.getElementById("terminDatum").value = datumKey;
      };
    }


  container.appendChild(kalender);
}

function speichereTermin() {
  const datum = document.getElementById("terminDatum").value;
  const text = document.getElementById("terminText").value.trim();
  const firma = document.getElementById("terminFirmaNeu").value.trim();
  const name = document.getElementById("terminPersonNeu").value.trim();

  if (!datum || !text) return;

  let termine = JSON.parse(localStorage.getItem("termine")) || {};
  if (!termine[datum]) termine[datum] = [];

  termine[datum].push({ text, firma, name, datum });

  localStorage.setItem("termine", JSON.stringify(termine));

  // Eingabefelder zurücksetzen
  document.getElementById("terminText").value = "";
  document.getElementById("terminFirmaNeu").value = "";
  document.getElementById("terminPersonNeu").value = "";

  zeigeTermine();
  aktualisiereTermineChart();
}

function zeigeTermine() {
  const liste = document.getElementById("terminListe");
  liste.innerHTML = "";
  const termine = JSON.parse(localStorage.getItem("termine")) || {};

  const alleTermine = [];
  for (const datum in termine) {
    termine[datum].forEach((eintrag, i) => {
      if (typeof eintrag === "object") {
        alleTermine.push({ datum, text: eintrag.text, index: i, firma: eintrag.firma, name: eintrag.name });
      } else {
        alleTermine.push({ datum, text: eintrag, index: i });
      }
    });

  }

  alleTermine.forEach(eintrag => {
    const li = document.createElement("li");

    const titel = document.createElement("strong");
    titel.textContent = `📅 ${eintrag.datum}`;

    const beschreibung = document.createElement("p");
    beschreibung.textContent = eintrag.text;

    const name = document.createElement("p");
    name.textContent = `👤 ${eintrag.name || "Kein Name"}`;
    name.style.fontStyle = "italic";
    name.style.margin = "0";

    const firma = document.createElement("p");
    firma.textContent = `🏢 ${eintrag.firma || "Keine Firma"}`;
    firma.style.margin = "0";
    firma.style.fontSize = "0.9rem";
    firma.style.color = "#555";

    li.appendChild(titel);
    li.appendChild(beschreibung);
    li.appendChild(name);
    li.appendChild(firma);


    const bearbeitenBtn = document.createElement("button");
    bearbeitenBtn.textContent = "✏️";
    bearbeitenBtn.onclick = () => {
      document.getElementById("terminSidebarIndex").value = eintrag.index;
      document.getElementById("terminFirma").value = eintrag.firma || "";
      document.getElementById("terminPerson").value = eintrag.name || "";
      document.getElementById("terminDatumBearbeiten").value = eintrag.datum;
      document.getElementById("terminNotiz").value = eintrag.text;

      document.getElementById("terminSidebar").classList.add("show");
    };


    const löschenBtn = document.createElement("button");
    löschenBtn.textContent = "❌";
    löschenBtn.onclick = () => {
      const termine = JSON.parse(localStorage.getItem("termine")) || {};
      termine[eintrag.datum].splice(eintrag.index, 1);
      if (termine[eintrag.datum].length === 0) delete termine[eintrag.datum];
      localStorage.setItem("termine", JSON.stringify(termine));
      zeigeTermine();
      aktualisiereTermineChart();
    };

    li.appendChild(bearbeitenBtn);
    li.appendChild(löschenBtn);
    liste.appendChild(li);

  });
}

function filterTermine() {
  const suchbegriff = document.getElementById("sucheTermine").value.toLowerCase();
  document.querySelectorAll("#terminListe li").forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(suchbegriff) ? "" : "none";
  });
}

function aktualisiereTermineChart() {
  const termine = JSON.parse(localStorage.getItem("termine")) || {};
  const monatsZähler = Array(12).fill(0);
  for (const datum in termine) {
    const monat = new Date(datum).getMonth();
    monatsZähler[monat] += termine[datum].length;
  }

  const ctx = document.getElementById("termineChart").getContext("2d");
  if (window.termineChartInstanz) window.termineChartInstanz.destroy();
  window.termineChartInstanz = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
      datasets: [{
        label: "Termine pro Monat",
        data: monatsZähler,
        borderColor: "#4a90e2",
        tension: 0.2
      }]
    }
  });
}

function wechselMonat(schritt) {
  aktuellerMonat += schritt;
  if (aktuellerMonat > 11) {
    aktuellerMonat = 0;
    aktuellesJahr++;
  } else if (aktuellerMonat < 0) {
    aktuellerMonat = 11;
    aktuellesJahr--;
  }
  erstelleKalender();
}

function speichereDokument() {
  const kunde = document.getElementById("kundenNameDokument").value.trim();
  const datei = document.getElementById("dokumentUpload").files[0];
  const rolle = document.getElementById("rolleDokument").value;

  if (!kunde || !datei) {
    alert("Kundename und Datei erforderlich.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    let daten = JSON.parse(localStorage.getItem("dokumente")) || {};
    if (!daten[kunde]) daten[kunde] = [];
    daten[kunde].push({ name: datei.name, inhalt: e.target.result, rolle });
    localStorage.setItem("dokumente", JSON.stringify(daten));
    zeigeDokumente();
  };
  reader.readAsDataURL(datei);
}

function zeigeDokumente() {
  const liste = document.getElementById("dokumentListe");
  liste.innerHTML = "";
  const daten = JSON.parse(localStorage.getItem("dokumente")) || {};
  const aktuelleRolle = document.getElementById("rolleDokument").value;

  for (const kunde in daten) {
    const titel = document.createElement("h4");
    titel.textContent = `📁 ${kunde}`;
    liste.appendChild(titel);

    daten[kunde].forEach((doc, index) => {
      if (aktuelleRolle !== "Alle" && doc.rolle !== aktuelleRolle) return;

      const li = document.createElement("li");
      li.textContent = doc.name;

      const vorschauBtn = document.createElement("button");
      vorschauBtn.textContent = "👁️ Vorschau anzeigen";
      const vorschau = document.createElement("div");
      vorschau.style.display = "none";

      if (doc.name.match(/\.pdf$/i)) {
        const iframe = document.createElement("iframe");
        iframe.src = doc.inhalt;
        iframe.width = "100%";
        iframe.height = "300";
        vorschau.appendChild(iframe);
      } else if (doc.name.match(/\.(png|jpe?g|gif)$/i)) {
        const img = document.createElement("img");
        img.src = doc.inhalt;
        img.style.maxWidth = "100%";
        vorschau.appendChild(img);
      }

      vorschauBtn.onclick = () => {
        const sichtbar = vorschau.style.display === "block";
        vorschau.style.display = sichtbar ? "none" : "block";
        vorschauBtn.textContent = sichtbar ? "👁️ Vorschau anzeigen" : "🙈 Vorschau verbergen";
      };

      const löschenBtn = document.createElement("button");
      löschenBtn.textContent = "🗑️";
      löschenBtn.onclick = () => {
        daten[kunde].splice(index, 1);
        if (daten[kunde].length === 0) delete daten[kunde];
        localStorage.setItem("dokumente", JSON.stringify(daten));
        zeigeDokumente();
      };

      li.appendChild(vorschauBtn);
      li.appendChild(löschenBtn);
      li.appendChild(vorschau);
      liste.appendChild(li);
    });
  }
}

// CSV Exporte
function exportKundenCSV() {
  const daten = JSON.parse(localStorage.getItem("kunden")) || [];
  if (!daten.length) return;
  let csv = "Firma,Name,E-Mail,Typ,Notizen\n";
  daten.forEach(k => {
    csv += `"${k.firma}","${k.name}","${k.email}","${k.typ}","${k.notizen.replace(/"/g, '""')}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "kunden.csv";
  link.click();
}

function exportTermineCSV() {
  const daten = JSON.parse(localStorage.getItem("termine")) || {};
  let csv = "Datum,Beschreibung\n";
  for (const datum in daten) {
    daten[datum].forEach(t => {
      csv += `"${datum}","${t.replace(/"/g, '""')}"\n`;
    });
  }
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "termine.csv";
  link.click();
}

function exportDokumenteCSV() {
  const daten = JSON.parse(localStorage.getItem("dokumente")) || {};
  let csv = "Kunde,Dateiname,Rolle\n";
  for (const kunde in daten) {
    daten[kunde].forEach(d => {
      csv += `"${kunde}","${d.name}","${d.rolle}"\n`;
    });
  }
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "dokumente.csv";
  link.click();
}

// Initialisierung
document.addEventListener("DOMContentLoaded", () => {
  zeigeKunden();
  erstelleKalender();
  zeigeTermine();
  zeigeDokumente();
  aktualisiereKundenChart();
  aktualisiereTermineChart();
});
document.getElementById("sidebarForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const daten = JSON.parse(localStorage.getItem("kunden")) || [];
  const index = parseInt(document.getElementById("sidebarIndex").value);

  const firma = document.getElementById("sidebarFirma").value.trim();
  const name = document.getElementById("sidebarName").value.trim();
  const email = document.getElementById("sidebarEmail").value.trim();
  const typ = document.getElementById("sidebarTyp").value;
  const notizen = document.getElementById("sidebarNotizen").value.trim();
  const bildDatei = document.getElementById("sidebarBild").files[0];

  const speichereKunde = (bild) => {
    daten[index] = {
      firma,
      name,
      email,
      typ,
      notizen,
      bild: bild || daten[index].bild || "img/default-avatar.png"
    };

    localStorage.setItem("kunden", JSON.stringify(daten));
    zeigeKunden();
    aktualisiereKundenChart();
    schließeSidebar();
  };

  if (bildDatei) {
    const reader = new FileReader();
    reader.onload = () => speichereKunde(reader.result);
    reader.readAsDataURL(bildDatei);
  } else {
    speichereKunde(); // nutzt vorhandenes Bild
  }
});


function schließeSidebar() {
  document.getElementById("kundenSidebar").classList.remove("show");
}
function schließeTerminSidebar() {
  document.getElementById("terminSidebar").classList.remove("show");
}

document.getElementById("terminSidebarForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const neuesDatum = document.getElementById("terminDatumBearbeiten").value;
  const firma = document.getElementById("terminFirma").value.trim();
  const name = document.getElementById("terminPerson").value.trim();
  const notiz = document.getElementById("terminNotiz").value.trim();
  const index = parseInt(document.getElementById("terminSidebarIndex").value);

  const termine = JSON.parse(localStorage.getItem("termine")) || {};

  // alten Eintrag finden und entfernen
  for (const datum in termine) {
    const einträge = termine[datum];
    if (datum === neuesDatum) continue; // im gleichen Datum, kein Entfernen nötig
    if (einträge[index]?.text === notiz) {
      einträge.splice(index, 1);
      if (einträge.length === 0) delete termine[datum];
      break;
    }
  }

  // neuen Eintrag speichern
  if (!termine[neuesDatum]) termine[neuesDatum] = [];
  termine[neuesDatum][index] = { text: notiz, firma, name, datum: neuesDatum };

  localStorage.setItem("termine", JSON.stringify(termine));
  zeigeTermine();
  aktualisiereTermineChart();
  schließeTerminSidebar();

  // Bestätigung
  alert("✔️ Termin wurde gespeichert.");
});
