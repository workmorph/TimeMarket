interface Experiment {
  id: string;
  variants: string[];
  trafficSplit: Record<string, number>;
  metrics: string[];
  status: "RUNNING" | "PAUSED" | "COMPLETED";
}

interface ExperimentResult {
  experimentId: string;
  variant: string;
  userId: string;
  metrics: Record<string, number>;
  timestamp: Date;
}

class ABTestingFramework {
  private experiments: Map<string, Experiment>;
  private results: ExperimentResult[];

  constructor() {
    this.experiments = new Map();
    this.results = [];
  }

  createExperiment(
    experimentId: string,
    variants: string[],
    trafficSplit: Record<string, number>
  ): Experiment {
    // Validate traffic split adds up to 100
    const totalSplit = Object.values(trafficSplit).reduce((sum, val) => sum + val, 0);
    if (Math.abs(totalSplit - 100) > 0.01) {
      throw new Error("Traffic split must add up to 100%");
    }

    const experiment = {
      id: experimentId,
      variants,
      trafficSplit,
      metrics: ["conversion_rate", "average_order_value", "user_engagement"],
      status: "RUNNING" as const,
    };

    this.experiments.set(experimentId, experiment);
    return experiment;
  }

  assignVariant(userId: string, experimentId: string): string {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    if (experiment.status !== "RUNNING") {
      throw new Error(`Experiment ${experimentId} is not running`);
    }

    const hash = this.hashUserId(userId);
    const splitPoint = hash % 100;

    let cumulative = 0;
    for (const [variant, percentage] of Object.entries(experiment.trafficSplit)) {
      cumulative += percentage;
      if (splitPoint < cumulative) return variant;
    }

    // Fallback to first variant if something goes wrong
    return experiment.variants[0] || "default";
  }

  recordMetric(
    userId: string,
    experimentId: string,
    variant: string,
    metric: string,
    value: number
  ): void {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    if (!experiment.metrics.includes(metric)) {
      throw new Error(`Metric ${metric} not defined for experiment ${experimentId}`);
    }

    const existingResult = this.results.find(
      (r) => r.experimentId === experimentId && r.userId === userId
    );

    if (existingResult) {
      existingResult.metrics[metric] = value;
    } else {
      this.results.push({
        experimentId,
        variant,
        userId,
        metrics: { [metric]: value },
        timestamp: new Date(),
      });
    }
  }

  getExperimentResults(experimentId: string): Record<string, unknown> {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    const experimentResults = this.results.filter((r) => r.experimentId === experimentId);
    const variantResults: Record<string, unknown> = {};

    for (const variant of experiment.variants) {
      const variantData = experimentResults.filter((r) => r.variant === variant);

      const metricAverages: Record<string, number> = {};
      for (const metric of experiment.metrics) {
        const values = variantData
          .filter((r) => r.metrics[metric] !== undefined)
          .map((r) => r.metrics[metric]);

        metricAverages[metric] =
          values.length > 0
            ? values.reduce((sum: number, val) => sum + (val || 0), 0) / values.length
            : 0;
      }

      variantResults[variant] = {
        sampleSize: variantData.length,
        metrics: metricAverages,
      };
    }

    return {
      experimentId,
      status: experiment.status,
      variants: variantResults,
      totalSamples: experimentResults.length,
    };
  }

  private hashUserId(userId: string): number {
    // Simple string hash function for consistent distribution
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  pauseExperiment(experimentId: string): void {
    const experiment = this.experiments.get(experimentId);
    if (experiment) {
      experiment.status = "PAUSED";
    }
  }

  resumeExperiment(experimentId: string): void {
    const experiment = this.experiments.get(experimentId);
    if (experiment) {
      experiment.status = "RUNNING";
    }
  }

  completeExperiment(experimentId: string): void {
    const experiment = this.experiments.get(experimentId);
    if (experiment) {
      experiment.status = "COMPLETED";
    }
  }
}

export default ABTestingFramework;
