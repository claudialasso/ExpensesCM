<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Expenses - Claudia María</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<style>
  :root {
    --pink-deep: #a0005a;
    --pink-hot: #ff007f;
    --pink-mid: #e60073;
    --pink-light: #ff4fa3;
    --pink-rose: #c2185b;
    --pink-pale: #ff85c1;
    --gold-bright: #ffd84d;
    --gold-deep: #ffc300;
    --cream: #fffef2;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: var(--cream);
    color: #2a0018;
    min-height: 100vh;
  }
  header {
    background: linear-gradient(135deg, var(--pink-deep) 0%, var(--pink-hot) 60%, var(--gold-bright) 100%);
    padding: 24px 32px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 20px rgba(160,0,90,0.3);
  }
  header h1 { font-size: 1.7rem; font-weight: 700; letter-spacing: -0.5px; }
  header p { font-size: 0.85rem; opacity: 0.85; margin-top: 4px; }

  .month-tabs {
    display: flex;
    gap: 6px;
    padding: 16px 24px 0;
    overflow-x: auto;
    background: white;
    border-bottom: 2px solid #f0e0ea;
    flex-wrap: wrap;
  }
  .month-tab {
    padding: 8px 18px;
    border-radius: 20px 20px 0 0;
    border: none;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 600;
    background: #f5e6ef;
    color: var(--pink-deep);
    transition: all 0.2s;
    white-space: nowrap;
  }
  .month-tab:hover { background: var(--pink-pale); color: white; }
  .month-tab.active {
    background: linear-gradient(135deg, var(--pink-deep), var(--pink-hot));
    color: white;
    box-shadow: 0 -3px 10px rgba(160,0,90,0.25);
  }
  .month-tab.add-month {
    background: var(--gold-bright);
    color: #2a0018;
    font-size: 1.1rem;
    padding: 6px 14px;
  }
  .month-tab.add-month:hover { background: var(--gold-deep); }
  .month-tab-wrap { display: inline-flex; align-items: center; gap: 0; }
  .month-tab-wrap .month-tab { border-radius: 20px 0 0 0; }
  .delete-month-btn {
    background: linear-gradient(135deg, var(--pink-deep), var(--pink-hot));
    border: none;
    border-radius: 0 20px 0 0;
    color: white;
    cursor: pointer;
    font-size: 0.7rem;
    padding: 8px 7px 8px 4px;
    opacity: 0;
    transition: opacity 0.2s;
    line-height: 1;
  }
  .month-tab-wrap:hover .delete-month-btn { opacity: 1; }
  .month-tab-wrap .month-tab.active { border-radius: 20px 0 0 0; }
  .month-tab-wrap:hover .month-tab.active + .delete-month-btn,
  .month-tab-wrap:hover .delete-month-btn { opacity: 1; }

  .main { padding: 24px; max-width: 1400px; margin: 0 auto; }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(160,0,90,0.08);
    border-left: 4px solid var(--pink-hot);
  }
  .card.income { border-left-color: var(--gold-deep); }
  .card.balance { border-left-color: var(--pink-deep); }
  .card.fixed { border-left-color: var(--pink-pale); }
  .card label { font-size: 0.75rem; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .card .amount { font-size: 1.8rem; font-weight: 800; margin-top: 4px; color: var(--pink-deep); }
  .card.income .amount { color: #c48800; }
  .card.balance .amount { color: var(--pink-deep); }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  @media (max-width: 900px) { .grid-2 { grid-template-columns: 1fr; } }

  .panel {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(160,0,90,0.08);
  }
  .panel h3 {
    font-size: 1rem;
    font-weight: 700;
    color: var(--pink-deep);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .transactions-panel { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(160,0,90,0.08); margin-bottom: 20px; }
  .transactions-panel h3 { font-size: 1rem; font-weight: 700; color: var(--pink-deep); margin-bottom: 12px; }

  .toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
    flex-wrap: wrap;
    align-items: center;
  }
  .toolbar input, .toolbar select {
    padding: 7px 12px;
    border: 1.5px solid #f0d0e0;
    border-radius: 8px;
    font-size: 0.82rem;
    outline: none;
    background: #fff9fc;
    color: #2a0018;
    transition: border 0.2s;
  }
  .toolbar input:focus, .toolbar select:focus { border-color: var(--pink-hot); }
  .toolbar input[type="text"] { flex: 1; min-width: 160px; }

  .btn {
    padding: 7px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 600;
    transition: all 0.2s;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--pink-deep), var(--pink-hot));
    color: white;
  }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-gold { background: var(--gold-bright); color: #2a0018; }
  .btn-gold:hover { background: var(--gold-deep); }
  .btn-danger { background: #ffe0ee; color: var(--pink-deep); }
  .btn-danger:hover { background: var(--pink-pale); color: white; }

  table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  thead th {
    background: linear-gradient(135deg, var(--pink-deep), var(--pink-rose));
    color: white;
    padding: 10px 12px;
    text-align: left;
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  thead th:first-child { border-radius: 8px 0 0 0; }
  thead th:last-child { border-radius: 0 8px 0 0; }
  tbody tr { border-bottom: 1px solid #f5e6ef; transition: background 0.15s; }
  tbody tr:hover { background: #fff0f7; }
  tbody td { padding: 9px 12px; vertical-align: middle; }
  .cat-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.72rem;
    font-weight: 600;
    background: #f5e6ef;
    color: var(--pink-deep);
  }
  .egreso { color: var(--pink-deep); font-weight: 700; }
  .egreso.negative { color: #008855; }
  .ingreso { color: #c48800; font-weight: 700; }

  .add-row {
    display: grid;
    grid-template-columns: 120px 1fr 90px 90px 120px 120px 36px;
    gap: 6px;
    margin-top: 12px;
    align-items: center;
    background: #fff5fa;
    padding: 10px;
    border-radius: 10px;
    border: 1.5px dashed var(--pink-pale);
  }
  .add-row input, .add-row select {
    padding: 6px 8px;
    border: 1.5px solid #f0d0e0;
    border-radius: 6px;
    font-size: 0.8rem;
    outline: none;
    background: white;
    width: 100%;
  }
  .add-row input:focus, .add-row select:focus { border-color: var(--pink-hot); }
  .add-row .btn { padding: 7px 10px; font-size: 1rem; }

  .fixed-table { margin-bottom: 8px; }
  .fixed-table td { padding: 7px 10px; }

  .chart-wrap { position: relative; height: 220px; }

  .modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(50,0,30,0.45);
    z-index: 100;
    align-items: center;
    justify-content: center;
  }
  .modal-overlay.open { display: flex; }
  .modal {
    background: white;
    border-radius: 20px;
    padding: 28px;
    width: 380px;
    max-width: 95vw;
    box-shadow: 0 20px 60px rgba(160,0,90,0.25);
  }
  .modal h3 { color: var(--pink-deep); font-size: 1.1rem; margin-bottom: 18px; }
  .modal label { font-size: 0.8rem; color: #666; font-weight: 600; display: block; margin-bottom: 4px; margin-top: 12px; }
  .modal input, .modal select {
    width: 100%;
    padding: 9px 12px;
    border: 1.5px solid #f0d0e0;
    border-radius: 8px;
    font-size: 0.9rem;
    outline: none;
  }
  .modal input:focus, .modal select:focus { border-color: var(--pink-hot); }
  .modal-actions { display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end; }

  .empty-state { text-align: center; padding: 40px; color: #bbb; font-size: 0.9rem; }

  .delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #ccc;
    font-size: 1rem;
    padding: 2px 6px;
    border-radius: 4px;
    transition: all 0.15s;
  }
  .delete-btn:hover { color: var(--pink-deep); background: #ffe0ee; }

  .pill { display: inline-block; padding: 1px 8px; border-radius: 10px; font-size: 0.72rem; font-weight: 600; }

  @media (max-width: 700px) {
    .add-row { grid-template-columns: 1fr 1fr; }
    .summary-cards { grid-template-columns: 1fr 1fr; }
  }
</style>
</head>
<body>

<header>
  <div>
    <h1>Expenses  Claudia María</h1>
    <p>Monthly income and expenses dashboard</p>
  </div>
</header>

<div class="month-tabs" id="monthTabs"></div>

<div class="main">
  <div class="summary-cards" id="summaryCards"></div>

  <div class="grid-2">
    <div class="panel">
      <h3>Expenses by Category</h3>
      <div class="chart-wrap"><canvas id="catChart"></canvas></div>
    </div>
    <div class="panel">
      <h3>Income vs Expenses</h3>
      <div class="chart-wrap"><canvas id="barChart"></canvas></div>
    </div>
  </div>

  <div class="transactions-panel">
    <h3>Fixed Expenses</h3>
    <table class="fixed-table">
      <thead><tr><th>Description</th><th>Income</th><th>Expense</th><th></th></tr></thead>
      <tbody id="fixedBody"></tbody>
    </table>
    <div class="add-row" id="addFixedRow" style="grid-template-columns: 1fr 90px 90px 36px;">
      <input type="text" id="fixedDesc" placeholder="Description" />
      <input type="number" id="fixedIng" placeholder="Income" step="0.01" />
      <input type="number" id="fixedEgr" placeholder="Expense" step="0.01" />
      <button class="btn btn-primary" onclick="addFixed()">+</button>
    </div>
  </div>

  <div class="transactions-panel">
    <h3>Variable Transactions</h3>
    <div class="toolbar">
      <input type="text" id="searchInput" placeholder="Search..." oninput="renderTable()" />
      <select id="catFilter" onchange="renderTable()">
        <option value="">All categories</option>
      </select>
      <select id="tarjetaFilter" onchange="renderTable()">
        <option value="">All cards</option>
      </select>
    </div>
    <table>
      <thead>
        <tr>
          <th>Date</th><th>Description</th><th>Income</th><th>Expense</th><th>Category</th><th>Card</th><th></th>
        </tr>
      </thead>
      <tbody id="txBody"></tbody>
    </table>
    <div class="add-row" id="addTxRow">
      <input type="date" id="newFecha" />
      <input type="text" id="newDesc" placeholder="Description" />
      <input type="number" id="newIng" placeholder="Income" step="0.01" />
      <input type="number" id="newEgr" placeholder="Expense" step="0.01" />
      <input type="text" id="newCat" placeholder="Category" list="catSuggestions" />
      <input type="text" id="newTarjeta" placeholder="Card" list="tarjetaSuggestions" />
      <button class="btn btn-primary" onclick="addTransaction()">+</button>
    </div>
    <datalist id="catSuggestions"></datalist>
    <datalist id="tarjetaSuggestions"></datalist>
  </div>
</div>

<!-- Modal: Add Month -->
<div class="modal-overlay" id="addMonthModal">
  <div class="modal">
    <h3>Add new month</h3>
    <label>Month name (e.g. AGO 26)</label>
    <input type="text" id="newMonthName" placeholder="AGO 26" />
    <label>Copy fixed expenses from:</label>
    <select id="copyFixedFrom">
      <option value="">Don't copy (start empty)</option>
    </select>
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()" style="background:#f5e6ef;color:var(--pink-deep)">Cancel</button>
      <button class="btn btn-primary" onclick="confirmAddMonth()">Create month</button>
    </div>
  </div>
</div>

<script>
// ===== DATA =====
const INITIAL_DATA = {"JUL 26": {"fixed": [{"descripcion": "Sueldo", "ingresos": 1250.0, "egresos": 0}, {"descripcion": "IESS", "ingresos": 0, "egresos": 118.13}, {"descripcion": "Sobresueldo", "ingresos": 104.17, "egresos": 0}, {"descripcion": "CCI", "ingresos": 0, "egresos": 30.0}], "transactions": [{"fecha": "2026-02-27", "descripcion": "Sala de Despecho", "ingresos": 0, "egresos": 510.0, "categoria": "", "tarjeta": ""}]}, "JUN 26": {"fixed": [{"descripcion": "Sueldo", "ingresos": 1250.0, "egresos": 0}, {"descripcion": "IESS", "ingresos": 0, "egresos": 118.13}, {"descripcion": "Sobresueldo", "ingresos": 104.17, "egresos": 0}, {"descripcion": "CCI", "ingresos": 0, "egresos": 30.0}], "transactions": [{"fecha": "2026-02-27", "descripcion": "Sala de Despecho", "ingresos": 0, "egresos": 510.0, "categoria": "", "tarjeta": ""}]}, "MAY 26": {"fixed": [{"descripcion": "Sueldo", "ingresos": 1250.0, "egresos": 0}, {"descripcion": "IESS", "ingresos": 0, "egresos": 118.13}, {"descripcion": "Sobresueldo", "ingresos": 104.17, "egresos": 0}, {"descripcion": "CCI", "ingresos": 0, "egresos": 30.0}], "transactions": [{"fecha": "2026-02-27", "descripcion": "Sala de Despecho", "ingresos": 0, "egresos": 510.0, "categoria": "", "tarjeta": ""}]}, "ABR 26": {"fixed": [{"descripcion": "Sueldo", "ingresos": 1250.0, "egresos": 0}, {"descripcion": "IESS", "ingresos": 0, "egresos": 118.13}, {"descripcion": "Sobresueldo", "ingresos": 104.17, "egresos": 0}, {"descripcion": "CCI", "ingresos": 0, "egresos": 30.0}], "transactions": [{"fecha": "2026-02-27", "descripcion": "Sala de Despecho", "ingresos": 0, "egresos": 510.0, "categoria": "", "tarjeta": ""}]}, "MAR 26": {"fixed": [{"descripcion": "Sueldo", "ingresos": 1250.0, "egresos": 0}, {"descripcion": "IESS", "ingresos": 0, "egresos": 118.13}, {"descripcion": "Sobresueldo", "ingresos": 104.17, "egresos": 0}, {"descripcion": "CCI", "ingresos": 0, "egresos": 30.0}], "transactions": [{"fecha": "2026-02-27", "descripcion": "Sala de Despecho", "ingresos": 0, "egresos": 510.0, "categoria": "Fiesta", "tarjeta": "Titanium"}, {"fecha": "2026-03-02", "descripcion": "Tarifa CC Servicio Digital", "ingresos": 0, "egresos": 5.25, "categoria": "Tarifa", "tarjeta": "Produbanco CC"}, {"fecha": "2026-03-03", "descripcion": "Payback torta Amparito", "ingresos": 0, "egresos": -10.06, "categoria": "Comida", "tarjeta": "Produbanco"}, {"fecha": "2026-03-03", "descripcion": "Tarifa CC Gestion Cobranza", "ingresos": 0, "egresos": 6.38, "categoria": "Tarifa", "tarjeta": "Produbanco CC"}, {"fecha": "2026-03-03", "descripcion": "Diferido colchon", "ingresos": 0, "egresos": 18.38, "categoria": "Fixed Expenses", "tarjeta": "Produbanco CC"}, {"fecha": "2026-03-03", "descripcion": "ND IVA costo Financiero emisor", "ingresos": 0, "egresos": 0.96, "categoria": "Tarifa", "tarjeta": "Produbanco CC"}, {"fecha": "2026-03-03", "descripcion": "Tarifa CC", "ingresos": 0, "egresos": 0.08, "categoria": "Tarifa", "tarjeta": "Produbanco CC"}, {"fecha": "2026-03-03", "descripcion": "Lavanderia chaleco", "ingresos": 0, "egresos": 4.5, "categoria": "Otros", "tarjeta": "Pichincha"}, {"fecha": "2026-03-05", "descripcion": "Parqueadero", "ingresos": 0, "egresos": 4.5, "categoria": "Otros", "tarjeta": "Pichincha"}, {"fecha": "2026-03-07", "descripcion": "Pedidos Ya Smash", "ingresos": 0, "egresos": 11.98, "categoria": "Delivery Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-07", "descripcion": "Diferido seguro auto", "ingresos": 0, "egresos": 69.85, "categoria": "Auto", "tarjeta": "Diners"}, {"fecha": "2026-03-08", "descripcion": "Pedidos Ya Poke", "ingresos": 0, "egresos": 15.67, "categoria": "Delivery Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-08", "descripcion": "Ephimero", "ingresos": 0, "egresos": 23.0, "categoria": "Fiesta", "tarjeta": "Titanium"}, {"fecha": "2026-03-08", "descripcion": "Spotify", "ingresos": 0, "egresos": 10.99, "categoria": "Otros", "tarjeta": "Titanium"}, {"fecha": "2026-03-08", "descripcion": "Payback Giu SDD", "ingresos": 0, "egresos": -30.5, "categoria": "Fiesta", "tarjeta": "Produbanco"}, {"fecha": "2026-03-08", "descripcion": "Payback Meme SDD", "ingresos": 0, "egresos": -87.0, "categoria": "Fiesta", "tarjeta": "Produbanco"}, {"fecha": "2026-03-08", "descripcion": "Payback Luz SDD", "ingresos": 0, "egresos": -75.25, "categoria": "Fiesta", "tarjeta": "Produbanco"}, {"fecha": "2026-03-09", "descripcion": "Gasolina", "ingresos": 0, "egresos": 30.58, "categoria": "Gasolina", "tarjeta": "Titanium"}, {"fecha": "2026-03-09", "descripcion": "Pedidos Ya Rusty", "ingresos": 0, "egresos": 10.04, "categoria": "Delivery Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-10", "descripcion": "Supermaxi", "ingresos": 0, "egresos": 6.66, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-12", "descripcion": "Payback Romi SDD", "ingresos": 0, "egresos": -60.0, "categoria": "Fiesta", "tarjeta": "Produbanco"}, {"fecha": "2026-03-13", "descripcion": "Tarifa CC", "ingresos": 0, "egresos": 0.09, "categoria": "Tarifa", "tarjeta": "Produbanco CC"}, {"fecha": "2026-03-13", "descripcion": "Payback SDD botellas", "ingresos": 0, "egresos": -200.0, "categoria": "Fiesta", "tarjeta": "Titanium"}, {"fecha": "2026-03-13", "descripcion": "Tarifa CC", "ingresos": 0, "egresos": 0.03, "categoria": "Tarifa", "tarjeta": "Produbanco CC"}, {"fecha": "2026-03-14", "descripcion": "Brown Sugar", "ingresos": 0, "egresos": 12.65, "categoria": "Fiesta", "tarjeta": "Titanium"}, {"fecha": "2026-03-14", "descripcion": "H&M", "ingresos": 0, "egresos": 26.97, "categoria": "Ropa", "tarjeta": "Titanium"}, {"fecha": "2026-03-14", "descripcion": "Starbucks", "ingresos": 0, "egresos": 5.3, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-14", "descripcion": "Noe", "ingresos": 0, "egresos": 13.9, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-14", "descripcion": "Wok to Walk", "ingresos": 0, "egresos": 8.14, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-14", "descripcion": "Kai Lounge", "ingresos": 0, "egresos": 12.0, "categoria": "Fiesta", "tarjeta": "Titanium"}, {"fecha": "2026-03-14", "descripcion": "Stradivarius", "ingresos": 0, "egresos": 165.17, "categoria": "Ropa", "tarjeta": "Titanium"}, {"fecha": "2026-03-15", "descripcion": "Pizza Hut", "ingresos": 0, "egresos": 19.34, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-16", "descripcion": "Apple", "ingresos": 0, "egresos": 11.49, "categoria": "Fixed Expenses", "tarjeta": "Pichincha CC"}, {"fecha": "2026-03-16", "descripcion": "Lucia", "ingresos": 0, "egresos": 26.94, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-16", "descripcion": "El Español", "ingresos": 0, "egresos": 1.24, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-16", "descripcion": "Parqueadero", "ingresos": 0, "egresos": 3.0, "categoria": "Otros", "tarjeta": "Titanium"}, {"fecha": "2026-03-16", "descripcion": "Fybecca", "ingresos": 0, "egresos": 25.16, "categoria": "Salud", "tarjeta": "Titanium"}, {"fecha": "2026-03-16", "descripcion": "Sweet and Coffee", "ingresos": 0, "egresos": 3.7, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-16", "descripcion": "Payback Amalia SDD", "ingresos": 0, "egresos": -18.5, "categoria": "Fiesta", "tarjeta": "Pichincha"}, {"fecha": "2026-03-18", "descripcion": "Diferido cama", "ingresos": 0, "egresos": 73.38, "categoria": "Fixed Expenses", "tarjeta": "Diners"}, {"fecha": "2026-03-19", "descripcion": "Payback Fasho Spotify Mar y Abr", "ingresos": 0, "egresos": -22.0, "categoria": "Otros", "tarjeta": "Pichincha"}, {"fecha": "2026-03-19", "descripcion": "PedidosYa", "ingresos": 0, "egresos": 10.3, "categoria": "Delivery Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-20", "descripcion": "Irvix - vasos", "ingresos": 0, "egresos": 42.92, "categoria": "Otros", "tarjeta": "Titanium"}, {"fecha": "2026-03-21", "descripcion": "Diferido colchon 2", "ingresos": 0, "egresos": 47.51, "categoria": "Fixed Expenses", "tarjeta": "Produbanco CC"}, {"fecha": "2026-03-21", "descripcion": "PedidosYA chuchaqui kit", "ingresos": 0, "egresos": 6.5, "categoria": "Delivery Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-21", "descripcion": "Octofries", "ingresos": 0, "egresos": 6.5, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-03-23", "descripcion": "Rifa Primo Isis", "ingresos": 0, "egresos": 10.0, "categoria": "Otros", "tarjeta": "Pichincha"}, {"fecha": "2026-03-23", "descripcion": "Tepanyaki", "ingresos": 0, "egresos": 25.0, "categoria": "Comida", "tarjeta": "Pichincha"}, {"fecha": "2026-03-23", "descripcion": "SDD Giu", "ingresos": 0, "egresos": 12.5, "categoria": "Fiesta", "tarjeta": "Produbanco"}]}, "FEB 26": {"fixed": [{"descripcion": "Sueldo", "ingresos": 1250.0, "egresos": 0}, {"descripcion": "IESS", "ingresos": 0, "egresos": 118.13}, {"descripcion": "Sobresueldo", "ingresos": 104.17, "egresos": 0}, {"descripcion": "CCI", "ingresos": 0, "egresos": 30.0}], "transactions": [{"fecha": "2025-02-02", "descripcion": "Diferido colchon", "ingresos": 0, "egresos": 18.38, "categoria": "Fiesta", "tarjeta": "Produbanco CC"}, {"fecha": "2026-02-02", "descripcion": "DOD Planner", "ingresos": 0, "egresos": 40.94, "categoria": "Tarifa", "tarjeta": "Titanium"}, {"fecha": "2026-02-02", "descripcion": "Aguardiente Amarillo Isa Are", "ingresos": 0, "egresos": 8.98, "categoria": "Comida", "tarjeta": "Pichincha"}, {"fecha": "2026-02-02", "descripcion": "Lunch YOO Emi", "ingresos": 0, "egresos": 9.55, "categoria": "Tarifa", "tarjeta": "Pichincha"}, {"fecha": "2026-02-03", "descripcion": "Peaje", "ingresos": 0, "egresos": 15.31, "categoria": "Fixed Expenses", "tarjeta": "Pichincha CC"}, {"fecha": "2026-02-04", "descripcion": "Zona azul", "ingresos": 0, "egresos": 0.8, "categoria": "Tarifa", "tarjeta": "Pichincha"}, {"fecha": "2026-02-05", "descripcion": "Padel", "ingresos": 0, "egresos": 136.0, "categoria": "Otros", "tarjeta": "Produbanco"}, {"fecha": "2026-02-06", "descripcion": "Payback Carlos M lunch", "ingresos": 0, "egresos": -10.5, "categoria": "Delivery Comida", "tarjeta": "Produbanco"}, {"fecha": "2026-02-06", "descripcion": "Payback Peter lunch", "ingresos": 0, "egresos": -10.5, "categoria": "Delivery Comida", "tarjeta": "Produbanco"}, {"fecha": "2026-02-06", "descripcion": "Pedidosya 227", "ingresos": 0, "egresos": 40.89, "categoria": "Delivery Comida", "tarjeta": "Titanium"}, {"fecha": "2026-02-06", "descripcion": "Pedidosya 227 propina", "ingresos": 0, "egresos": 1.19, "categoria": "Delivery Comida", "tarjeta": "Titanium"}, {"fecha": "2026-02-06", "descripcion": "La Birreria", "ingresos": 0, "egresos": 19.0, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-02-06", "descripcion": "Payback Lucy lunch", "ingresos": 0, "egresos": -10.5, "categoria": "Delivery Comida", "tarjeta": "Pichincha"}, {"fecha": "2026-02-07", "descripcion": "Diferido seguro auto", "ingresos": 0, "egresos": 69.85, "categoria": "Auto", "tarjeta": "Diners"}, {"fecha": "2026-02-08", "descripcion": "Pedidosya hamburguesa", "ingresos": 0, "egresos": 13.42, "categoria": "Delivery Comida", "tarjeta": "Titanium"}, {"fecha": "2026-02-08", "descripcion": "Uber", "ingresos": 0, "egresos": 12.88, "categoria": "Otros", "tarjeta": "Titanium"}, {"fecha": "2026-02-08", "descripcion": "Spotify", "ingresos": 0, "egresos": 10.99, "categoria": "Otros", "tarjeta": "Titanium"}, {"fecha": "2026-02-09", "descripcion": "Poke CCI", "ingresos": 0, "egresos": 14.3, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-02-11", "descripcion": "Urbapark", "ingresos": 0, "egresos": 1.0, "categoria": "Otros", "tarjeta": "Titanium"}, {"fecha": "2026-02-12", "descripcion": "Poke CCI", "ingresos": 0, "egresos": 15.8, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-02-13", "descripcion": "Interesting por Mora ????", "ingresos": 0, "egresos": 0.03, "categoria": "Otros", "tarjeta": "Produbanco CC"}, {"fecha": "2026-02-13", "descripcion": "Gatorade gasolinera", "ingresos": 0, "egresos": 3.85, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-02-13", "descripcion": "Uber", "ingresos": 0, "egresos": 11.02, "categoria": "Otros", "tarjeta": "Titanium"}, {"fecha": "2026-02-14", "descripcion": "Tipti Pizzas", "ingresos": 0, "egresos": 24.18, "categoria": "Comida", "tarjeta": "Diners"}, {"fecha": "2026-02-14", "descripcion": "Multicines", "ingresos": 0, "egresos": 38.0, "categoria": "Otros", "tarjeta": "Titanium"}, {"fecha": "2026-02-15", "descripcion": "Gasolina", "ingresos": 0, "egresos": 25.0, "categoria": "Gasolina", "tarjeta": "Titanium"}, {"fecha": "2026-02-16", "descripcion": "Apple", "ingresos": 0, "egresos": 11.49, "categoria": "Fixed Expenses", "tarjeta": "Pichincha CC"}, {"fecha": "2026-02-18", "descripcion": "Diferido cama", "ingresos": 0, "egresos": 73.38, "categoria": "Fixed Expenses", "tarjeta": "Diners"}, {"fecha": "2026-02-18", "descripcion": "Payback Spotify Fasho", "ingresos": 0, "egresos": -14.0, "categoria": "Otros", "tarjeta": "Pichincha"}, {"fecha": "2026-02-18", "descripcion": "Bizcochos", "ingresos": 0, "egresos": 4.5, "categoria": "Comida", "tarjeta": "Pichincha"}, {"fecha": "2026-02-18", "descripcion": "Payback cine y pizzas Meme", "ingresos": 0, "egresos": -19.86, "categoria": "Comida", "tarjeta": "Pichincha"}, {"fecha": "2026-02-18", "descripcion": "Regalo MJ - Isis (menos cine y pizza)", "ingresos": 0, "egresos": 5.9, "categoria": "Otros", "tarjeta": "Pichincha"}, {"fecha": "2026-02-18", "descripcion": "La Capricciosa", "ingresos": 0, "egresos": 18.02, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-02-18", "descripcion": "no se", "ingresos": 0, "egresos": 6.75, "categoria": "Otros", "tarjeta": "Titanium"}, {"fecha": "2026-02-19", "descripcion": "De Prati", "ingresos": 0, "egresos": 71.94, "categoria": "Otros", "tarjeta": "Titanium"}, {"fecha": "2026-02-19", "descripcion": "Megamaxi", "ingresos": 0, "egresos": 34.3, "categoria": "Comida", "tarjeta": "Titanium"}, {"fecha": "2026-02-19", "descripcion": "Starbucks", "ingresos": 0, "egresos": 4.4, "categoria": "Salud", "tarjeta": "Titanium"}, {"fecha": "2026-02-19", "descripcion": "Payback mama Medicity", "ingresos": 0, "egresos": 19.0, "categoria": "Comida", "tarjeta": "Pichincha"}, {"fecha": "2026-02-21", "descripcion": "Diferido colchon 2", "ingresos": 0, "egresos": 47.51, "categoria": "Fixed Expenses", "tarjeta": "Produbanco CC"}, {"fecha": "2026-02-21", "descripcion": "Rooftop El Brujo", "ingresos": 0, "egresos": 8.0, "categoria": "Fiesta", "tarjeta": "Titanium"}, {"fecha": "2026-02-21", "descripcion": "Pedidos Ya", "ingresos": 0, "egresos": 15.67, "categoria": "Delivery Comida", "tarjeta": "Titanium"}, {"fecha": "2026-02-22", "descripcion": "Uber", "ingresos": 0, "egresos": 2.1, "categoria": "Otros", "tarjeta": "Titanium"}, {"fecha": "2026-02-22", "descripcion": "Ephimero", "ingresos": 0, "egresos": 46.0, "categoria": "Fiesta", "tarjeta": "Titanium"}, {"fecha": "2026-02-23", "descripcion": "Parqueadero Parque", "ingresos": 0, "egresos": 7.5, "categoria": "Otros", "tarjeta": "Pichincha"}, {"fecha": "2026-02-23", "descripcion": "Payback Ephimero Meme", "ingresos": 0, "egresos": -20.0, "categoria": "Fiesta", "tarjeta": "Pichincha"}, {"fecha": "2026-02-24", "descripcion": "Regalo Meme", "ingresos": 0, "egresos": 87.0, "categoria": "Otros", "tarjeta": "Titanium"}, {"fecha": "2026-02-25", "descripcion": "Payback cine Fasho", "ingresos": 0, "egresos": 15.0, "categoria": "Otros", "tarjeta": "Pichincha"}, {"fecha": "2026-02-25", "descripcion": "Medicity", "ingresos": 0, "egresos": 68.21, "categoria": "Salud", "tarjeta": "Titanium"}, {"fecha": "2026-02-26", "descripcion": "Uber", "ingresos": 0, "egresos": 2.0, "categoria": "Otros", "tarjeta": "Titanium"}, {"fecha": "2026-02-26", "descripcion": "Payback Luz regalo Meme", "ingresos": 0, "egresos": -44.0, "categoria": "Otros", "tarjeta": "Produbanco"}, {"fecha": "2026-02-27", "descripcion": "ChatGPT Plus", "ingresos": 0, "egresos": 19.99, "categoria": "Otros", "tarjeta": "Pichincha CC"}, {"fecha": "2026-02-27", "descripcion": "Plan deuda protegida", "ingresos": 0, "egresos": 2.98, "categoria": "Tarifa", "tarjeta": "Pichincha CC"}, {"fecha": "2026-02-27", "descripcion": "Iva Servicios Digitales", "ingresos": 0, "egresos": 3.0, "categoria": "Tarifa", "tarjeta": "Pichincha CC"}, {"fecha": "2026-02-28", "descripcion": "Fybecca", "ingresos": 0, "egresos": 4.7, "categoria": "Salud", "tarjeta": "Titanium"}, {"fecha": "2026-02-28", "descripcion": "Pedidos Ya", "ingresos": 0, "egresos": 25.13, "categoria": "Delivery Comida", "tarjeta": "Titanium"}, {"fecha": "2026-02-28", "descripcion": "Coursera", "ingresos": 0, "egresos": 35.0, "categoria": "Otros", "tarjeta": "Produbanco CC"}]}, "ENE 26": {"fixed": [], "transactions": []}};

const COLORS = ['#a0005a','#ff007f','#e60073','#ff4fa3','#c2185b','#ff85c1','#ffd84d','#ffc300','#b5004e','#ff3394'];

// Storage key
const SK = 'gastos_claudia_maria_v1';

function loadData() {
  try {
    const saved = localStorage.getItem(SK);
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

function saveData() {
  localStorage.setItem(SK, JSON.stringify(data));
}

let data = loadData();
let currentMonth = Object.keys(data)[0];
let catChartInst = null, barChartInst = null;

// Month order for sorting
const MONTH_ORDER = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
function monthSortKey(key) {
  const parts = key.split(' ');
  const m = MONTH_ORDER.indexOf(parts[0]);
  const y = parseInt(parts[1]) || 0;
  return y * 100 + m;
}

function getSortedMonths() {
  return Object.keys(data).sort((a,b) => monthSortKey(a) - monthSortKey(b));
}

// ===== RENDER TABS =====
function renderTabs() {
  const tabs = document.getElementById('monthTabs');
  tabs.innerHTML = '';
  const months = getSortedMonths();
  months.forEach(m => {
    const wrap = document.createElement('div');
    wrap.className = 'month-tab-wrap';

    const btn = document.createElement('button');
    btn.className = 'month-tab' + (m === currentMonth ? ' active' : '');
    btn.textContent = m;
    btn.onclick = () => { currentMonth = m; render(); };

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-month-btn';
    delBtn.title = 'Delete month';
    delBtn.textContent = '';
    delBtn.onclick = (e) => { e.stopPropagation(); deleteMonth(m); };

    wrap.appendChild(btn);
    wrap.appendChild(delBtn);
    tabs.appendChild(wrap);
  });
  const addBtn = document.createElement('button');
  addBtn.className = 'month-tab add-month';
  addBtn.textContent = '+ Month';
  addBtn.onclick = openAddMonth;
  tabs.appendChild(addBtn);
}

function deleteMonth(m) {
  const months = getSortedMonths();
  if (months.length <= 1) { alert('You cannot delete the only remaining month.'); return; }
  if (!confirm(`Are you sure you want to delete "${m}" and all its data?`)) return;
  delete data[m];
  // Switch to adjacent month if needed
  if (currentMonth === m) {
    const remaining = getSortedMonths();
    currentMonth = remaining[remaining.length - 1];
  }
  saveData();
  render();
}

// ===== TOTALS =====
function getTotals(month) {
  const md = data[month];
  let fixedIng = 0, fixedEgr = 0, varIng = 0, varEgr = 0;
  (md.fixed || []).forEach(f => { fixedIng += f.ingresos; fixedEgr += f.egresos; });
  (md.transactions || []).forEach(t => { varIng += t.ingresos; varEgr += t.egresos; });
  return { fixedIng, fixedEgr, varIng, varEgr,
    totalIng: fixedIng + varIng, totalEgr: fixedEgr + varEgr,
    balance: (fixedIng + varIng) - (fixedEgr + varEgr) };
}

function fmt(n) { return '$' + Math.abs(n).toFixed(2); }

// ===== SUMMARY CARDS =====
function renderSummary() {
  const t = getTotals(currentMonth);
  document.getElementById('summaryCards').innerHTML = `
    <div class="card income"><label>Total Income</label><div class="amount">${fmt(t.totalIng)}</div></div>
    <div class="card"><label>Total Expenses</label><div class="amount" style="color:var(--pink-hot)">${fmt(t.totalEgr)}</div></div>
    <div class="card balance"><label>Balance</label><div class="amount" style="color:${t.balance>=0?'#c48800':'var(--pink-hot)'}">${t.balance>=0?'':''}${fmt(t.balance)}</div></div>
    <div class="card fixed"><label>Fixed Expenses</label><div class="amount" style="color:var(--pink-rose)">${fmt(t.fixedEgr)}</div></div>
  `;
}

// ===== CHARTS =====
function getCatTotals() {
  const md = data[currentMonth];
  const cats = {};
  (md.transactions || []).forEach(t => {
    if (t.egresos > 0) {
      const c = t.categoria || 'Sin categoría';
      cats[c] = (cats[c] || 0) + t.egresos;
    }
  });
  return cats;
}

function renderCharts() {
  const cats = getCatTotals();
  const labels = Object.keys(cats);
  const values = labels.map(l => cats[l]);

  if (catChartInst) catChartInst.destroy();
  const ctx1 = document.getElementById('catChart').getContext('2d');
  catChartInst = new Chart(ctx1, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: COLORS, borderWidth: 2, borderColor: '#fffef2' }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { font: { size: 10 }, color: '#2a0018', boxWidth: 12, padding: 8 } }
      }
    }
  });

  // Bar: ingresos vs egresos per month
  const months = getSortedMonths();
  const ingData = months.map(m => getTotals(m).totalIng);
  const egrData = months.map(m => getTotals(m).totalEgr);

  if (barChartInst) barChartInst.destroy();
  const ctx2 = document.getElementById('barChart').getContext('2d');
  barChartInst = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'Income', data: ingData, backgroundColor: '#ffd84d', borderRadius: 6 },
        { label: 'Expenses', data: egrData, backgroundColor: '#ff007f', borderRadius: 6 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#2a0018', font: { size: 10 } } } },
      scales: {
        x: { ticks: { color: '#2a0018', font: { size: 9 } } },
        y: { ticks: { color: '#2a0018', font: { size: 9 }, callback: v => '$'+v } }
      }
    }
  });
}

// ===== FIXED TABLE =====
function renderFixed() {
  const md = data[currentMonth];
  const tbody = document.getElementById('fixedBody');
  if (!md.fixed || md.fixed.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No fixed expenses</td></tr>';
    return;
  }
  tbody.innerHTML = md.fixed.map((f, i) => `
    <tr>
      <td>${f.descripcion}</td>
      <td class="ingreso">${f.ingresos > 0 ? fmt(f.ingresos) : ''}</td>
      <td class="egreso">${f.egresos > 0 ? fmt(f.egresos) : ''}</td>
      <td><button class="delete-btn" onclick="deleteFixed(${i})"></button></td>
    </tr>
  `).join('');
}

function addFixed() {
  const desc = document.getElementById('fixedDesc').value.trim();
  const ing = parseFloat(document.getElementById('fixedIng').value) || 0;
  const egr = parseFloat(document.getElementById('fixedEgr').value) || 0;
  if (!desc) return;
  data[currentMonth].fixed.push({ descripcion: desc, ingresos: ing, egresos: egr });
  saveData();
  document.getElementById('fixedDesc').value = '';
  document.getElementById('fixedIng').value = '';
  document.getElementById('fixedEgr').value = '';
  render();
}

function deleteFixed(i) {
  data[currentMonth].fixed.splice(i, 1);
  saveData(); render();
}

// ===== TRANSACTION TABLE =====
function getFilteredTx() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const catF = document.getElementById('catFilter').value;
  const tarjF = document.getElementById('tarjetaFilter').value;
  return (data[currentMonth].transactions || []).filter(t => {
    if (search && !t.descripcion.toLowerCase().includes(search)) return false;
    if (catF && t.categoria !== catF) return false;
    if (tarjF && t.tarjeta !== tarjF) return false;
    return true;
  });
}

