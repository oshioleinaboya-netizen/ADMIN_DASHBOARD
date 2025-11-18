const { spawnSync } = require("child_process");
const fs = require("fs");
const axios = require("axios");

// ====== CONFIGURATION ======
const TELEGRAM_BOT_TOKEN = "8522079936:AAEeCXewKY-NCfGrLryGxnUXg0wbb5eUDF4";
const TELEGRAM_CHAT_ID = 6556602658;

// ====== SEND TELEGRAM MESSAGE ======
async function sendTelegramMessage(message) {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
    console.log("📨 Telegram message sent.");
  } catch (err) {
    console.error("Telegram error:", err.message);
  }
}

// ====== RUN CYPRESS TESTS ======
async function runCypress() {
  console.log("🚀 Running Cypress tests...");

  // Ensure reports folder exists
  if (!fs.existsSync("reports")) fs.mkdirSync("reports");

  // Run Cypress with mochawesome reporter
  const run = spawnSync(
    "npx",
    [
      "cypress",
      "run",
      "--reporter",
      "mochawesome",
      "--reporter-options",
      "reportDir=reports,overwrite=false,html=false,json=true",
    ],
    { stdio: "inherit", shell: true }
  );

  // Check if reports exist
  const reportFiles = fs.readdirSync("reports").filter(f => f.endsWith(".json"));
  if (reportFiles.length === 0) {
    console.log("⚠️ No mochawesome reports found!");
    await sendTelegramMessage("⚠️ No mochawesome reports found after running tests.");
    return;
  }

  // Read the report
  const latestReport = `reports/${reportFiles[reportFiles.length - 1]}`;
  const data = JSON.parse(fs.readFileSync(latestReport, "utf8"));

  function getTestsByState(data, states = ["passed", "failed"]) {
    return data.results
      ?.flatMap(r => r.suites)
      ?.flatMap(s => s.tests)
      ?.filter(t => states.includes(t.state)) || [];
  }

  const passedTests = getTestsByState(data, ["passed"]);
  const failedTests = getTestsByState(data, ["failed"]);
  const allTests = getTestsByState(data, ["passed", "failed"]);


  // Send result
  if (passedTests.length > 0 && failedTests.length === 0 && allTests.length !== 0) {
    console.log("✅ All Cypress tests passed successfully!");
    await sendTelegramMessage("✅ All Cypress tests passed successfully!");
  } else {
    const failedNames = failedTests.map(t => t.title).join("\n• ");
    const message = `❌ ${failedTests.length} test(s) failed:\n• ${failedNames}`;
    console.log(message);
    await sendTelegramMessage(message);
  }
}

// ====== EXECUTE ======
runCypress();
