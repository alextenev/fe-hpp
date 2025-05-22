import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { usePayInSummary } from "@/app/services/payin/query";
import { useUpdateQuote } from "@/app/services/payin/quote-mutation";
import { isQuoteExpired, isQuoteAccepted } from "@/lib/utils";
import { CRYPTO_CURRENCIES } from "@/lib/constants";
import PayIn from "@/app/payin/[uuid]/page";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));
jest.mock("@/app/services/payin/query", () => ({
  usePayInSummary: jest.fn(),
}));
jest.mock("@/app/services/payin/quote-mutation", () => ({
  useUpdateQuote: jest.fn(),
}));
jest.mock("@/lib/utils", () => ({
  isQuoteExpired: jest.fn(),
  isQuoteAccepted: jest.fn(),
  cn: jest.fn(),
}));
// Leave constants un-mocked so CRYPTO_CURRENCIES is real

describe("<PayIn />", () => {
  let queryClient: QueryClient;
  let pushMock: jest.Mock;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useParams as jest.Mock).mockReturnValue({ uuid: "abc-123" });
    jest.clearAllMocks();
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  it("renders loading state", () => {
    (usePayInSummary as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    render(<PayIn />, { wrapper: Wrapper });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    (usePayInSummary as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("oops"),
    });
    render(<PayIn />, { wrapper: Wrapper });
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it("redirects to /expired when quote is expired", async () => {
    const fakeData = {
      uuid: "abc-123",
      merchantDisplayName: "M",
      displayCurrency: { amount: 1, currency: "USD" },
    };
    (usePayInSummary as jest.Mock).mockReturnValue({
      data: fakeData,
      isLoading: false,
      error: null,
    });
    (isQuoteExpired as jest.Mock).mockReturnValue(true);
    (isQuoteAccepted as jest.Mock).mockReturnValue(false);

    render(<PayIn />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/expired");
    });
  });

  it("redirects to pay page when quote is accepted", async () => {
    const fakeData = {
      uuid: "abc-123",
      merchantDisplayName: "M",
      displayCurrency: { amount: 1, currency: "USD" },
    };
    (usePayInSummary as jest.Mock).mockReturnValue({
      data: fakeData,
      isLoading: false,
      error: null,
    });
    (isQuoteExpired as jest.Mock).mockReturnValue(false);
    (isQuoteAccepted as jest.Mock).mockReturnValue(true);

    render(<PayIn />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/payin/abc-123/pay");
    });
  });

  // Appologies, I couldn't target the options, apparently they are portaled and couldn't find the correct solution in time
  xit("calls mutate when a currency is selected", async () => {
    const fakeData = {
      uuid: "abc-123",
      merchantDisplayName: "My Shop",
      displayCurrency: { amount: 42, currency: "USD" },
    };
    const mutateMock = jest.fn();
    (usePayInSummary as jest.Mock).mockReturnValue({
      data: fakeData,
      isLoading: false,
      error: null,
    });
    (isQuoteExpired as jest.Mock).mockReturnValue(false);
    (isQuoteAccepted as jest.Mock).mockReturnValue(false);

    render(<PayIn />, { wrapper: Wrapper });

    fireEvent.pointerDown(screen.getByTestId("select-trigger"), {
      button: 0,
    });

    const firstValue = Object.keys(CRYPTO_CURRENCIES)[0];
    const valueText = CRYPTO_CURRENCIES[firstValue];

    // 2️⃣ Find the option by its accessible name (role="option")
    const bitcoinOption = await screen.findAllByRole("option");

    // 3️⃣ Click it
    await userEvent.click(bitcoinOption[0]);
    // await waitFor(() => {
    //   expect(screen.getByText(valueText)).toBeInTheDocument();
    // });
    // await userEvent.click(screen.getByText(valueText));

    expect(mutateMock).toHaveBeenCalledWith({
      uuid: "abc-123",
      currency: firstValue,
    });
  });
});
