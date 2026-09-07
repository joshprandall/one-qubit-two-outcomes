import test from "node:test";
import assert from "node:assert/strict";
import { stateFromAngle, describeState, sampleMeasurements, degreesToRadians } from "../qubit.js";

const EPS = 1e-12;

test("degree conversion handles boundaries", () => {
  assert.equal(degreesToRadians(0), 0);
  assert.ok(Math.abs(degreesToRadians(180) - Math.PI) < EPS);
});

test("theta 0 is |0>", () => {
  const s = stateFromAngle(0);
  assert.ok(Math.abs(s.alpha - 1) < EPS);
  assert.ok(Math.abs(s.beta) < EPS);
  assert.ok(Math.abs(s.p0 - 1) < EPS);
  assert.ok(Math.abs(s.p1) < EPS);
});

test("theta 180 is |1>", () => {
  const s = stateFromAngle(180);
  assert.ok(Math.abs(s.alpha) < EPS);
  assert.ok(Math.abs(s.beta - 1) < EPS);
  assert.ok(Math.abs(s.p0) < EPS);
  assert.ok(Math.abs(s.p1 - 1) < EPS);
});

test("theta 90 is an equal superposition", () => {
  const s = stateFromAngle(90);
  assert.ok(Math.abs(s.p0 - 0.5) < EPS);
  assert.ok(Math.abs(s.p1 - 0.5) < EPS);
});

test("state remains normalized across the full slider range", () => {
  for (let angle = 0; angle <= 180; angle += 1) {
    const s = stateFromAngle(angle);
    assert.ok(Math.abs(s.normalization - 1) < EPS, `normalization failed at ${angle}°`);
  }
});

test("probabilities are complementary", () => {
  for (const angle of [1, 17, 45, 73, 90, 117, 153, 179]) {
    const s = stateFromAngle(angle);
    assert.ok(Math.abs((s.p0 + s.p1) - 1) < EPS);
  }
});

test("description follows the dominant outcome", () => {
  assert.match(describeState(0), /\|0⟩/);
  assert.match(describeState(30), /0⟩ is more likely/);
  assert.match(describeState(90), /Equal probabilities/);
  assert.match(describeState(150), /1⟩ is more likely/);
  assert.match(describeState(180), /\|1⟩/);
});

test("sampling can be deterministic with an injected random source", () => {
  const values = [0.1, 0.4, 0.5, 0.9];
  let i = 0;
  const result = sampleMeasurements(0.5, 4, () => values[i++]);
  assert.deepEqual(result, { count0: 2, count1: 2, shots: 4 });
});

test("sampling respects certainty states", () => {
  assert.deepEqual(sampleMeasurements(1, 5, () => 0.999), { count0: 5, count1: 0, shots: 5 });
  assert.deepEqual(sampleMeasurements(0, 5, () => 0), { count0: 0, count1: 5, shots: 5 });
});

test("invalid theta values are rejected", () => {
  for (const value of [-1, 181, NaN, Infinity]) {
    assert.throws(() => stateFromAngle(value), RangeError);
  }
});

test("invalid sampling arguments are rejected", () => {
  assert.throws(() => sampleMeasurements(-0.1, 10), RangeError);
  assert.throws(() => sampleMeasurements(1.1, 10), RangeError);
  assert.throws(() => sampleMeasurements(0.5, 0), RangeError);
  assert.throws(() => sampleMeasurements(0.5, 1.5), RangeError);
  assert.throws(() => sampleMeasurements(0.5, 1, "bad"), TypeError);
});

test("invalid random-source output is rejected", () => {
  assert.throws(() => sampleMeasurements(0.5, 1, () => 1), RangeError);
  assert.throws(() => sampleMeasurements(0.5, 1, () => -0.1), RangeError);
});
