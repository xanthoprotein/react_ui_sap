import { configureStore } from "@reduxjs/toolkit";
import chatReducer, {
  updateFeedback,
  addFeedbackComment,
} from "../redux/slices/chatSlice";
import { Provider } from "react-redux";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AIResponse from "../components/chat/AIResponse";

describe("AIResponse Component - Feedback Feature", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: { chat: chatReducer },
      preloadedState: {
        chat: {
          chats: [],
          users: [],
          currentChat: null,
          loading: false,
          error: null,
          chatHistory: [
            {
              id: "msg-123",
              sender: "system" as "system",
              message: "AI Response",
              timestamp: Date.now(),
              feedback: null,
              comment: "",
            },
          ],
        },
      },
    });
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  test("renders feedback buttons", () => {
    render(
      <Provider store={store}>
        <AIResponse
          id="msg-123"
          message="AI Response"
          timestamp={Date.now()}
          feedback={null}
          onThumbsUp={function (): void {
            throw new Error("Function not implemented.");
          }}
          onThumbsDown={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCopy={function (): void {
            throw new Error("Function not implemented.");
          }}
          copied={false}
          showCommentBox={false}
          comment={""}
          onCommentChange={function (
            e: React.ChangeEvent<HTMLTextAreaElement>
          ): void {
            throw new Error("Function not implemented.");
          }}
          onSubmitFeedback={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCloseCommentBox={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </Provider>
    );

    expect(
      screen.getByRole("button", { name: "Thumbs Up" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Thumbs Down" })
    ).toBeInTheDocument();
  });

  test("dispatches updateFeedback when thumbs up is clicked", async () => {
    render(
      <Provider store={store}>
        <AIResponse
          id="msg-123"
          message="AI Response"
          timestamp={Date.now()}
          feedback={null}
          onThumbsUp={function (): void {
            throw new Error("Function not implemented.");
          }}
          onThumbsDown={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCopy={function (): void {
            throw new Error("Function not implemented.");
          }}
          copied={false}
          showCommentBox={false}
          comment={""}
          onCommentChange={function (
            e: React.ChangeEvent<HTMLTextAreaElement>
          ): void {
            throw new Error("Function not implemented.");
          }}
          onSubmitFeedback={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCloseCommentBox={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Thumbs Up" }));

    await waitFor(() => {
      expect(store.getState().chat.chatHistory[0].feedback).toBe("up");
    });
  });

  test("dispatches addFeedbackComment when submitting a comment", async () => {
    render(
      <Provider store={store}>
        <AIResponse
          id="msg-123"
          message="AI Response"
          timestamp={Date.now()}
          feedback={null}
          onThumbsUp={function (): void {
            throw new Error("Function not implemented.");
          }}
          onThumbsDown={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCopy={function (): void {
            throw new Error("Function not implemented.");
          }}
          copied={false}
          showCommentBox={false}
          comment={""}
          onCommentChange={function (
            e: React.ChangeEvent<HTMLTextAreaElement>
          ): void {
            throw new Error("Function not implemented.");
          }}
          onSubmitFeedback={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCloseCommentBox={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Thumbs Down" }));
    await screen.findByPlaceholderText(/Tell us what went wrong.../i);
    await userEvent.type(
      screen.getByPlaceholderText(/Tell us what went wrong.../i),
      "Incorrect response"
    );
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(store.getState().chat.chatHistory[0].comment).toBe(
        "Incorrect response"
      );
    });
  });
  test("toggles feedback properly", async () => {
    render(
      <Provider store={store}>
        <AIResponse
          id="msg-123"
          message="AI Response"
          timestamp={Date.now()}
          feedback={null}
          onThumbsUp={function (): void {
            throw new Error("Function not implemented.");
          }}
          onThumbsDown={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCopy={function (): void {
            throw new Error("Function not implemented.");
          }}
          copied={false}
          showCommentBox={false}
          comment={""}
          onCommentChange={function (
            e: React.ChangeEvent<HTMLTextAreaElement>
          ): void {
            throw new Error("Function not implemented.");
          }}
          onSubmitFeedback={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCloseCommentBox={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </Provider>
    );

    const thumbsUpBtn = screen.getByRole("button", { name: "Thumbs Up" });
    const thumbsDownBtn = screen.getByRole("button", { name: "Thumbs Down" });

    await userEvent.click(thumbsUpBtn);
    await waitFor(() => {
      expect(store.getState().chat.chatHistory[0].feedback).toBe("up");
    });

    await userEvent.click(thumbsUpBtn);
    await waitFor(() => {
      expect(store.getState().chat.chatHistory[0].feedback).toBe(null);
    });

    await userEvent.click(thumbsDownBtn);
    await waitFor(() => {
      expect(store.getState().chat.chatHistory[0].feedback).toBe("down");
    });

    await userEvent.click(thumbsDownBtn);
    await waitFor(() => {
      expect(store.getState().chat.chatHistory[0].feedback).toBe(null);
    });

    await userEvent.click(thumbsDownBtn);
    await userEvent.click(thumbsUpBtn);
    await waitFor(() => {
      expect(store.getState().chat.chatHistory[0].feedback).toBe("up");
    });
  });

  test("shows and hides comment box properly", async () => {
    render(
      <Provider store={store}>
        <AIResponse
          id="msg-123"
          message="AI Response"
          timestamp={Date.now()}
          feedback={null}
          onThumbsUp={function (): void {
            throw new Error("Function not implemented.");
          }}
          onThumbsDown={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCopy={function (): void {
            throw new Error("Function not implemented.");
          }}
          copied={false}
          showCommentBox={false}
          comment={""}
          onCommentChange={function (
            e: React.ChangeEvent<HTMLTextAreaElement>
          ): void {
            throw new Error("Function not implemented.");
          }}
          onSubmitFeedback={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCloseCommentBox={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </Provider>
    );

    const thumbsDownBtn = screen.getByRole("button", { name: "Thumbs Down" });

    await userEvent.click(thumbsDownBtn);
    expect(
      screen.getByPlaceholderText(/Tell us what went wrong.../i)
    ).toBeVisible();

    await userEvent.click(thumbsDownBtn);
    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText(/Tell us what went wrong.../i)
      ).toBeNull();
    });
  });

  test("clears comment when feedback is reset", async () => {
    render(
      <Provider store={store}>
        <AIResponse
          id="msg-123"
          message="AI Response"
          timestamp={Date.now()}
          feedback={null}
          onThumbsUp={function (): void {
            throw new Error("Function not implemented.");
          }}
          onThumbsDown={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCopy={function (): void {
            throw new Error("Function not implemented.");
          }}
          copied={false}
          showCommentBox={false}
          comment={""}
          onCommentChange={function (
            e: React.ChangeEvent<HTMLTextAreaElement>
          ): void {
            throw new Error("Function not implemented.");
          }}
          onSubmitFeedback={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCloseCommentBox={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </Provider>
    );

    await userEvent.click(screen.getByRole("button", { name: "Thumbs Down" }));
    await userEvent.type(
      screen.getByPlaceholderText(/Tell us what went wrong.../i),
      "Needs improvement"
    );
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(store.getState().chat.chatHistory[0].comment).toBe(
        "Needs improvement"
      );
    });

    await userEvent.click(screen.getByRole("button", { name: "Thumbs Down" }));

    await waitFor(() => {
      expect(store.getState().chat.chatHistory[0].comment).toBe("");
    });
  });

  test("copy button updates copied state", async () => {
    render(
      <Provider store={store}>
        <AIResponse
          id="msg-123"
          message="AI Response"
          timestamp={Date.now()}
          feedback={null}
          onThumbsUp={function (): void {
            throw new Error("Function not implemented.");
          }}
          onThumbsDown={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCopy={function (): void {
            throw new Error("Function not implemented.");
          }}
          copied={false}
          showCommentBox={false}
          comment={""}
          onCommentChange={function (
            e: React.ChangeEvent<HTMLTextAreaElement>
          ): void {
            throw new Error("Function not implemented.");
          }}
          onSubmitFeedback={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCloseCommentBox={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </Provider>
    );

    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(screen.getByTestId("copy-icon")).toBeInTheDocument(); // Ensure Copy icon is present

    await userEvent.click(screen.getByRole("button", { name: "Copy" }));

    await waitFor(() => {
      expect(screen.queryByTestId("copy-icon")).toBeNull(); // Copy icon should disappear
      expect(screen.getByTestId("check-icon")).toBeInTheDocument(); // Check icon should appear
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("AI Response");

    await waitFor(
      () => {
        expect(screen.queryByTestId("check-icon")).toBeNull();
        expect(screen.getByTestId("copy-icon")).toBeInTheDocument(); // Copy icon should return
      },
      { timeout: 2500 }
    );
  });
  test("copy button copies correct text to clipboard", async () => {
    render(
      <Provider store={store}>
        <AIResponse
          id="msg-123"
          message="AI Response"
          timestamp={Date.now()}
          feedback={null}
          onThumbsUp={function (): void {
            throw new Error("Function not implemented.");
          }}
          onThumbsDown={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCopy={function (): void {
            throw new Error("Function not implemented.");
          }}
          copied={false}
          showCommentBox={false}
          comment={""}
          onCommentChange={function (
            e: React.ChangeEvent<HTMLTextAreaElement>
          ): void {
            throw new Error("Function not implemented.");
          }}
          onSubmitFeedback={function (): void {
            throw new Error("Function not implemented.");
          }}
          onCloseCommentBox={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </Provider>
    );

    // Click the copy button
    await userEvent.click(screen.getByRole("button", { name: "Copy" }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("AI Response");
    });

    // console.log("Clipboard content:", navigator.clipboard.writeText.mock.calls);
  });
});
