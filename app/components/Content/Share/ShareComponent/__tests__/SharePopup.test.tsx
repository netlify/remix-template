import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";

import SharePopup from "../SharePopup";

describe("SharePopup ", () => {
  let windowSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    windowSpy = jest.spyOn(window, "window", "get");
  });

  afterEach(() => windowSpy.mockRestore());

  const shareData: ShareData = {
    title: "Test Share",
    text: "",
    url:
      "https://m.mattk.dev.skybet.com/football/premier-league/event/2656570?build-a-bet=86344953,86344991"
  };
  const onCloseSpy = jest.fn();

  it("Should call the onClose function when close button is called", async () => {
    render(<SharePopup shareData={shareData} onClose={onCloseSpy} />);

    expect(onCloseSpy).toHaveBeenCalledTimes(0);
    const closeButton = screen.getByLabelText("Close Share");
    expect(closeButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(closeButton);
    });
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });

  it("Should copy the url to the clipboard", () => {
    const mock = jest.fn();

    Object.defineProperty(navigator, "clipboard", {
      get() {
        return { writeText: mock };
      }
    });

    render(<SharePopup shareData={shareData} onClose={onCloseSpy} />);

    const copyButton = screen.getByText("Copy link");
    expect(copyButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(copyButton);
    });

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(shareData.url);
  });
});
