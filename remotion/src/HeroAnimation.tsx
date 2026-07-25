import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { themes, MONO, SANS, type ThemeName, type Theme } from "./theme";

// Hero: "the intelligence layer of the Build stage." What an expert sketches to explain the ai
// skill — a request arrives (the whole model-powered register), the retrieval-first / anti-staleness
// gate re-verifies the model/price/version against the live source before quoting a memorized number,
// the faceted router composes the smallest sufficient reference set from one primary job × at most one
// base surface + the ADDITIVE multi-agent overlay, the EVALUATION flagship shows evals as the
// completion gate (error-analysis-first dataset, aligned judge, pass^k — run, not asserted), a full
// pass produces a running behavior + eval suite and verifies-and-subtracts, and a handoff.yaml carrying
// volatile_facts hands the BEHAVIOR off downstream. ~57s, loops (opens/closes empty).
//
// Pacing model (reader-first): every scene animates its content IN, then HOLDS fully still for a
// reading beat (~2.3–3.6s) before the container fades OUT. The fade-out begins at dur − hold, so each
// scene's dur = content-in-end + reading-hold + fade. Never let the next scene start before this one
// has been readable at rest.
//
// Scene map (30fps):
//   S1 request    0–210       the ask arrives — the whole ai register
//   S2 verify     210–500     retrieval-first / anti-staleness — re-verify against the live source
//   S3 route      500–840     THE centerpiece: one job × one base surface + additive multi-agent
//   S4 evaluate   840–1190    the flagship: evals as the completion gate — aligned judge, pass^k
//   S5 produce    1190–1480   what a pass produces + verify-and-subtract
//   S6 handoff    1480–1720   hand the BEHAVIOR + volatile_facts off to quality · operate · …

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

function envelope(frame: number, dur: number, hold = 26) {
  const opIn = interpolate(frame, [0, hold], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const opOut = interpolate(frame, [dur - hold, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const y = interpolate(frame, [0, hold], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return { opacity: Math.min(opIn, opOut), y };
}

const step = (frame: number, a: number, b: number, ease = false) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease ? EASE : undefined });

const SceneTitle: React.FC<{ t: Theme; kicker: string; title: string; accent?: string }> = ({ t, kicker, title, accent }) => (
  <div style={{ textAlign: "center", marginBottom: 30 }}>
    <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, fontSize: 17, color: accent ?? t.accent, marginBottom: 12 }}>
      {kicker}
    </div>
    <div style={{ fontFamily: MONO, fontSize: 40, color: t.ink, letterSpacing: "-0.02em" }}>{title}</div>
  </div>
);

