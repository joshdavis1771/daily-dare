import { describe, expect, it } from "vitest";
import { MAX_VIDEO_SIZE, MAX_PHOTO_SIZE, validateMediaFile, parseCaption, validateVideoFile } from "./utils";
import { getDailyChallengeForUser } from "./demo-data";

describe("parseCaption", () => {
  it("identifies hashtags and mentions while preserving text", () => {
    expect(parseCaption("hello #fitness @alex")).toEqual([
      { text: "hello ", kind: "text", key: "hello -0" },
      { text: "#fitness", kind: "hashtag", key: "#fitness-1" },
      { text: " ", kind: "text", key: " -2" },
      { text: "@alex", kind: "mention", key: "@alex-3" },
    ]);
  });
});

describe("validateVideoFile", () => {
  it("accepts supported short-video formats under the size limit", () => {
    expect(validateVideoFile(new File([new Uint8Array(4)], "clip.mp4", { type: "video/mp4" }))).toBeNull();
  });

  it("rejects unsupported formats and oversized files", () => {
    expect(validateVideoFile(new File([new Uint8Array(4)], "clip.txt", { type: "text/plain" }))).toContain("MP4");
    expect(validateVideoFile(new File([new Uint8Array(MAX_VIDEO_SIZE + 1)], "clip.mp4", { type: "video/mp4" }))).toContain("80 MB");
  });
});

describe("daily challenge assignment", () => {
  it("keeps a user's assignment stable and gives demo users different challenges", () => {
    const assignments = ["p1", "p2", "p3", "p4"].map((userId) => getDailyChallengeForUser(userId).id);
    expect(new Set(assignments).size).toBe(assignments.length);
    expect(getDailyChallengeForUser("p1").id).toBe(getDailyChallengeForUser("p1").id);
  });
});

describe("photo and video proof validation", () => {
  it.each(["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm", "video/quicktime"])("accepts %s", (type) => {
    expect(validateMediaFile(new File(["proof"], "proof", { type }))).toBeNull();
  });
  it("rejects empty, unsupported, and oversized photos", () => {
    expect(validateMediaFile(new File([], "empty.jpg", { type: "image/jpeg" }))).toContain("empty");
    expect(validateMediaFile(new File(["svg"], "image.svg", { type: "image/svg+xml" }))).toContain("JPG");
    expect(validateMediaFile(new File([new Uint8Array(MAX_PHOTO_SIZE + 1)], "large.jpg", { type: "image/jpeg" }))).toContain("20 MB");
    expect(validateMediaFile(new File([new Uint8Array(MAX_VIDEO_SIZE + 1)], "large.mp4", { type: "video/mp4" }))).toContain("80 MB");
  });
});
