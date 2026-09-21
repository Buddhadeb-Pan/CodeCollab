const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";
const testUser = {
  name: "Execute Tester",
  email: `exectest${Date.now()}@example.com`,
  password: "123456",
};

let token = "";

const log = (label, status, data) => {
  console.log("\n" + "=".repeat(50));
  console.log(`TEST: ${label}`);
  console.log(`STATUS: ${status}`);
  console.log("DATA:", JSON.stringify(data, null, 2));
  console.log("=".repeat(50));
};

const runTests = async () => {
  try {
    console.log("\n🚀 Starting Code Execution Tests...\n");

    // Register user
    let res = await axios.post(`${BASE_URL}/auth/register`, testUser);
    token = res.data.data.token;
    console.log("✅ Test user registered");

    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    // Test 1: Python
    res = await axios.post(
      `${BASE_URL}/execute`,
      { code: 'print("Hello from Python")', language: "python" },
      authHeader
    );
    log("Python hello (expect 200)", res.status, res.data);

    // Test 2: JavaScript
    res = await axios.post(
      `${BASE_URL}/execute`,
      { code: 'console.log("Hello from JS")', language: "javascript" },
      authHeader
    );
    log("JavaScript hello (expect 200)", res.status, res.data);

    // Test 3: C++
    res = await axios.post(
      `${BASE_URL}/execute`,
      {
        code: '#include <iostream>\nint main() { std::cout << "Hello from C++"; return 0; }',
        language: "cpp",
      },
      authHeader
    );
    log("C++ hello (expect 200)", res.status, res.data);

    // Test 4: Java
    res = await axios.post(
      `${BASE_URL}/execute`,
      {
        code: 'public class Main { public static void main(String[] args) { System.out.println("Hello from Java"); } }',
        language: "java",
      },
      authHeader
    );
    log("Java hello (expect 200)", res.status, res.data);

    // Test 5: Error case (Python division by zero)
    res = await axios.post(
      `${BASE_URL}/execute`,
      { code: 'print(1/0)', language: "python" },
      authHeader
    );
    log("Python error case (expect 200 with hasError: true)", res.status, res.data);

    // Test 6: Unsupported language
    try {
      await axios.post(
        `${BASE_URL}/execute`,
        { code: 'print("hi")', language: "ruby" },
        authHeader
      );
    } catch (err) {
      log("Unsupported language (expect 400)", err.response.status, err.response.data);
    }

    console.log("\n✅ ALL EXECUTION TESTS COMPLETED\n");
  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message);
    if (error.response) {
      console.error("Response:", error.response.status, error.response.data);
    }
  }
};

runTests();
