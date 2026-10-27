import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_ADAPTATIONS,
  QUESTIONS,
  describeAdaptations,
  loadProfile,
  loadStep,
  saveProfile,
  saveStep,
  toAdaptations,
  toggleOption,
} from "@/lib/profile";

describe("toggleOption", () => {
  it("adds and removes a value", () => {
    expect(toggleOption(["noise"], "crowds")).toEqual(["noise", "crowds"]);
    expect(toggleOption(["noise", "crowds"], "noise")).toEqual(["crowds"]);
  });

  it("makes 'none' and 'not-sure' exclusive", () => {
    expect(toggleOption(["noise", "crowds"], "none")).toEqual(["none"]);
    expect(toggleOption(["none"], "noise")).toEqual(["noise"]);
    expect(toggleOption(["remote"], "not-sure")).toEqual(["not-sure"]);
  });
});

describe("toAdaptations", () => {
  it("returns the defaults for an empty profile", () => {
    expect(toAdaptations({})).toEqual(DEFAULT_ADAPTATIONS);
    expect(DEFAULT_ADAPTATIONS.stepsAtOnce).toBe(3);
  });

  it.each([
    [{ reading: "summary" }, true],
    [{ longText: "tiring" }, true],
    [{ longText: "hard" }, true],
    [{ reading: "full", longText: "fine" }, false],
  ] as const)("summaryMode for %o is %s", (answers, expected) => {
    expect(toAdaptations(answers).summaryMode).toBe(expected);
  });

  it("offers a Listen button when the person prefers listening", () => {
    expect(toAdaptations({ reading: "listen" }).listenButton).toBe(true);
    expect(toAdaptations({ reading: "steps" }).listenButton).toBe(false);
  });

  it("suggests reading aids only when long texts are really hard", () => {
    expect(toAdaptations({ longText: "hard" }).suggestReadingAids).toBe(true);
    expect(toAdaptations({ longText: "tiring" }).suggestReadingAids).toBe(false);
  });

  it.each([
    ["ask", false],
    ["guess", true],
    ["stuck", true],
  ] as const)("explicitSteps when unclear instructions mean %s", (unclear, expected) => {
    expect(toAdaptations({ unclear }).explicitSteps).toBe(expected);
  });

  it.each([
    ["fine", false],
    ["heads-up", true],
    ["stressful", true],
  ] as const)("headsUpOnChanges when changes feel %s", (changes, expected) => {
    expect(toAdaptations({ changes }).headsUpOnChanges).toBe(expected);
  });

  it("keeps sensory needs and drops 'nothing in particular'", () => {
    expect(toAdaptations({ sensory: ["noise", "textures"] }).sensoryNeeds).toEqual(["noise", "textures"]);
    expect(toAdaptations({ sensory: ["none"] }).sensoryNeeds).toEqual([]);
  });

  it("shows one step at a time when there are too many options", () => {
    expect(toAdaptations({ startBlockers: ["too-many-options"] }).stepsAtOnce).toBe(1);
    expect(toAdaptations({ startBlockers: ["big-tasks"] }).stepsAtOnce).toBe(3);
  });

  it("maps each start blocker to its My plan helper", () => {
    const a = toAdaptations({ startBlockers: ["big-tasks", "time", "distracted"] });
    expect(a.offerBreakdownFirst).toBe(true);
    expect(a.showDurations).toBe(true);
    expect(a.importantFirst).toBe(true);
  });

  it("turns workplace answers into job filters, ignoring 'not sure yet'", () => {
    expect(toAdaptations({ workplace: ["remote", "hybrid"] }).workplaceFilters).toEqual(["remote", "hybrid"]);
    expect(toAdaptations({ workplace: ["not-sure"] }).workplaceFilters).toEqual([]);
  });

  it.each([
    ["independent", false],
    ["check-ins", true],
    ["regular", true],
  ] as const)("gentlePacing when support is %s", (support, expected) => {
    expect(toAdaptations({ support }).gentlePacing).toBe(expected);
  });
});

describe("describeAdaptations", () => {
  it("gives one reassuring line for the defaults", () => {
    expect(describeAdaptations(DEFAULT_ADAPTATIONS)).toHaveLength(1);
  });

  it("never returns more than 4 lines", () => {
    const everything = toAdaptations({
      reading: "listen",
      longText: "hard",
      unclear: "stuck",
      changes: "stressful",
      sensory: ["noise"],
      startBlockers: ["too-many-options", "big-tasks", "time", "distracted"],
      workplace: ["remote"],
      support: "regular",
    });
    const lines = describeAdaptations(everything);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.length).toBeLessThanOrEqual(4);
  });
});

describe("QUESTIONS", () => {
  it("has the 8 questions from the spec, each with options", () => {
    expect(QUESTIONS).toHaveLength(8);
    for (const q of QUESTIONS) expect(q.options.length).toBeGreaterThan(1);
  });
});

describe("loadProfile / saveProfile", () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
    });
  });

  it("round-trips a profile", () => {
    saveProfile({ reading: "summary", sensory: ["noise"] });
    expect(loadProfile()).toEqual({ reading: "summary", sensory: ["noise"] });
  });

  it("returns null when nothing is saved", () => {
    expect(loadProfile()).toBeNull();
  });

  it.each([
    ["broken JSON", "{not json"],
    ["an unknown version", JSON.stringify({ version: 99, answers: { reading: "summary" } })],
    ["answers that are not an object", JSON.stringify({ version: 1, answers: "nope" })],
  ])("returns null for %s", (_, raw) => {
    store.profile = raw;
    expect(loadProfile()).toBeNull();
  });

  it("drops values that are not valid options", () => {
    store.profile = JSON.stringify({
      version: 1,
      answers: { reading: "shout", sensory: ["noise", "lasers"], workplace: "remote" },
    });
    expect(loadProfile()).toEqual({ sensory: ["noise"] });
  });

  it("round-trips the current step and rejects bad values", () => {
    expect(loadStep()).toBe(-1);
    saveStep(3);
    expect(loadStep()).toBe(3);
    store["profile-step"] = "42";
    expect(loadStep()).toBe(-1);
    store["profile-step"] = "abc";
    expect(loadStep()).toBe(-1);
  });

  it("does not throw when storage is unavailable", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    });
    expect(loadProfile()).toBeNull();
    expect(() => saveProfile({ reading: "full" })).not.toThrow();
  });
});