// ── S1 · the request arrives — the whole ai register ───────────────────────────
const AskLine: React.FC<{ t: Theme; text: string; frame: number; from: number }> = ({ t, text, frame, from }) => {
  const chars = Math.floor(interpolate(frame, [from, from + 46], [0, text.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const typed = text.slice(0, chars);
  const caretOn = Math.floor(frame / 8) % 2 === 0 && chars < text.length && frame > from;
  const op = step(frame, from - 4, from + 6);
  return (
    <div style={{ opacity: op }}>
      <span style={{ color: t.accent, fontWeight: 700 }}>/ai</span> <span>{typed}</span>
      <span style={{ opacity: caretOn ? 1 : 0, color: t.accent }}>▋</span>
    </div>
  );
};

const SceneRequest: React.FC<{ t: Theme; dur: number }> = ({ t, dur }) => {
  const frame = useCurrentFrame();
  const { opacity, y } = envelope(frame, dur, 22);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ translate: `0 ${y}px`, width: 1040 }}>
        <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, fontSize: 16, color: t.muted, marginBottom: 20, textAlign: "center" }}>
          build the model-powered behavior — the cognition, not the substrate
        </div>
        <div style={{ background: t.codeBg, border: `1px solid ${t.line}`, borderRadius: 12, padding: "26px 32px", fontFamily: MONO, fontSize: 20, lineHeight: 2, color: t.ink }}>
          <AskLine t={t} text="build a grounded support agent — route a cheap model, add RAG with citations," frame={frame} from={8} />
          <AskLine t={t} text="then prove it with an eval set" frame={frame} from={64} />
        </div>
        <div style={{ marginTop: 18, textAlign: "center", fontFamily: SANS, fontSize: 15.5, color: t.muted, opacity: step(frame, 104, 126) }}>
          routing · context · structured · tools/MCP · agent · RAG · memory · evals · guardrails · cost
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S2 · retrieval-first / anti-staleness — re-verify against the live source ──
const GateCol: React.FC<{ t: Theme; label: string; rows: string[]; appear: number; ok?: boolean }> = ({ t, label, rows, appear, ok }) => (
  <div style={{ opacity: appear, width: 424, background: t.panel, border: `1px solid ${ok ? t.accent : t.line}`, borderRadius: 12, padding: "16px 20px" }}>
    <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, fontSize: 12.5, color: ok ? t.accent : t.muted, marginBottom: 12 }}>{label}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {rows.map((r) => (
        <div key={r} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: 14.5, color: ok ? t.ink : t.muted, textDecoration: ok ? "none" : "line-through", textDecorationColor: t.bad }}>
          <span style={{ color: ok ? t.accent : t.bad, flex: "none", fontSize: 15 }}>{ok ? "✓" : "✗"}</span>
          {r}
        </div>
      ))}
    </div>
  </div>
);

const SceneVerify: React.FC<{ t: Theme; dur: number }> = ({ t, dur }) => {
  const frame = useCurrentFrame();
  const { opacity, y } = envelope(frame, dur);
  const colL = step(frame, 16, 42, true);
  const colR = step(frame, 30, 56, true);
  const warn = step(frame, 96, 122, true);
  const cap = step(frame, 132, 156);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ translate: `0 ${y}px`, display: "flex", flexDirection: "column", alignItems: "center", width: 1040 }}>
        <SceneTitle t={t} kicker="gate · retrieval-first, before any model name" title="re-verify against the live source" />
        <div style={{ display: "flex", gap: 24 }}>
          <GateCol t={t} label="from memory" appear={colL} rows={['"newest model" from memory', "a $/Mtok price recalled", '"open-weights = open-source"']} />
          <GateCol t={t} label="live source · re-verified · date-stamped" appear={colR} ok rows={["pricing page · today's rate", "npm view / PyPI / HF card", "read the actual license"]} />
        </div>
        <div style={{ opacity: warn, marginTop: 22, display: "flex", alignItems: "center", gap: 12, background: t.amberBg, border: `1px solid ${t.amber}`, borderRadius: 10, padding: "12px 20px", maxWidth: 872 }}>
          <span style={{ color: t.amber, fontSize: 20, flex: "none" }}>⚠</span>
          <div style={{ fontFamily: MONO, fontSize: 15, color: t.ink, lineHeight: 1.5 }}>
            <span style={{ color: t.amber, fontWeight: 700 }}>the model / price / version layer churns monthly:</span> our own research caught a <span style={{ color: t.amber }}>stale model cache</span> — never quote a memorized number
          </div>
        </div>
        <div style={{ marginTop: 20, fontFamily: MONO, fontSize: 16.5, color: t.muted, opacity: cap, textAlign: "center" }}>
          re-verify the fact · <span style={{ color: t.accent }}>date-stamp it</span> · carry volatile_facts into the handoff
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S3 · the faceted router (centerpiece) ─────────────────────────────────────
const Lane: React.FC<{ t: Theme; label: string; chips: string[]; onIndex: number; appear: number; lit: number; litColor: string; star?: boolean }> = ({ t, label, chips, onIndex, appear, lit, litColor, star }) => (
  <div style={{ opacity: appear, display: "grid", gridTemplateColumns: "210px 1fr", gap: 16, alignItems: "center" }}>
    <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, fontSize: 13, color: t.muted, textAlign: "right" }}>{label}</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {chips.map((c, i) => {
        const on = i === onIndex;
        return (
          <div key={c} style={{ fontFamily: MONO, fontSize: 14, padding: "6px 12px", borderRadius: 8, whiteSpace: "nowrap", color: on ? t.accentInk : t.muted, background: on ? `color-mix(in srgb, ${litColor} ${30 + lit * 70}%, ${t.panel})` : t.bg, border: `1px solid ${on ? litColor : t.line}`, scale: String(on ? interpolate(lit, [0, 1], [1, 1.06]) : 1) }}>
            {c}{on && star ? <span style={{ color: t.amber, marginLeft: 5 }}>⭐</span> : null}
          </div>
        );
      })}
    </div>
  </div>
);

