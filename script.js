let aktuellerMonat = new Date().getMonth();
let aktuellesJahr = new Date().getFullYear();

function switchTab(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

document.getElementById("modeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Kunden speichern
const form = document.getElementById("kundenForm");
const kundenListe = document.getElementById("kundenListe");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const [firma, name, email, typ, notizen] = Array.from(form.elements).map(el => el.value.trim());

  const eintrag = { firma, name, email, typ, notizen };
  let daten = JSON.parse(localStorage.getItem("kunden")) || [];
  daten.push(eintrag);
  localStorage.setItem("kunden", JSON.stringify(daten));

  form.reset();
  zeigeKunden();
});

function zeigeKunden() {
  kundenListe.innerHTML = "";
  const daten = JSON.parse(localStorage.getItem("kunden")) || [];

  daten.forEach((kunde, index) => {
    const li = document.createElement("li");
    li.textContent = `${kunde.firma} – ${kunde.name} (${kunde.typ})`;

    const löschenBtn = document.createElement("button");
    löschenBtn.textContent = "🗑️";
    löschenBtn.onclick = () => {
      daten.splice(index, 1);
      localStorage.setItem("kunden", JSON.stringify(daten));
      zeigeKunden();
    };
    const bearbeitenBtn = document.createElement("button");
    bearbeitenBtn.textContent = "✏️";
    bearbeitenBtn.onclick = () => {
        const neuerName = prompt("Neuer Ansprechpartner:", kunde.name);
        if (neuerName) {
        kunde.name = neuerName;
        localStorage.setItem("kunden", JSON.stringify(daten));
        zeigeKunden();
        }
    };
    li.appendChild(bearbeitenBtn);



    li.appendChild(löschenBtn);
    kundenListe.appendChild(li);
  });

  if (daten.length > 0) {
    const alleLöschenBtn = document.createElement("button");
    alleLöschenBtn.textContent = "🧹 Alle Kunden löschen";
    alleLöschenBtn.onclick = () => {
      if (confirm("Möchtest du wirklich alle Kunden löschen?")) {
        localStorage.removeItem("kunden");
        zeigeKunden();
      }
    };
    kundenListe.appendChild(alleLöschenBtn);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  zeigeKunden();
});
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

  for (let tag = 1; tag <= letzterTag; tag++) {
    if (zeile.cells.length === 7) zeile = kalender.insertRow();
    const zelle = zeile.insertCell();
    zelle.textContent = tag;
    zelle.classList.add("kalenderTag");
    zelle.addEventListener("click", () =>
      zeigeFormular(aktuellesJahr, aktuellerMonat + 1, tag)
    );
  }

  container.appendChild(kalender);
}


function zeigeFormular(jahr, monat, tag) {
  const datum = `${jahr}-${String(monat).padStart(2, '0')}-${String(tag).padStart(2, '0')}`;
  document.getElementById("ausgewähltesDatum").textContent = datum;
  document.getElementById("terminFormular").style.display = "block";
  document.getElementById("terminText").dataset.datum = datum;
}

function speichereTermin() {
  const text = document.getElementById("terminText").value.trim();
  const datum = document.getElementById("terminText").dataset.datum;
  if (!text) return;

  let termine = JSON.parse(localStorage.getItem("termine")) || {};
  if (!termine[datum]) termine[datum] = [];
  termine[datum].push(text);
  localStorage.setItem("termine", JSON.stringify(termine));

  document.getElementById("terminText").value = "";
  document.getElementById("terminFormular").style.display = "none";
  zeigeTermine();
}

