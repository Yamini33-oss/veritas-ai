import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { askGemini } from "./services/gemini.js";
import { runReasoner } from "./agents/reasoner.js";
import { runResearcher } from "./agents/researcher.js";
import { runAnalyzer } from "./agents/analyzer.js";
import { runCritic } from "./agents/critic.js";
import { runEvidenceVerifier } from "./agents/evidenceVerifier.js";
import { runContradictionDetector } from "./agents/contradictionDetector.js";
import { runJudge } from "./agents/judge.js";
import { runVerificationPipeline } from "./services/verification.js";


dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "VERITAS backend is running",
  });
});

app.get("/api/test-gemini", async (_req, res) => {
  try {
    const answer = await askGemini(
      "Answer in one short sentence: Is Java a programming language?"
    );

    res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

app.post("/api/test-reasoner", async (req, res) => {
  try {
    const { claim } = req.body;

    if (!claim) {
      return res.status(400).json({
        success: false,
        error: "Claim is required",
      });
    }

    const result = await runReasoner(claim);

    res.json({
      success: true,
      agent: "Reasoner",
      result,
    });
  } catch (error) {
    console.error("Reasoner error:", error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

app.post("/api/test-researcher", async (req, res) => {
  try {
    const { claim } = req.body;

    if (!claim) {
      return res.status(400).json({
        success: false,
        error: "Claim is required",
      });
    }

    const result = await runResearcher(claim);

    res.json({
      success: true,
      agent: "Researcher",
      result,
    });
  } catch (error) {
    console.error("Researcher error:", error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
app.post("/api/test-analyzer", async (req, res) => {
  try {
    const { claim } = req.body;

    if (!claim) {
      return res.status(400).json({
        success: false,
        error: "Claim is required",
      });
    }

    const result = await runAnalyzer(claim);

    res.json({
      success: true,
      agent: "Analyzer",
      result,
    });
  } catch (error) {
    console.error("Analyzer error:", error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
app.post("/api/test-critic", async (req, res) => {
  try {
    const {
      claim,
      reasonerResult,
      researcherResult,
      analyzerResult,
    } = req.body;

    if (!claim) {
      return res.status(400).json({
        success: false,
        error: "Claim is required",
      });
    }

    const result = await runCritic(
      claim,
      reasonerResult,
      researcherResult,
      analyzerResult
    );

    res.json({
      success: true,
      agent: "Critic",
      result,
    });
  } catch (error) {
    console.error("Critic error:", error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
app.post("/api/test-evidence-verifier", async (req, res) => {
  try {
    const { claim, researcherResult } = req.body;

    if (!claim) {
      return res.status(400).json({
        success: false,
        error: "Claim is required",
      });
    }

    if (!researcherResult) {
      return res.status(400).json({
        success: false,
        error: "Researcher result is required",
      });
    }

    const result = await runEvidenceVerifier(
      claim,
      researcherResult
    );

    res.json({
      success: true,
      agent: "Evidence Verifier",
      result,
    });
  } catch (error) {
    console.error("Evidence Verifier error:", error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
app.post("/api/test-contradiction", async (req, res) => {
  try {
    const {
      claim,
      reasonerResult,
      researcherResult,
      analyzerResult,
      criticResult,
      evidenceVerifierResult,
    } = req.body;

    if (!claim) {
      return res.status(400).json({
        success: false,
        error: "Claim is required",
      });
    }

    const result = await runContradictionDetector(
      claim,
      reasonerResult,
      researcherResult,
      analyzerResult,
      criticResult,
      evidenceVerifierResult
    );

    res.json({
      success: true,
      agent: "Contradiction Detector",
      result,
    });
  } catch (error) {
    console.error("Contradiction Detector error:", error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
app.post("/api/test-judge", async (req, res) => {
  try {
    const {
      claim,
      reasonerResult,
      researcherResult,
      analyzerResult,
      criticResult,
      evidenceVerifierResult,
      contradictionResult,
    } = req.body;

    if (!claim) {
      return res.status(400).json({
        success: false,
        error: "Claim is required",
      });
    }

    const result = await runJudge(
      claim,
      reasonerResult,
      researcherResult,
      analyzerResult,
      criticResult,
      evidenceVerifierResult,
      contradictionResult
    );

    res.json({
      success: true,
      agent: "Judge",
      result,
    });
  } catch (error) {
    console.error("Judge error:", error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
app.post("/api/verify", async (req, res) => {
  try {
    const { claim } = req.body;

    if (!claim) {
      return res.status(400).json({
        success: false,
        error: "Claim is required",
      });
    }

    console.log(`\nStarting VERITAS verification for: "${claim}"`);

    const result = await runVerificationPipeline(claim);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("VERITAS verification error:", error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`VERITAS backend running on port ${PORT}`);
});