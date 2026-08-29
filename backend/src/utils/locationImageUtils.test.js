import test from "node:test";
import assert from "node:assert/strict";

import { normalizeLocationImages } from "./locationImageUtils.js";

test("normalizeLocationImages keeps the first image as main image and includes all uploaded images", () => {
  const result = normalizeLocationImages([
    { path: "https://cdn.example.com/a.jpg" },
    { path: "https://cdn.example.com/b.jpg" },
  ]);

  assert.equal(result.image, "https://cdn.example.com/a.jpg");
  assert.deepEqual(result.images, [
    "https://cdn.example.com/a.jpg",
    "https://cdn.example.com/b.jpg",
  ]);
});

test("normalizeLocationImages falls back to a single image when only one file is uploaded", () => {
  const result = normalizeLocationImages([{ path: "https://cdn.example.com/only.jpg" }]);

  assert.equal(result.image, "https://cdn.example.com/only.jpg");
  assert.deepEqual(result.images, ["https://cdn.example.com/only.jpg"]);
});