const SceneRoute: React.FC<{ t: Theme; dur: number }> = ({ t, dur }) => {
  const frame = useCurrentFrame();
  const { opacity, y } = envelope(frame, dur);
  const lane1 = step(frame, 14, 40, true);
  const lane2 = step(frame, 26, 52, true);
  const lane3 = step(frame, 38, 64, true);
  const lit1 = step(frame, 54, 76, true);
  const lit2 = step(frame, 68, 90, true);
  const lit3 = step(frame, 82, 104, true);
  const arrow = step(frame, 116, 134, true);
  const readSet: [string, boolean][] = [["evaluation.md", false], ["surface-rag-app.md", false], ["surface-multi-agent.md", true]];
  const counter = step(frame, 176, 200);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ translate: `0 ${y}px`, display: "flex", flexDirection: "column", alignItems: "center", width: 1120 }}>
        <SceneTitle t={t} kicker="route · smallest sufficient set" title="the faceted router" />
        <div style={{ display: "flex", flexDirection: "column", gap: 15, width: "100%", maxWidth: 1000 }}>
          <Lane t={t} label="one primary job" chips={["routing", "context", "structured", "tools/MCP", "agent", "RAG", "memory", "evaluation", "guardrails", "cost"]} onIndex={7} appear={lane1} lit={lit1} litColor={t.accent} star />
          <Lane t={t} label="≤ one base surface" chips={["chat-assistant", "autonomous-agent", "rag-app", "batch-pipeline"]} onIndex={2} appear={lane2} lit={lit2} litColor={t.accent} />
          <Lane t={t} label="+ multi-agent (additive)" chips={["surface-multi-agent"]} onIndex={0} appear={lane3} lit={lit3} litColor={t.multi} />
        </div>
        <div style={{ fontFamily: MONO, fontSize: 26, color: t.accent, margin: "15px 0 12px", opacity: arrow }}>↓</div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 9, maxWidth: 980 }}>
          {readSet.map(([r, isMulti], i) => {
            const ap = step(frame, 136 + i * 8, 154 + i * 8, true);
            const col = isMulti ? t.multi : t.accent;
            return (
              <div key={r} style={{ opacity: ap, translate: `0 ${interpolate(ap, [0, 1], [8, 0])}px`, fontFamily: MONO, fontSize: 15, padding: "7px 13px", borderRadius: 8, color: col, background: t.codeBg, border: `1px solid ${col}` }}>
                {r}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 18, fontFamily: MONO, fontSize: 16.5, color: t.muted, opacity: counter }}>
          <span style={{ color: t.ink, fontWeight: 600 }}>one job · one base · + multi-agent</span> — read fully, <span style={{ color: t.accent }}>never all 16</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S4 · the evaluation flagship (the completion gate) ─────────────────────────
const Rung: React.FC<{ t: Theme; name: string; note: string; col: string; appear: number }> = ({ t, name, note, col, appear }) => (
  <div style={{ opacity: appear, translate: `0 ${interpolate(appear, [0, 1], [8, 0])}px`, display: "flex", alignItems: "baseline", gap: 12, background: t.panel, border: `1px solid ${t.line}`, borderLeft: `3px solid ${col}`, borderRadius: 8, padding: "9px 15px" }}>
    <div style={{ fontFamily: MONO, fontSize: 13.5, color: t.ink, fontWeight: 600, width: 150, flex: "none" }}>{name}</div>
    <div style={{ fontFamily: SANS, fontSize: 12.5, color: t.muted, lineHeight: 1.35 }}>{note}</div>
  </div>
);

const SceneEvaluate: React.FC<{ t: Theme; dur: number }> = ({ t, dur }) => {
  const frame = useCurrentFrame();
  const { opacity, y } = envelope(frame, dur);
  const cfg: [string, string, string?][] = [
    ["dataset:", " error-analysis-first", " # failures → taxonomy"],
    ["judge:", " binary + aligned", " # precision/recall vs labels"],
    ["method:", " Critique-Shadowing", " # + jury, high-stakes"],
    ["suites:", " offline·online·regression·safety"],
    ["reliability:", " pass^k", " # not one lucky pass"],
    ["subtract:", " decompose the judge", " # one axis per call"],
  ];
  const l1 = step(frame, 150, 172, true);
  const l2 = step(frame, 162, 184, true);
  const l3 = step(frame, 174, 196, true);
  const cap = step(frame, 214, 238);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ translate: `0 ${y}px`, display: "flex", flexDirection: "column", alignItems: "center", width: 1120 }}>
        <SceneTitle t={t} kicker="the flagship · evaluation · the completion gate" title="prove it — don't assert it" accent={t.accent} />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 30 }}>
          <div style={{ width: 592 }}>
            <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, fontSize: 13, color: t.accent, marginBottom: 10 }}>the eval is an artifact, built like one</div>
            <div style={{ background: t.codeBg, border: `1px solid ${t.line}`, borderRadius: 12, padding: "18px 22px", fontFamily: MONO, fontSize: 14.5, lineHeight: 1.95 }}>
              {cfg.map(([k, v, c], i) => {
                const op = step(frame, 14 + i * 15, 34 + i * 15);
                return (
                  <div key={k} style={{ opacity: op, whiteSpace: "nowrap" }}>
                    <span style={{ color: t.accent }}>{k}</span><span style={{ color: t.ink }}>{v}</span>
                    {c && <span style={{ color: t.muted }}>{c}</span>}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ width: 452, display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, fontSize: 12.5, color: t.muted, opacity: l1 }}>what to trust — and what not to</div>
            <Rung t={t} name="aligned judge" note="binary, validated on precision/recall vs human labels" col={t.good} appear={l1} />
            <Rung t={t} name="raw LLM-as-judge" note="un-calibrated, drifts, over-scores — align it first" col={t.amber} appear={l2} />
            <Rung t={t} name="a benchmark score" note='engagement, not proof — >50% of SWE-bench "passes" unmergeable' col={t.bad} appear={l3} />
          </div>
        </div>
        <div style={{ marginTop: 24, fontFamily: MONO, fontSize: 16.5, color: t.muted, opacity: cap, textAlign: "center" }}>
          the completion gate is a <span style={{ color: t.accent }}>run</span>, not an assertion — pass^k, never "it works" from memory
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S5 · what a pass produces + verify-and-subtract ────────────────────────────
const Artifact: React.FC<{ t: Theme; file: string; label: string; appear: number }> = ({ t, file, label, appear }) => (
  <div style={{ opacity: appear, translate: `0 ${interpolate(appear, [0, 1], [12, 0])}px`, width: 300, background: t.panel, border: `1px solid ${t.line}`, borderTop: `3px solid ${t.accent}`, borderRadius: 10, padding: "14px 18px" }}>
    <div style={{ fontFamily: MONO, fontSize: 15, color: t.ink, fontWeight: 600 }}>{file}</div>
    <div style={{ fontFamily: SANS, fontSize: 13, color: t.muted, marginTop: 5, lineHeight: 1.4 }}>{label}</div>
  </div>
);

const SceneProduce: React.FC<{ t: Theme; dur: number }> = ({ t, dur }) => {
  const frame = useCurrentFrame();
  const { opacity, y } = envelope(frame, dur);
  const arts: [string, string][] = [
    ["running behavior", "agent loop / RAG pipeline / routing cascade — not a plan"],
    ["eval suite", "dataset + aligned judge + harness · pass^k reported"],
    ["guardrails + telemetry", "controls table (impl→verified) · OTel-GenAI fields"],
    ["decision worksheets", "model scorecard · context budget · handoff.yaml"],
  ];
  const loopLabel = step(frame, 96, 118);
  const steps = ["inspect", "route", "re-verify", "produce", "prove"];
  const cap = step(frame, 176, 200);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ translate: `0 ${y}px`, display: "flex", flexDirection: "column", alignItems: "center", width: 1060 }}>
        <SceneTitle t={t} kicker="produces · concrete pick + what-NOT" title="build it — then subtract" />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 13, maxWidth: 1000 }}>
          {arts.map(([f, l], i) => {
            const ap = step(frame, 16 + i * 18, 42 + i * 18, true);
            return <Artifact key={f} t={t} file={f} label={l} appear={ap} />;
          })}
        </div>
        <div style={{ opacity: loopLabel, marginTop: 26, display: "flex", alignItems: "center", gap: 0, border: `1px solid ${t.line}`, borderRadius: 10, overflow: "hidden", background: t.panel }}>
          {steps.map((s, i) => {
            const ap = step(frame, 104 + i * 12, 122 + i * 12, true);
            return (
              <React.Fragment key={s}>
                {i > 0 && <div style={{ opacity: ap, fontFamily: MONO, fontSize: 15, color: t.glyph, padding: "0 4px" }}>→</div>}
                <div style={{ opacity: ap, fontFamily: MONO, fontSize: 15, color: i === steps.length - 1 ? t.good : t.ink, fontWeight: 600, padding: "13px 18px" }}>{s}</div>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ marginTop: 22, fontFamily: MONO, fontSize: 16.5, color: t.muted, opacity: cap, textAlign: "center" }}>
          verify-and-<span style={{ color: t.accent }}>subtract</span> — prune the harness; better models need <span style={{ color: t.accent }}>less</span> scaffolding
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── S6 · hand off the BEHAVIOR (family arc closes) ─────────────────────────────
const NextSkill: React.FC<{ t: Theme; name: string; note: string; appear: number }> = ({ t, name, note, appear }) => (
  <div style={{ opacity: appear, translate: `0 ${interpolate(appear, [0, 1], [12, 0])}px`, width: 266, background: t.panel, border: `1px solid ${t.line}`, borderRadius: 11, padding: "14px 18px" }}>
    <div style={{ fontFamily: MONO, fontSize: 17, color: t.ink }}><span style={{ color: t.accent, fontWeight: 700 }}>/</span>{name}</div>
    <div style={{ fontFamily: SANS, fontSize: 12.5, color: t.muted, marginTop: 5, lineHeight: 1.4 }}>{note}</div>
  </div>
);

const SceneHandoff: React.FC<{ t: Theme; dur: number }> = ({ t, dur }) => {
  const frame = useCurrentFrame();
  const { opacity, y } = envelope(frame, dur, 20);
  const yamlLines: [string, string][] = [
    ["skill:", " ai"],
    ["objective:", " grounded support agent"],
    ["artifacts:", " behavior, evals, guardrails"],
    ["evaluation:", " suite run · pass^k ✓"],
    ["volatile_facts:", " model+price+ver +date"],
    ["next:", " quality · operate · backend"],
  ];
  const arrow = step(frame, 66, 88, true);
  const c1 = step(frame, 76, 100, true);
  const c2 = step(frame, 88, 112, true);
  const cap = step(frame, 116, 140);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ translate: `0 ${y}px`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SceneTitle t={t} kicker="family · architecture → ai → quality · operate" title="hand off the behavior, not the decision" accent={t.multi} />
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ width: 468 }}>
            <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 600, fontSize: 14, color: t.accent, marginBottom: 12 }}>handoff.yaml</div>
            <div style={{ background: t.codeBg, border: `1px solid ${t.line}`, borderRadius: 12, padding: "18px 22px", fontFamily: MONO, fontSize: 15.5, lineHeight: 1.85 }}>
              {yamlLines.map(([k, v], i) => {
                const op = step(frame, 12 + i * 9, 28 + i * 9);
                return (
                  <div key={k} style={{ opacity: op, whiteSpace: "nowrap" }}>
                    <span style={{ color: t.accent }}>{k}</span><span style={{ color: t.ink }}>{v}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 40, color: t.accent, opacity: arrow }}>→</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <NextSkill t={t} name="quality · operate" note="independent gate, deploy & monitor" appear={c1} />
            <NextSkill t={t} name="backend · frontend · data" note="serve tools/MCP, render, govern the store" appear={c2} />
          </div>
        </div>
        <div style={{ marginTop: 26, fontFamily: MONO, fontSize: 16.5, color: t.muted, opacity: cap, textAlign: "center" }}>
          own the <span style={{ color: t.accent }}>cognition</span> · carry volatile_facts · recommend siblings, never auto-invoke
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── persistent chrome + master timeline ──────────────────────────────────────
const BOUNDS = [210, 500, 840, 1190, 1480, 1720];
const LABELS = ["request", "verify", "route", "evaluate", "produce", "handoff"];

const PhaseBar: React.FC<{ t: Theme; frame: number }> = ({ t, frame }) => {
  const active = Math.max(0, BOUNDS.findIndex((b) => frame < b));
  return (
    <div style={{ position: "absolute", bottom: 34, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 15 }}>
      {LABELS.map((l, i) => (
        <div key={l} style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === active ? t.accent : t.line, scale: String(i === active ? 1.3 : 1) }} />
          <div style={{ fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.09em", fontSize: 12, fontWeight: 600, color: i === active ? t.ink : t.muted, opacity: i === active ? 1 : 0.55 }}>{l}</div>
        </div>
      ))}
    </div>
  );
};

export const HeroAnimation: React.FC<{ theme: ThemeName }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = themes[theme];

  const intro = step(frame, 0, 14);
  const outro = interpolate(frame, [durationInFrames - 16, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const master = Math.min(intro, outro);
  const glow = interpolate(Math.sin(frame / 90), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: t.bg, fontFamily: SANS }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 82% 16%, color-mix(in srgb, ${t.accent} 13%, transparent), transparent 44%), radial-gradient(circle at 8% 92%, color-mix(in srgb, ${t.multi} 10%, transparent), transparent 48%)`, opacity: glow }} />
      <AbsoluteFill style={{ opacity: master }}>
        <Sequence durationInFrames={210}><SceneRequest t={t} dur={210} /></Sequence>
        <Sequence from={210} durationInFrames={290}><SceneVerify t={t} dur={290} /></Sequence>
        <Sequence from={500} durationInFrames={340}><SceneRoute t={t} dur={340} /></Sequence>
        <Sequence from={840} durationInFrames={350}><SceneEvaluate t={t} dur={350} /></Sequence>
        <Sequence from={1190} durationInFrames={290}><SceneProduce t={t} dur={290} /></Sequence>
        <Sequence from={1480} durationInFrames={240}><SceneHandoff t={t} dur={240} /></Sequence>
        <PhaseBar t={t} frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