function zeigeTermine() {
  const liste = document.getElementById("terminListe");
  liste.innerHTML = "";
  const termine = JSON.parse(localStorage.getItem("termine")) || {};

  const alleTermine = [];

  for (const datum in termine) {
    termine[datum].forEach((text, i) => {
      alleTermine.push({ datum, text, index: i });
    });
  }

  alleTermine.forEach((eintrag, i) => {
    const li = document.createElement("li");
    li.textContent = `📅 ${eintrag.datum}: ${eintrag.text}`;

    // ❌ LÖSCHEN
    const löschenBtn = document.createElement("button");
    löschenBtn.textContent = "❌";
    löschenBtn.onclick = () => {
      const termine = JSON.parse(localStorage.getItem("termine")) || {};
      termine[eintrag.datum].splice(eintrag.index, 1);
      if (termine[eintrag.datum].length === 0) delete termine[eintrag.datum];
      localStorage.setItem("termine", JSON.stringify(termine));
      zeigeTermine();
    };

    // ✏️ BEARBEITEN
    const bearbeitenBtn = document.createElement("button");
    bearbeitenBtn.textContent = "✏️";
    bearbeitenBtn.onclick = () => {
        const neueBeschreibung = prompt("Neue Beschreibung:", eintrag.text);
        const neuesDatum = prompt("Neues Datum (YYYY-MM-DD):", eintrag.datum);

        if (neueBeschreibung && neuesDatum && neuesDatum.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const termine = JSON.parse(localStorage.getItem("termine")) || {};

    // Alten Termin entfernen
        termine[eintrag.datum].splice(eintrag.index, 1);
        if (termine[eintrag.datum].length === 0) delete termine[eintrag.datum];

        // Neuen Termin einfügen
        if (!termine[neuesDatum]) termine[neuesDatum] = [];
        termine[neuesDatum].push(neueBeschreibung);

        localStorage.setItem("termine", JSON.stringify(termine));
        zeigeTermine();
      } else {
        alert("Ungültige Eingabe. Format für Datum: YYYY-MM-DD");
      }
    };


    li.appendChild(bearbeitenBtn);
    li.appendChild(löschenBtn);
    liste.appendChild(li);
  });

  if (alleTermine.length > 0) {
    const alleLöschenBtn = document.createElement("button");
    alleLöschenBtn.textContent = "🧹 Alle Termine löschen";
    alleLöschenBtn.onclick = () => {
      if (confirm("Möchtest du wirklich alle Termine löschen?")) {
        localStorage.removeItem("termine");
        zeigeTermine();
      }
    };
    liste.appendChild(alleLöschenBtn);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  zeigeKunden();
  erstelleKalender();
  zeigeTermine();
  fülleKundenDropdown();

});
//Funktion: Dropdown beim Start füllen
function fülleKundenDropdown() {
  const select = document.getElementById("dokumentKunde");
  if (!select) return;

  const daten = JSON.parse(localStorage.getItem("kunden")) || [];
  daten.forEach((kunde, index) => {
    const opt = document.createElement("option");
    opt.value = kunde.name;
    opt.textContent = `${kunde.name} (${kunde.firma})`;
    select.appendChild(opt);
  });
}
//Funktion: Dateien hochladen & speichern
function ladeDateien() {
  const kunde = document.getElementById("dokumentKunde").value;
  const files = document.getElementById("dateiUpload").files;

  if (!kunde || files.length === 0) return;

  const speicher = JSON.parse(localStorage.getItem("dokumente")) || {};

  if (!speicher[kunde]) speicher[kunde] = [];

  Array.from(files).forEach(file => {
    speicher[kunde].push({
      name: file.name,
      url: URL.createObjectURL(file),
      typ: file.type,
      zeit: new Date().toISOString()
    });
  });

  localStorage.setItem("dokumente", JSON.stringify(speicher));
  zeigeDokumente(kunde);
}
//Funktion Dokumente anzeigen, löschen, laden
function zeigeDokumente(kunde) {
  const liste = document.getElementById("dokumentListe");
  liste.innerHTML = "";
  const daten = JSON.parse(localStorage.getItem("dokumente")) || {};

  if (!daten[kunde]) return;

  daten[kunde].forEach((doc, index) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = doc.url;
    link.textContent = `📄 ${doc.name}`;
    link.target = "_blank";
    li.appendChild(link);

    const löschenBtn = document.createElement("button");
    löschenBtn.textContent = "🗑️";
    löschenBtn.onclick = () => {
      daten[kunde].splice(index, 1);
      if (daten[kunde].length === 0) delete daten[kunde];
      localStorage.setItem("dokumente", JSON.stringify(daten));
      zeigeDokumente(kunde);
    };

    li.appendChild(löschenBtn);
    liste.appendChild(li);
  });
}

document.getElementById("dokumentKunde").addEventListener("change", (e) => {
  zeigeDokumente(e.target.value);
});
//kunden speichern dokumente
function speichereDokument() {
  const kunde = document.getElementById("kundenNameDokument").value.trim();
  const dateiInput = document.getElementById("dokumentUpload");
  const datei = dateiInput.files[0];

  if (!kunde || !datei) {
    alert("Bitte Kundennamen und eine Datei angeben.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    let daten = JSON.parse(localStorage.getItem("dokumente")) || {};
    if (!daten[kunde]) daten[kunde] = [];
    daten[kunde].push({ name: datei.name, inhalt: e.target.result });
    localStorage.setItem("dokumente", JSON.stringify(daten));
    zeigeDokumente();
    document.getElementById("dokumentUpload").value = "";
  };
  reader.readAsDataURL(datei);
}

function zeigeDokumente() {
  const liste = document.getElementById("dokumentListe");
  liste.innerHTML = "";
  const daten = JSON.parse(localStorage.getItem("dokumente")) || {};

  for (const kunde in daten) {
    const unterTitel = document.createElement("h4");
    unterTitel.textContent = `📁 ${kunde}`;
    liste.appendChild(unterTitel);

    daten[kunde].forEach((doc, index) => {
      const li = document.createElement("li");
      li.textContent = doc.name;

      const öffnenLink = document.createElement("a");
      öffnenLink.href = doc.inhalt;
      öffnenLink.download = doc.name;
      öffnenLink.textContent = "⬇️";
      öffnenLink.style.marginLeft = "10px";

      const löschenBtn = document.createElement("button");
      löschenBtn.textContent = "🗑️";
      löschenBtn.onclick = () => {
        daten[kunde].splice(index, 1);
        if (daten[kunde].length === 0) delete daten[kunde];
        localStorage.setItem("dokumente", JSON.stringify(daten));
        zeigeDokumente();
      };

      li.appendChild(öffnenLink);
      li.appendChild(löschenBtn);
      liste.appendChild(li);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  zeigeKunden();
  erstelleKalender();
  zeigeTermine();
  zeigeDokumente();
});


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