function updateFilters() {
  const txs = data[currentMonth].transactions || [];
  const cats = [...new Set(txs.map(t => t.categoria).filter(Boolean))].sort();
  const tarjetas = [...new Set(txs.map(t => t.tarjeta).filter(Boolean))].sort();

  const catSel = document.getElementById('catFilter');
  const catVal = catSel.value;
  catSel.innerHTML = '<option value="">All categories</option>' +
    cats.map(c => `<option value="${c}">${c}</option>`).join('');
  if (cats.includes(catVal)) catSel.value = catVal;

  const tarjSel = document.getElementById('tarjetaFilter');
  const tarjVal = tarjSel.value;
  tarjSel.innerHTML = '<option value="">Todas las tarjetas</option>' +
    tarjetas.map(t => `<option value="${t}">${t}</option>`).join('');
  if (tarjetas.includes(tarjVal)) tarjSel.value = tarjVal;

  // datalists
  document.getElementById('catSuggestions').innerHTML = cats.map(c => `<option value="${c}">`).join('');
  document.getElementById('tarjetaSuggestions').innerHTML = tarjetas.map(t => `<option value="${t}">`).join('');
}

function renderTable() {
  const txs = getFilteredTx();
  const tbody = document.getElementById('txBody');
  if (txs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Sin transacciones</td></tr>';
    return;
  }
  const allTx = data[currentMonth].transactions;
  tbody.innerHTML = txs.map(t => {
    const i = allTx.indexOf(t);
    return `
    <tr>
      <td>${t.fecha}</td>
      <td>${t.descripcion}</td>
      <td class="ingreso">${t.ingresos > 0 ? fmt(t.ingresos) : ''}</td>
      <td class="${t.egresos < 0 ? 'egreso negative' : 'egreso'}">${t.egresos !== 0 ? fmt(t.egresos) : ''}</td>
      <td><span class="cat-badge">${t.categoria || ''}</span></td>
      <td><span class="pill" style="background:#fff0f7;color:var(--pink-deep)">${t.tarjeta || ''}</span></td>
      <td><button class="delete-btn" onclick="deleteTx(${i})"></button></td>
    </tr>`;
  }).join('');
}

