let currentData = null;

const dateSelect = document.getElementById("dateSelect");
const contractSelect = document.getElementById("contractSelect");
const rankingBody = document.getElementById("rankingBody");
const totalLongBody = document.getElementById("totalLongBody");
const totalShortBody = document.getElementById("totalShortBody");

async function loadRankingData(date) {
  try {
    const response = await fetch(`data/ss/${date}.json`);

    if (!response.ok) {
      throw new Error("数据文件不存在");
    }

    const data = await response.json();
    currentData = data;

    renderContracts(data);
    renderTotalRanking(data);

  } catch (error) {
    currentData = null;

    contractSelect.innerHTML = "";

    rankingBody.innerHTML = `
      <tr>
        <td colspan="6">
          该日期暂无龙虎榜数据
        </td>
      </tr>
    `;

    totalLongBody.innerHTML = `
      <tr>
        <td colspan="4">
          暂无数据
        </td>
      </tr>
    `;

    totalShortBody.innerHTML = `
      <tr>
        <td colspan="4">
          暂无数据
        </td>
      </tr>
    `;
  }
}

function renderContracts(data) {
  const contracts = Object.keys(data.contracts);

  contractSelect.innerHTML = "";

  contracts.forEach(contract => {
    const option = document.createElement("option");

    option.value = contract;
    option.textContent = contract;

    contractSelect.appendChild(option);
  });

  if (contracts.length > 0) {
    renderContract(data, contracts[0]);
  }
}

function renderContract(data, contract) {
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

      <td>
        ${longItem ? formatNumber(longItem.position) : ""}
      </td>

      <td class="${getChangeClass(longItem ? longItem.change : 0)}">
        ${longItem ? formatChange(longItem.change) : ""}
      </td>

      <td>${shortItem ? shortItem.company : ""}</td>

      <td>
        ${shortItem ? formatNumber(shortItem.position) : ""}
      </td>

      <td class="${getChangeClass(shortItem ? shortItem.change : 0)}">
        ${shortItem ? formatChange(shortItem.change) : ""}
      </td>
    `;

    rankingBody.appendChild(row);
  }
}

function renderTotalRanking(data) {
  totalLongBody.innerHTML = "";
  totalShortBody.innerHTML = "";

  data.totalRanking.long.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.rank}</td>
      <td>${item.company}</td>
      <td>${formatNumber(item.position)}</td>
      <td class="${getChangeClass(item.change)}">
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
      <td>${formatNumber(item.position)}</td>
      <td class="${getChangeClass(item.change)}">
        ${formatChange(item.change)}
      </td>
    `;

    totalShortBody.appendChild(row);
  });
}

function formatChange(value) {
  if (value > 0) {
    return "+" + formatNumber(value);
  }

  return formatNumber(value);
}

function formatNumber(value) {
  return Number(value).toLocaleString("zh-CN");
}

function getChangeClass(value) {
  if (value > 0) return "positive";
  if (value < 0) return "negative";

  return "";
}

dateSelect.addEventListener("change", function () {
  loadRankingData(this.value);
});

contractSelect.addEventListener("change", function () {
  if (currentData) {
    renderContract(currentData, this.value);
  }
});

loadRankingData(dateSelect.value);
