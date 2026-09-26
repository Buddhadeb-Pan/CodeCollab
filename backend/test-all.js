const { execSync } = require("child_process");

const runTest = (name, command) => {
  console.log("\n" + "=".repeat(60));
  console.log(`Running: ${name}`);
  console.log("=".repeat(60));
  try {
    execSync(command, { stdio: "inherit", cwd: __dirname });
  } catch (error) {
    console.error(`❌ ${name} failed`);
    process.exit(1);
  }
};

console.log("\n🚀 CodeCollab Full Test Suite\n");

runTest("Auth Tests", "node test-auth.js");
runTest("Room Tests", "node test-rooms.js");
runTest("Execute Tests", "node test-execute.js");

console.log("\n" + "=".repeat(60));
console.log("✅ ALL TEST SUITES PASSED");
console.log("=".repeat(60) + "\n");
