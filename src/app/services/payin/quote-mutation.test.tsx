import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUpdateQuote } from "./quote-mutation";
import * as api from "./api";
import { useRouter } from "next/navigation";
import * as utils from "@/lib/utils";

jest.mock("./api");
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("@/lib/utils");

describe("useUpdateQuote", () => {
  let queryClient: QueryClient;
  let pushMock: jest.Mock;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  function TestComponent() {
    const mutation = useUpdateQuote();
    return (
      <button
        onClick={() => mutation.mutate({ uuid: "foo-123", currency: "USD" })}
        disabled={mutation.isPending}
      >
        Update
      </button>
    );
  }

  it("redirects to /expired when quote is expired", async () => {
    (api.updateQuote as jest.Mock).mockResolvedValue({ uuid: "foo-123" });
    (utils.isQuoteExpired as jest.Mock).mockReturnValue(true);
    (utils.isQuoteAccepted as jest.Mock).mockReturnValue(false);

    render(<TestComponent />, { wrapper: Wrapper });
    await userEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(api.updateQuote).toHaveBeenCalledWith("foo-123", "USD");
      expect(pushMock).toHaveBeenCalledWith("/expired");
    });
  });

  it("redirects to payin when quote is accepted", async () => {
    (api.updateQuote as jest.Mock).mockResolvedValue({ uuid: "foo-123" });
    (utils.isQuoteExpired as jest.Mock).mockReturnValue(false);
    (utils.isQuoteAccepted as jest.Mock).mockReturnValue(true);

    render(<TestComponent />, { wrapper: Wrapper });
    await userEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(api.updateQuote).toHaveBeenCalledWith("foo-123", "USD");
      expect(pushMock).toHaveBeenCalledWith("/payin/foo-123/pay");
    });
  });

  it("does nothing when neither expired nor accepted", async () => {
    (api.updateQuote as jest.Mock).mockResolvedValue({ uuid: "foo-123" });
    (utils.isQuoteExpired as jest.Mock).mockReturnValue(false);
    (utils.isQuoteAccepted as jest.Mock).mockReturnValue(false);

    render(<TestComponent />, { wrapper: Wrapper });
    await userEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => {
      expect(api.updateQuote).toHaveBeenCalled();
      expect(pushMock).not.toHaveBeenCalled();
    });
  });
});
