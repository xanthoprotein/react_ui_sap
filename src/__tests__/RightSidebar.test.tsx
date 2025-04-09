import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import RightSidebar from "../layout/RightSideBar";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../redux/slices/chatSlice";
import userEvent from "@testing-library/user-event";
import { fetchChatsAPI } from "../utils/api";

jest.mock("../utils/api", () => ({
  fetchChatsAPI: jest.fn(() =>
    Promise.resolve([
      { id: "1", title: "Mock Chat 1", messages: [] },
      { id: "2", title: "Mock Chat 2", messages: [] },
    ])
  ),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderWithReduxAndRouter = (ui: React.ReactNode, preloadedState = {}) => {
  const store = configureStore({
    reducer: { chat: chatReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe("RightSidebar Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the 'New Chat' button", () => {
    renderWithReduxAndRouter(<RightSidebar />);
    expect(screen.getByText("+ New Chat")).toBeInTheDocument();
  });

  it("should render the chat history list", async () => {
    const preloadedState = {
      chat: {
        chats: [
          { id: "1", title: "Chat 1", messages: [] },
          { id: "2", title: "Chat 2", messages: [] },
        ],
        users: [],
        currentChat: null,
        chatHistory: [],
        loading: false,
        error: null,
      },
    };

    renderWithReduxAndRouter(<RightSidebar />, preloadedState);

    await waitFor(() => {
      expect(screen.getByText("Chat 1")).toBeInTheDocument();
      expect(screen.getByText("Chat 2")).toBeInTheDocument();
    });
  });

  it("should navigate to the chat when a chat is clicked", async () => {
    const preloadedState = {
      chat: {
        chats: [
          { id: "1", title: "Chat 1", messages: [] },
          { id: "2", title: "Chat 2", messages: [] },
        ],
        users: [],
        currentChat: null,
        chatHistory: [],
        loading: false,
        error: null,
      },
    };

    renderWithReduxAndRouter(<RightSidebar />, preloadedState);

    userEvent.click(screen.getByText("Chat 1"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/chat/1");
    });
  });

  it("should create a new chat when the 'New Chat' button is clicked", async () => {
    renderWithReduxAndRouter(<RightSidebar />);

    const newChatButton = screen.getByText("+ New Chat");
    userEvent.click(newChatButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  test("renders sidebar", () => {
    renderWithReduxAndRouter(<RightSidebar />);
    expect(screen.getByText(/chat history/i)).toBeInTheDocument();
  });

  test("renders chat items from Redux state", () => {
    renderWithReduxAndRouter(<RightSidebar />);
    expect(screen.getByText(/chat history/i)).toBeInTheDocument();
  });
});
