const demandProbabilities = [
  { demand: 0, probability: 0.01 },
  { demand: 10, probability: 0.2 },
  { demand: 20, probability: 0.15 },
  { demand: 30, probability: 0.5 },
  { demand: 40, probability: 0.12 },
  { demand: 50, probability: 0.02 },
];

function lcg(X0, a, c, m, n) {
  let randomNumbers = [];
  let normalizedNumbers = [];
  let Xn = X0;

  for (let i = 0; i < n; i++) {
    Xn = (a * Xn + c) % m;
    randomNumbers.push(Xn);
    normalizedNumbers.push(Xn / m);
  }

  return { randomNumbers, normalizedNumbers };
}

function calculateAverageDemand(demands, n) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += demands[i];
  }
  return total / n;
}

function getDemandWithRange(randomNumber) {
  let cumulativeProb = 0;
  for (let i = 0; i < demandProbabilities.length; i++) {
    let currentProb = demandProbabilities[i].probability;
    cumulativeProb += currentProb;
    if (randomNumber < cumulativeProb) {
      let lowerBound = cumulativeProb - currentProb;
      return {
        demand: demandProbabilities[i].demand,
        range: `[${lowerBound.toFixed(2)}, ${cumulativeProb.toFixed(2)})`,
      };
    }
  }
}

function calculateDemand() {
  let X0 = parseInt(document.getElementById("x0").value);
  let a = parseInt(document.getElementById("a").value);
  let c = parseInt(document.getElementById("c").value);
  let m = document.getElementById("m").value;
  let days = parseInt(document.getElementById("days").value) || 10;
  let averageDays = parseInt(document.getElementById("averageDays").value);
  let expectedDay = parseInt(document.getElementById("expectedDay").value);

  if (averageDays > days || averageDays < 1) {
    alert("Please enter a valid number of days for average calculation.");
    return;
  }
  if (expectedDay > days || expectedDay < 1) {
    alert("Please enter a valid day for expected demand calculation.");
    return;
  }

  let { randomNumbers, normalizedNumbers } = lcg(X0, a, c, m, days);

  let demandsWithRange = randomNumbers.map((num) =>
    getDemandWithRange(num / m)
  );

  let avgFirstNDays = calculateAverageDemand(
    demandsWithRange.map((d) => d.demand),
    averageDays
  );
  let demandNthDay = demandsWithRange[expectedDay - 1].demand;

  if (X0 < 1 || a < 1 || c < 1 || m < 1) {
    alert("Please enter a valid number for X0, a, c, m.");
    return;
  } else {
    let tableContentXiRi = `
          <h3>Generated Random Numbers</h3>
          <table border="1" cellpadding="5" cellspacing="0">
              <tr>
                  <th>Day</th>
                  <th>Xi (Generated Random Number)</th>
                  <th>Ri (Normalized Random Number)</th>
              </tr>`;

    for (let i = 0; i < days; i++) {
      tableContentXiRi += `
              <tr>
                  <td>Day ${i + 1}</td>
                  <td>${randomNumbers[i]}</td>
                  <td>${normalizedNumbers[i].toFixed(4)}</td>
              </tr>`;
    }
    tableContentXiRi += `</table>`;

    let tableContentXiDemand = `
          <h3>Demand Based on Generated Random Numbers</h3>
          <table border="1" cellpadding="5" cellspacing="0">
              <tr>
                  <th>Day</th>
                  <th>Xi (Generated Random Number)</th>
                  <th>Demand</th>
                  <th>Probability Range</th>
              </tr>`;

    for (let i = 0; i < days; i++) {
      tableContentXiDemand += `
              <tr>
                  <td>Day ${i + 1}</td>
                  <td>${randomNumbers[i]}</td>
                  <td>${demandsWithRange[i].demand}</td>
                  <td>${demandsWithRange[i].range}</td>
              </tr>`;
    }
    tableContentXiDemand += `</table>`;

    document.getElementById("result").innerHTML = `
          ${tableContentXiRi}
          ${tableContentXiDemand}
          <p>Average Daily Demand (First ${averageDays} Days): ${avgFirstNDays.toFixed()}</p>
          <p>Expected Demand on Day ${expectedDay}: ${demandNthDay}</p>
      `;
  }
}
