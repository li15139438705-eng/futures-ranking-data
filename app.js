async function loadRankingData() {
  const response = await fetch("data/ss/2026-08-19.json");
  const data = await response.json();

  const contractSelect = document.getElementById("contractSelect");
  const rankingBody = document.getElementById("rankingBody");
  const totalLongBody = document.getElementById("totalLongBody");
  const totalShortBody = document.getElementById("totalShortBody");

  const contracts = Object.keys(data.contracts);

  contractSelect.innerHTML = "";

  contracts.forEach(contract => {
    const option = document.createElement("option");
    option.value = contract;
    option.textContent = contract;
    contractSelect.appendChild(option);
  });

  function renderContract(contract) {
    const contractData = data.contracts[contract];

    rankingBody.innerHTML = "";

    const maxRows = Math.max(
      contractData.long.length,
      contractData.short.length
    );

    for (let i = 0; i < maxRows; i++) {
      const longItem = contractData.long[i];
      const shortItem = contractData.short[i];

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${longItem ? longItem.company : ""}</td>
        <td>${longItem ? longItem.position : ""}</td>
        <td class="${longItem && longItem.change > 0 ? "positive" : longItem && longItem.change < 0 ? "negative" : ""}">
          ${longItem ? formatChange(longItem.change) : ""}
        </td>

        <td>${shortItem ? shortItem.company : ""}</td>
        <td>${shortItem ? shortItem.position : ""}</td>
        <td class="${shortItem && shortItem.change > 0 ? "positive" : shortItem && shortItem.change < 0 ? "negative" : ""}">
          ${shortItem ? formatChange(shortItem.change) : ""}
        </td>
      `;

      rankingBody.appendChild(row);
    }
  }

  function renderTotalRanking() {
    totalLongBody.innerHTML = "";
    totalShortBody.innerHTML = "";

    data.totalRanking.long.forEach(item => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.rank}</td>
        <td>${item.company}</td>
        <td>${item.position}</td>
        <td class="${item.change > 0 ? "positive" : item.change < 0 ? "negative" : ""}">
          ${formatChange(item.change)}
        </td>
      `;

      totalLongBody.appendChild(row);
    });

    data.totalRanking.short.forEach(item => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.rank}</td>
        <td>${item.company}</td>
        <td>${item.position}</td>
        <td class="${item.change > 0 ? "positive" : item.change < 0 ? "negative" : ""}">
          ${formatChange(item.change)}
        </td>
      `;

      totalShortBody.appendChild(row);
    });
  }

  function formatChange(value) {
    if (value > 0) return "+" + value;
    return value;
  }

  contractSelect.addEventListener("change", function () {
    renderContract(this.value);
  });

  renderContract(contracts[0]);
  renderTotalRanking();
}

loadRankingData();
