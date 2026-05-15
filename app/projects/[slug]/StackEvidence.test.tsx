import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithIntl, messages } from "@/test/helpers/render-with-intl";
import { StackEvidence } from "./StackEvidence";

describe("StackEvidence", () => {
  it("shows primary stack links and discloses secondary links on request", async () => {
    const user = userEvent.setup();

    renderWithIntl(
      <StackEvidence
        primaryGroups={[
          {
            category: "Mobile",
            entries: [{ name: "React Native" }],
          },
        ]}
        secondaryGroups={[
          {
            category: "Tools",
            entries: [{ name: "Bull" }],
          },
        ]}
        showMoreLabel={messages.common.showMore}
        showLessLabel={messages.common.showLess}
      />,
    );

    expect(screen.getByRole("link", { name: "React Native" })).toHaveAttribute(
      "href",
      "/projects?stackFilters=React%20Native",
    );
    expect(screen.queryByRole("link", { name: "Bull" })).not.toBeInTheDocument();

    const toggle = screen.getByRole("button", {
      name: messages.common.showMore,
    });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveTextContent(messages.common.showLess);
    expect(screen.getByRole("link", { name: "Bull" })).toHaveAttribute(
      "href",
      "/projects?stackFilters=Bull",
    );

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Bull" })).not.toBeInTheDocument();
  });
});
