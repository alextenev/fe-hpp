import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAcceptQuote } from "./quote-accept-mutation";
import * as api from "./api";
import { useRouter } from "next/navigation";

jest.mock("./api");
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));

describe("useAcceptQuote", () => {
  let queryClient: QueryClient;
  let pushMock: jest.Mock;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (api.acceptQuote as jest.Mock).mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  function TestComponent() {
    const mutation = useAcceptQuote();
    return (
      <button
        onClick={() => mutation.mutate({ uuid: "abc-123" })}
        disabled={mutation.isPending}
      >
        Accept
      </button>
    );
  }

  it("accepts the quote, invalidates the cache & redirects", async () => {
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    render(<TestComponent />, { wrapper: Wrapper });

    await userEvent.click(screen.getByRole("button", { name: /accept/i }));
    await waitFor(() => expect(invalidateSpy).toHaveBeenCalled());

    expect(api.acceptQuote).toHaveBeenCalledWith("abc-123");

    expect(pushMock).toHaveBeenCalledWith("/payin/abc-123/pay");
  });
});
