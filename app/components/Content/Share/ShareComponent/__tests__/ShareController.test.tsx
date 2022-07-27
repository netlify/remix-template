import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor
} from "@testing-library/react";
import ShareController from "../ShareController";

describe("ShareController", () => {
  const shareData: ShareData = { title: "Title", text: "", url: "http" };
  const onSuccessSpy = jest.fn();
  const onErrorSpy = jest.fn();
  const onInteractionSpy = jest.fn();
  const onNonNativeShareSpy = jest.fn();

  const mockComponent = <div>Test Share</div>;

  let windowSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    // Spy on the read-only window function which
    // returns a reference to the current window.
    windowSpy = jest.spyOn(window, "window", "get");
  });

  afterEach(() => windowSpy.mockRestore());

  it("it renders child components", () => {
    render(
      <ShareController shareData={shareData}>{mockComponent}</ShareController>
    );
    expect(screen.getByText("Test Share")).toBeInTheDocument();
  });

  it("Should call interaction callback function if it exists when clicked", async () => {
    render(
      <ShareController shareData={shareData} onInteraction={onInteractionSpy}>
        {mockComponent}
      </ShareController>
    );
    expect(onInteractionSpy).toHaveBeenCalledTimes(0);

    const shareButton = screen.getByText("Test Share");
    act(() => {
      fireEvent.click(shareButton);
    });

    expect(onInteractionSpy).toHaveBeenCalledTimes(1);
  });

  it("should call onNonNativeShare if navigator.share does not exist", async () => {
    Object.defineProperty(window, "navigator", {
      get() {
        return { share: null };
      }
    });

    render(
      <ShareController
        shareData={shareData}
        onSuccess={onSuccessSpy}
        onError={onErrorSpy}
        onNonNativeShare={onNonNativeShareSpy}
      >
        {mockComponent}
      </ShareController>
    );

    const shareButton = screen.getByText("Test Share");
    act(() => {
      fireEvent.click(shareButton);
    });
    expect(onErrorSpy).not.toHaveBeenCalled();
    expect(onSuccessSpy).not.toHaveBeenCalled();
    expect(onNonNativeShareSpy).toHaveBeenCalledTimes(1);
  });

  it("should be successful if navigator.share exists", async () => {
    const mockShare = jest.fn();
    Object.defineProperty(window, "navigator", {
      get() {
        return { share: mockShare };
      }
    });

    render(
      <ShareController
        shareData={shareData}
        onSuccess={onSuccessSpy}
        onError={onErrorSpy}
      >
        {mockComponent}
      </ShareController>
    );

    const shareButton = screen.getByText("Test Share");
    act(() => {
      fireEvent.click(shareButton);
    });

    await waitFor(() => {
      expect(onSuccessSpy).toHaveBeenCalled();
    });
  });

  it("should capture error if navigator.share exists but an error occurred", async () => {
    const mockShare = jest.fn().mockReturnValue(Promise.reject("Error"));
    Object.defineProperty(window, "navigator", {
      get() {
        return { share: mockShare };
      }
    });

    render(
      <ShareController
        shareData={shareData}
        onSuccess={onSuccessSpy}
        onError={onErrorSpy}
      >
        {mockComponent}
      </ShareController>
    );

    const shareButton = screen.getByText("Test Share");
    act(() => {
      fireEvent.click(shareButton);
    });

    await waitFor(() => {
      expect(onErrorSpy).toHaveBeenCalledWith("Error");
    });
  });

  it("onClick is disabled by prop", () => {
    render(
      <ShareController
        shareData={shareData}
        onInteraction={onInteractionSpy}
        disabled
      >
        {mockComponent}
      </ShareController>
    );

    expect(onInteractionSpy).toHaveBeenCalledTimes(0);

    const shareButton = screen.getByText("Test Share");
    act(() => {
      fireEvent.click(shareButton);
    });

    expect(onInteractionSpy).toHaveBeenCalledTimes(0);
  });
});
