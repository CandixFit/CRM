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
    kundenListe.appendChild(li);
  });
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
  for (const datum in termine) {
    const einträge = termine[datum].map(text => `📅 ${datum}: ${text}`);
    einträge.forEach(e => {
      const li = document.createElement("li");
      li.textContent = e;
      liste.appendChild(li);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  zeigeKunden();
  erstelleKalender();
  zeigeTermine();
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
