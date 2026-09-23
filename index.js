// qvac-completion-demo
//
// Loads a small local LLM with the QVAC SDK and runs a single
// streaming completion, entirely on-device (no cloud calls).

import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel,
} from "@qvac/sdk";

async function main() {
  console.log("Loading model on-device (this may take a moment on first run)...");

  const modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    modelType: "llm",
    onProgress: (progress) => {
      process.stdout.write(`\rDownload/load progress: ${JSON.stringify(progress)}`);
    },
  });

  console.log("\nModel loaded. Running completion...\n");

  const history = [
    {
      role: "user",
      content: "Explain what on-device AI inference means, in two sentences.",
    },
  ];

  const result = completion({ modelId, history, stream: true });

  for await (const token of result.tokenStream) {
    process.stdout.write(token);
  }

  console.log("\n\nDone. Unloading model...");
  await unloadModel({ modelId });
}

main().catch((error) => {
  console.error("\n❌ Error:", error);
  process.exit(1);
});
