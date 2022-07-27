import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Share from "../Share";

describe("Share", () => {
  const shareData: ShareData = {
    title: "Test Share Title",
    text: "",
    url: "http"
  };
  const onInteractionSpy = jest.fn();
  const mockComponent = <div>Test Share</div>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Should render share without share popup", () => {
    render(<Share shareData={shareData}>{mockComponent}</Share>);
    expect(screen.getByText("Test Share")).toBeInTheDocument();
    expect(screen.queryByText("Test Share Title")).toBeNull();
  });

  it("Should render share with share popup", async () => {
    render(
      <Share shareData={shareData} onInteraction={onInteractionSpy}>
        {mockComponent}
      </Share>
    );
    const shareButton = screen.getByText("Test Share");
    expect(onInteractionSpy).toHaveBeenCalledTimes(0);

    fireEvent.click(shareButton);

    expect(onInteractionSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Test Share Title")).toBeInTheDocument();
  });
});
