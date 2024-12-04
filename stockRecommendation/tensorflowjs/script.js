// Fungsi untuk memformat angka dengan pemisah ribuan dan menambahkan simbol "Rp"
function formatCurrency(value) {
  if (value == null) return "Rp 0"; // Jika nilai tidak ada, tampilkan Rp 0
  return "Rp " + value.toLocaleString("id-ID");
}

async function loadModel(modelPath) {
  const model = await tf.loadLayersModel(modelPath);
  return model;
}

function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        resolve(result.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

function processCSVData(data) {
  // Daftar kolom numerik dan kolom one-hot encoded sektor
  const numericalFeatures = [
    "Revenue (IDR)",
    "Gross Profit (IDR)",
    "Net Income (IDR)",
    "Market Cap (IDR)",
    "Annual EPS",
    "Return on Equity (%)",
    "1 Year Price Returns (%)",
    "3 Year Price Returns (%)",
    "5 Year Price Returns (%)",
    "Dividend Yield (%)",
    "Payout Ratio (%)",
  ];

  // Ambil semua kolom one-hot encoded sektor secara dinamis
  const sectorFeatures = data[0]
    ? Object.keys(data[0]).filter((col) => col.startsWith("Sector_"))
    : [];

  // Gabungkan kolom numerik dan sektor yang sudah di-encoded
  const allFeatures = [...sectorFeatures, ...numericalFeatures];

  // Ambil nilai dari setiap baris CSV
  const inputData = data.map((row) => {
    return allFeatures.map((feature) => {
      // Ambil nilai untuk kolom jika ada, jika tidak ada beri nilai 0
      return row[feature] != null ? row[feature] : 0;
    });
  });

  // Kembalikan sebagai tensor 2D
  return tf.tensor2d(inputData);
}

function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, idx) => sum + val * b[idx], 0);
  const magnitude = (vec) =>
    Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitude(a) * magnitude(b));
}

async function main() {
  try {
    const model = await loadModel("model/model.json");
    const csvData = await loadCSV("dataset/company_information.csv");
    const inputTensor = processCSVData(csvData);

    // Melakukan prediksi untuk mendapatkan embeddings
    const embeddings = model.predict(inputTensor).arraySync();

    // Simpan data saham untuk referensi
    const stocks = csvData.map((row) => row["Kode Saham"]);

    // Tambahkan event listener pada tombol
    document.querySelector("button").addEventListener("click", () => {
      getRecommendations(embeddings, csvData, stocks);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

function getRecommendations(embeddings, csvData, stocks) {
  const targetReturn = parseFloat(
    document.getElementById("target-return").value
  );
  if (isNaN(targetReturn)) {
    alert("Please enter a valid target return.");
    return;
  }

  // Hitung selisih absolut untuk target return
  const returnDiff = csvData.map((row) =>
    Math.abs(row["1 Year Price Returns (%)"] - targetReturn)
  );

  // Hitung embedding rata-rata untuk target return
  const avgTargetEmbedding = embeddings[0].map((_, idx) => {
    return (
      embeddings.reduce((sum, embed) => sum + embed[idx], 0) / embeddings.length
    );
  });

  // Hitung kesamaan kosinus antara embedding target dan semua embedding saham
  const similarityScores = embeddings.map((embedding, idx) => {
    const similarity = cosineSimilarity(avgTargetEmbedding, embedding);
    return { index: idx, similarity: similarity, returnDiff: returnDiff[idx] };
  });

  // Skor gabungan (kombinasi kesamaan dan jarak return)
  const combinedScores = similarityScores.map(
    ({ index, similarity, returnDiff }) => {
      return {
        index,
        score: similarity - 0.1 * returnDiff, // Bobot untuk jarak return
      };
    }
  );

  // Urutkan berdasarkan skor dan ambil top-n saham
  combinedScores.sort((a, b) => b.score - a.score);
  const topRecommendations = combinedScores.slice(0, 68); // Ambil 10 saham teratas

  // Tampilkan hasil di tabel
  const resultsTableBody = document.querySelector("#results tbody");
  resultsTableBody.innerHTML = ""; // Kosongkan tabel sebelum diisi ulang

  topRecommendations.forEach(({ index, score }) => {
    const stockData = csvData[index];
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${stockData["Kode Saham"]}</td>
    <td>${formatCurrency(stockData["Revenue (IDR)"])}</td>
    <td>${formatCurrency(stockData["Net Income (IDR)"])}</td>
    <td>${formatCurrency(stockData["Market Cap (IDR)"])}</td>
    <td>${stockData["Annual EPS"]}</td>
    <td>${stockData["Return on Equity (%)"]}</td>
    <td>${stockData["1 Year Price Returns (%)"]}%</td>
    <td>${stockData["3 Year Price Returns (%)"]}%</td>
    <td>${stockData["5 Year Price Returns (%)"]}%</td>
    <td>${stockData["Dividend Yield (%)"]}</td>
    <td>${stockData["Payout Ratio (%)"]}</td>
    `;
    resultsTableBody.appendChild(row);
  });
}

// Jalankan fungsi utama saat halaman dimuat
window.onload = main;