function addTransaction() {
  const fecha = document.getElementById('newFecha').value;
  const desc = document.getElementById('newDesc').value.trim();
  const ing = parseFloat(document.getElementById('newIng').value) || 0;
  const egr = parseFloat(document.getElementById('newEgr').value) || 0;
  const cat = document.getElementById('newCat').value.trim();
  const tarjeta = document.getElementById('newTarjeta').value.trim();
  if (!desc) return;
  if (!data[currentMonth].transactions) data[currentMonth].transactions = [];
  data[currentMonth].transactions.push({ fecha, descripcion: desc, ingresos: ing, egresos: egr, categoria: cat, tarjeta });
  data[currentMonth].transactions.sort((a,b) => a.fecha.localeCompare(b.fecha));
  saveData();
  document.getElementById('newFecha').value = '';
  document.getElementById('newDesc').value = '';
  document.getElementById('newIng').value = '';
  document.getElementById('newEgr').value = '';
  document.getElementById('newCat').value = '';
  document.getElementById('newTarjeta').value = '';
  render();
}

function deleteTx(i) {
  data[currentMonth].transactions.splice(i, 1);
  saveData(); render();
}

// ===== ADD MONTH MODAL =====
function openAddMonth() {
  const sel = document.getElementById('copyFixedFrom');
  sel.innerHTML = '<option value="">Sin copiar (vacío)</option>' +
    getSortedMonths().map(m => `<option value="${m}">${m}</option>`).join('');
  document.getElementById('newMonthName').value = '';
  document.getElementById('addMonthModal').classList.add('open');
}

function closeModal() {
  document.getElementById('addMonthModal').classList.remove('open');
}

function confirmAddMonth() {
  const name = document.getElementById('newMonthName').value.trim().toUpperCase();
  if (!name) return;
  if (data[name]) { alert('Este mes ya existe'); return; }
  const copyFrom = document.getElementById('copyFixedFrom').value;
  const fixedCopy = copyFrom ? JSON.parse(JSON.stringify(data[copyFrom].fixed)) : [];
  data[name] = { fixed: fixedCopy, transactions: [] };
  currentMonth = name;
  saveData();
  closeModal();
  render();
}

// ===== MAIN RENDER =====
function render() {
  renderTabs();
  renderSummary();
  renderFixed();
  updateFilters();
  renderTable();
  renderCharts();
}

// Set today's date on load
const today = new Date().toISOString().split('T')[0];
document.getElementById('newFecha').value = today;

render();
</script>
</body>
</html>