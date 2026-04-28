import { describe, expect, it } from "vitest";
import { buildSearchVerificationMetadata } from "./search-verification";

describe("buildSearchVerificationMetadata", () => {
  it("returns undefined when verification tokens are empty", () => {
    expect(buildSearchVerificationMetadata({ google: "", bing: "   " })).toBeUndefined();
  });

  it("trims and emits Google and Bing verification metadata", () => {
    expect(
      buildSearchVerificationMetadata({
        google: " google-token ",
        bing: " bing-token ",
      }),
    ).toEqual({
      google: "google-token",
      other: {
        "msvalidate.01": "bing-token",
      },
    });
  });
});
