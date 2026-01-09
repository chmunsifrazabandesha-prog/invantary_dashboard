// Database state
let inventoryData = JSON.parse(localStorage.getItem('businessDB')) || [];
let activeTab = 'Packing';

// Configuration for table columns per tab
const tabConfig = {
    'Packing': ['Date', 'Lot No', 'Volume', 'Quantity', 'Grade'],
    'Shop Stoke': ['Date', 'Shop No', 'Pandi Name', 'Quantity'],
    'Embroidery': ['Date', 'Embry Name', 'Base', 'Quantity'],
    'Fabric': ['Date', 'Item', 'Party', 'Total Gaz']
};

document.addEventListener('DOMContentLoaded', () => {
    // Set default date to today
    document.getElementById('global-date-filter').value = new Date().toISOString().split('T')[0];
    
    // Initialize Nav Buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('.nav-btn.active').classList.remove('active');
            btn.classList.add('active');
            activeTab = btn.getAttribute('data-tab');
            renderDashboard();
        });
    });

    document.getElementById('global-date-filter').addEventListener('change', renderDashboard);
    renderDashboard();
});

function renderDashboard() {
    document.getElementById('view-title').innerText = activeTab;
    renderHeaders();
    renderTable();
}

function renderHeaders() {
    const headRow = document.getElementById('table-head');
    const cols = tabConfig[activeTab] || ['Date', 'Description', 'Quantity'];
    headRow.innerHTML = cols.map(c => `<th>${c}</th>`).join('') + `<th>Actions</th>`;
}

function renderTable() {
    const tbody = document.getElementById('table-body');
    const selectedDate = document.getElementById('global-date-filter').value;
    tbody.innerHTML = '';
    
    let dailyTotal = 0;
    let activeItems = 0;

    // Filter data for current tab
    const filtered = inventoryData.filter(item => item.tab === activeTab);

    filtered.forEach((row, index) => {
        // Daily total logic
        if (row.date === selectedDate) {
            dailyTotal += parseFloat(row.qty || 0);
            activeItems++;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="date" value="${row.date}" onchange="updateData(${row.id}, 'date', this.value)"></td>
            <td><input type="text" value="${row.col1}" placeholder="..." onchange="updateData(${row.id}, 'col1', this.value)"></td>
            <td><input type="text" value="${row.col2}" placeholder="..." onchange="updateData(${row.id}, 'col2', this.value)"></td>
            <td><input type="number" value="${row.qty}" onchange="updateData(${row.id}, 'qty', this.value)"></td>
            <td><input type="text" value="${row.col3}" placeholder="..." onchange="updateData(${row.id}, 'col3', this.value)"></td>
            <td>
                <button class="btn-save" onclick="saveData()">Save</button>
                <button class="btn-del" onclick="deleteRow(${row.id})">×</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('daily-qty').innerText = dailyTotal;
    document.getElementById('active-count').innerText = activeItems;
}

function addNewRow() {
    const newEntry = {
        id: Date.now(),
        tab: activeTab,
        date: document.getElementById('global-date-filter').value,
        col1: '', col2: '', col3: '', qty: 0
    };
    inventoryData.push(newEntry);
    renderTable();
}

function updateData(id, field, value) {
    const index = inventoryData.findIndex(i => i.id === id);
    if (index !== -1) inventoryData[index][field] = value;
}

function saveData() {
    localStorage.setItem('businessDB', JSON.stringify(inventoryData));
    alert('Database Updated!');
    renderDashboard();
}

function deleteRow(id) {
    if(confirm('Delete this record?')) {
        inventoryData = inventoryData.filter(i => i.id !== id);
        saveData();
    }
}