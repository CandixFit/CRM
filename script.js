// Datenbank initialisieren
let customers = JSON.parse(localStorage.getItem('customers')) || [];

// SAP-Mode Toggle
document.getElementById('sapModeToggle').addEventListener('click', function() {
    const container = document.getElementById('mainContainer');
    const isSapMode = container.classList.toggle('sap-mode');
    this.textContent = isSapMode ? 'SAP-Mode deaktivieren' : 'SAP-Mode aktivieren';
});

// Formular absenden
document.getElementById('customerForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const customerId = document.getElementById('customerId').value.toUpperCase();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value.toLowerCase();
    const phone = document.getElementById('phone').value;
    const errorDiv = document.getElementById('errorMessage');

    // Duplikatprüfung
    const isDuplicate = customers.some(customer =>
        customer.email.toLowerCase() === email ||
        customer.customerId.toUpperCase() === customerId
    );

    if (isDuplicate) {
        errorDiv.textContent = "⚠️ Kunde existiert bereits (E-Mail oder Kunden-ID doppelt)!";
        errorDiv.style.display = "block";
        return;
    }

    // Neuen Kunden hinzufügen
    customers.push({ customerId, name, email, phone });
    localStorage.setItem('customers', JSON.stringify(customers));
    renderCustomers();
    e.target.reset();
    errorDiv.style.display = "none";
});

// Kundenliste anzeigen
function renderCustomers() {
    const tbody = document.getElementById('customerList');
    tbody.innerHTML = '';

    customers.forEach((customer, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${customer.customerId}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>
                <button onclick="editCustomer(${index})">Bearbeiten</button>
                <button onclick="deleteCustomer(${index})">Löschen</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Kunden löschen
function deleteCustomer(index) {
    if (confirm("Kunden wirklich löschen?")) {
        customers.splice(index, 1);
        localStorage.setItem('customers', JSON.stringify(customers));
        renderCustomers();
    }
}

// Kunden bearbeiten
function editCustomer(index) {
    const customer = customers[index];
    document.getElementById('customerId').value = customer.customerId;
    document.getElementById('name').value = customer.name;
    document.getElementById('email').value = customer.email;
    document.getElementById('phone').value = customer.phone;

    customers.splice(index, 1);
    localStorage.setItem('customers', JSON.stringify(customers));
}

// Eingabevalidierung
document.getElementById('name').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^a-zA-ZäöüßÄÖÜ ]/g, '');
});

document.getElementById('phone').addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9+]/g, '');
});

// Initialisierung
document.addEventListener('DOMContentLoaded', renderCustomers);