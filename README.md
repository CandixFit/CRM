# 🧠 CRM System – Personal Customer Manager

Ein simples, webbasiertes CRM-System, das ich entwickelt habe, um den Umgang mit Kunden-, Projekt- und Aktivitätsdaten zu üben – und um meine Fortschritte im Web-Development sichtbar zu machen.

---

## 🚀 Funktionen

- Kundenübersicht: Name, Firma, Status, Kontaktinfo
- Aktivitäten-Tracking (z. B. Anrufe, Aufgaben, Notizen)
- Login-System (nur eingeloggte User können auf geschützte Bereiche zugreifen)
- 📰 **Newsfeed:** Zeigt letzte Kundenaktionen, Erinnerungen, Updates
- Responsives UI für Desktop & Mobile
- Lokal gespeichert (optional erweiterbar für echte Datenbanken)

---

## 🛠️ Technologien

- **HTML5**, **CSS3**, **Vanilla JavaScript**
- Authentifizierung mit LocalStorage (in der aktuellen Version)
- Geplant: Vite / Express Backend + JWT + MongoDB
- Deployment über GitHub Pages

---

## 🔐 Sicherheit (Frontend-Basis)

- Login-System mit einfachem Passwortabgleich
- Zugriffsschutz für sensible Seiten via `localStorage`
- Geschützte Seiten (z. B. Newsfeed) nur für eingeloggte User sichtbar
- 🔒 Für produktive Nutzung ist ein echtes Backend notwendig

---

## 🧪 Demo

👉 **Live ansehen:**  
[https://candixfit.github.io/CRM](https://candixfit.github.io/CRM)

---

## 🧱 Projektstruktur (vereinfacht)

```txt
CRM/
├── index.html         # Login-Seite
├── dashboard.html     # Hauptansicht nach Login
├── newsfeed.html      # Geschützte Newsfeed-Seite
├── style.css
├── script.js
├── /assets
└── README.md
