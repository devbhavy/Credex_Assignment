import { describe, expect, it } from "vitest";
import { runAudit } from "./auditEngine.js";

describe("runAudit", () => {
  it("flags tools with no pricing as unknown_tool", () => {
    const result = runAudit({
      tools: [
        {
          tool: "not_in_catalog",
          plan: "pro",
          seats: 2,
          monthlySpend: 50,
          usageFrequency: "never",
        },
      ],
      teamSize: 2,
      useCase: "coding",
      needsAdminControls: false,
    });

    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0]!.checkType).toBe("unknown_tool");
    expect(result.redundancies).toHaveLength(0);
    expect(result.isAlreadyOptimal).toBe(true);
  });

  it("detects overlapping AI coding assistants and estimates overlap savings", () => {
    const result = runAudit({
      tools: [
        {
          tool: "cursor",
          plan: "pro",
          seats: 3,
          monthlySpend: 60,
          usageFrequency: "sometimes",
        },
        {
          tool: "github_copilot",
          plan: "pro",
          seats: 3,
          monthlySpend: 30,
          usageFrequency: "sometimes",
        },
      ],
      teamSize: 3,
      useCase: "coding",
      needsAdminControls: false,
    });

    expect(result.redundancies.length).toBeGreaterThanOrEqual(1);
    const codingOverlap = result.redundancies.find(
      (r) => r.category === "AI Coding Assistant",
    );
    expect(codingOverlap).toBeDefined();
    expect(codingOverlap!.tools).toEqual(
      expect.arrayContaining(["cursor", "github_copilot"]),
    );
    expect(codingOverlap!.potentialSaving).toBeGreaterThan(0);
  });

  it("suggests api_to_flat when Anthropic API spend exceeds flat Claude seats", () => {
    const result = runAudit({
      tools: [
        {
          tool: "anthropic_api",
          plan: "pay_as_you_go",
          seats: 2,
          monthlySpend: 400,
          usageFrequency: "frequently",
        },
      ],
      teamSize: 2,
      useCase: "coding",
      needsAdminControls: false,
    });

    const rec = result.recommendations[0]!;
    expect(rec.checkType).toBe("api_to_flat");
    expect(rec.recommendedTool).toBe("claude");
    expect(rec.monthlySaving).toBeGreaterThan(0);
  });

  it("recommends a better-fit tool when use case does not match a coding-only stack", () => {
    const result = runAudit({
      tools: [
        {
          tool: "cursor",
          plan: "pro",
          seats: 2,
          monthlySpend: 40,
          usageFrequency: "sometimes",
        },
      ],
      teamSize: 2,
      useCase: "writing",
      needsAdminControls: false,
    });

    const rec = result.recommendations[0]!;
    expect(rec.checkType).toBe("use_case_mismatch");
    expect(rec.recommendedTool).toBe("claude");
    expect(rec.reason.toLowerCase()).toContain("writing");
  });

  it("surfaces admin_controls_upgrade when admin controls are required on an individual plan", () => {
    const result = runAudit({
      tools: [
        {
          tool: "cursor",
          plan: "pro",
          seats: 4,
          monthlySpend: 80,
          usageFrequency: "sometimes",
        },
      ],
      teamSize: 4,
      useCase: "coding",
      needsAdminControls: true,
    });

    const rec = result.recommendations[0]!;
    expect(rec.checkType).toBe("admin_controls_upgrade");
    expect(rec.recommendedPlan).toBe("teams");
    expect(rec.monthlySaving).toBe(0);
  });

  it("treats enterprise plans as optimal without attempting automated downsizing", () => {
    const result = runAudit({
      tools: [
        {
          tool: "cursor",
          plan: "enterprise",
          seats: 10,
          monthlySpend: 5000,
          usageFrequency: "frequently",
        },
      ],
      teamSize: 10,
      useCase: "coding",
      needsAdminControls: false,
    });

    expect(result.recommendations[0]!.checkType).toBe("enterprise");
    expect(result.recommendations[0]!.isOptimal).toBe(true);
  });

  it("aggregates monthly savings into annual savings and marks fully optimal audits", () => {
    const result = runAudit({
      tools: [
        {
          tool: "chatgpt",
          plan: "plus",
          seats: 1,
          monthlySpend: 20,
          usageFrequency: "frequently",
        },
      ],
      teamSize: 1,
      useCase: "writing",
      needsAdminControls: false,
    });

    expect(result.totalMonthlySaving).toBe(
      result.recommendations.reduce((s, r) => s + r.monthlySaving, 0),
    );
    expect(result.totalAnnualSaving).toBe(result.totalMonthlySaving * 12);
    expect(result.isAlreadyOptimal).toBe(true);
    expect(result.recommendations[0]!.checkType).toBe("optimal");
  });
});
