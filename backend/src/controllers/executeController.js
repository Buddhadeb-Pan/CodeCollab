const axios = require("axios");

const LANGUAGE_MAP = {
  javascript: {
    compiler: "nodejs-20.17.0",
    options: "",
  },
  python: {
    compiler: "cpython-3.12.7",
    options: "",
  },
  cpp: {
    compiler: "gcc-13.2.0",
    options: "warning,gnu++2b",
  },
  java: {
    compiler: "openjdk-jdk-22+36",
    options: "",
  },
};

// Simple blocklist for obvious abuse patterns
const BLOCKED_PATTERNS = [
  /while\s*\(\s*true\s*\)/i,        // Infinite loops (while(true))
  /for\s*\(\s*;\s*;\s*\)/i,          // Infinite for loops
  /:\s*\(\s*\)\s*\{\s*:\s*\|/i,      // Fork bombs (bash)
];

const containsBlockedPattern = (code) => {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(code));
};

const executeCode = async (req, res) => {
  const { code, language, stdin = "" } = req.body;

  if (!code || typeof code !== "string") {
    res.status(400);
    throw new Error("Code is required");
  }

  if (!language || !LANGUAGE_MAP[language]) {
    res.status(400);
    throw new Error("Unsupported language. Supported: javascript, python, cpp, java");
  }

  if (code.length > 50000) {
    res.status(400);
    throw new Error("Code too long (max 50,000 characters)");
  }

  if (containsBlockedPattern(code)) {
    res.status(400);
    throw new Error("Code contains potentially unsafe patterns (infinite loops)");
  }

  const config = LANGUAGE_MAP[language];

  // Wandbox puts the primary code into 'prog.java'.
  // In Java, 'public class Main' requires the file to be 'Main.java'.
  // Converting 'public class' to 'class' allows any class (such as Main) to compile and run smoothly in prog.java.
  let executionCode = code;
  if (language === "java") {
    executionCode = executionCode.replace(/\bpublic\s+class\b/g, "class");
  }

  try {
    const startTime = Date.now();

    const response = await axios.post(
      "https://wandbox.org/api/compile.json",
      {
        code: executionCode,
        compiler: config.compiler,
        options: config.options,
        stdin: stdin,
      },
      {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const duration = Date.now() - startTime;
    const result = response.data;

    const compilerError = result.compiler_error || "";
    const programOutput = result.program_output || "";
    const programError = result.program_error || "";

    // Wandbox returns status as a string (e.g. "0" for success)
    const statusNum = Number(result.status);
    const exitCode = isNaN(statusNum) ? -1 : statusNum;

    // Combine compiler and runtime errors
    const stderr = [compilerError, programError]
      .filter((s) => s && s.length > 0)
      .join("\n");

    const hasError = exitCode !== 0 || stderr.length > 0;

    res.status(200).json({
      success: true,
      data: {
        stdout: programOutput,
        stderr: stderr,
        exitCode: exitCode,
        signal: result.signal || null,
        duration: duration,
        hasError: hasError,
        language: language,
      },
    });
  } catch (error) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return res.status(408).json({
        success: false,
        message: "Execution timed out (30 seconds)",
      });
    }

    if (error.response) {
      console.error("Wandbox API error:", error.response.status, error.response.data);
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data?.message || "Code execution failed",
      });
    }

    console.error("Execution error:", error.message);
    res.status(500);
    throw new Error("Execution service unavailable");
  }
};

module.exports = { executeCode };
