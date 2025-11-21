// retest.ts
import dotenv from "dotenv";
import { spawnSync } from "child_process";
import fs from "fs";
import axios from "axios";

dotenv.config();

// ====== CONFIGURATION ======
const TELEGRAM_BOT_TOKEN: string = process.env.TELEGRAM_BOT_TOKEN ?? "";
const TELEGRAM_CHAT_ID: number = Number(process.env.TELEGRAM_CHAT_ID);

// ====== SEND TELEGRAM MESSAGE ======
async function sendTelegramMessage(message: string): Promise<void> {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
    console.log("📨 Telegram message sent.");
  } catch (err: any) {
    console.error("Telegram error:", err.message);
  }
}

// Types for Mochawesome JSON structure
interface MochawesomeTest {
  title: string;
  state: "passed" | "failed" | string;
}

interface MochawesomeSuite {
  tests: MochawesomeTest[];
}

interface MochawesomeResult {
  suites: MochawesomeSuite[];
}

interface MochawesomeReport {
  results: MochawesomeResult[];
}

// ====== RUN CYPRESS TESTS ======
async function runCypress(): Promise<void> {
  console.log("🚀 Running Cypress tests...");

  if (!fs.existsSync("reports")) {
    fs.mkdirSync("reports");
  }

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

  // Fetch report files
  const reportFiles = fs
    .readdirSync("reports")
    .filter((f: string) => f.endsWith(".json"));

  if (reportFiles.length === 0) {
    console.log("⚠️ No mochawesome reports found!");
    await sendTelegramMessage("⚠️ No mochawesome reports found after running tests.");
    return;
  }

  // Read latest report
  const latestReport = `reports/${reportFiles[reportFiles.length - 1]}`;
  const reportData: MochawesomeReport = JSON.parse(fs.readFileSync(latestReport, "utf8"));

  function getTestsByState(
    data: MochawesomeReport,
    states: string[]
  ): MochawesomeTest[] {
    return (
      data.results
        ?.flatMap((r) => r.suites)
        ?.flatMap((s) => s.tests)
        ?.filter((t) => states.includes(t.state)) || []
    );
  }

  const passedTests = getTestsByState(reportData, ["passed"]);
  const failedTests = getTestsByState(reportData, ["failed"]);
  const allTests = getTestsByState(reportData, ["passed", "failed"]);

  // Send messaging results
  if (passedTests.length > 0 && failedTests.length === 0 && allTests.length !== 0) {
    console.log("✅ All Cypress tests passed successfully!");
    await sendTelegramMessage("✅ All Cypress tests passed successfully!");
  } else {
    const failedNames = failedTests.map((t) => t.title).join("\n• ");
    const message = `❌ ${failedTests.length} test(s) failed:\n• ${failedNames}`;
    console.log(message);
    await sendTelegramMessage(message);
  }
}

// ====== EXECUTE ======
runCypress();

