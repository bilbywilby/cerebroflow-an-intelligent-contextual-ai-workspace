/**
 * Layered Memory Protocol (LMP) Configuration Constants
 * Based on Carter's Agent Specification
 */
export const LMP_CONFIG = {
  // Temporal Decay Lambda (λ)
  DECAY_RATE: 0.001,
  // Semantic Search Thresholds
  SIMILARITY_THRESHOLD: 0.65,
  RECON_ACCURACY_GOAL: 0.92,
  // Vector Space Specs
  EMBEDDING_DIMENSIONS: 1536,
  // Context Fusion Weights (Meta, Static, Dynamic)
  FUSION_WEIGHTS: {
    META: 0.8,
    STATIC: 0.5,
    DYNAMIC: 0.2,
  },
  // Agent Logic
  AGENT_INITIAL_PROMPT: "ACTIVATE LMP AGENT MODE: Weighted Centroid Fusion engaged. Primary directive: Synthesize disparate context nodes into high-fidelity reasoning paths.",
  // Brand Assets
  EASTER_EGG_TRIGGER: "quack",
  SYSTEM_VERSION: "CerebroFlow v1.0.13-agentic",
};