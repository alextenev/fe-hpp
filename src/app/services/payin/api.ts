import { QuoteSummary } from "./quote-summary.model";

const baseUrl = "https://api.sandbox.bvnk.com/";
const quoteSummaryPath = "api/v1/pay/<UUID>/summary";
const updateQuotePath = "api/v1/pay/<UUID>/update/summary";
const acceptQuotePath = "api/v1/pay/<UUID>/accept/summary";

const cache = false;

export const getQuoteSummary = async (uuid: string): Promise<QuoteSummary> => {
  const url = `${baseUrl}${quoteSummaryPath.replace("<UUID>", uuid)}`;

  if (cache) {
    return Promise.resolve(summary);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};

export const updateQuote = async (
  uuid: string,
  currency: string,
): Promise<QuoteSummary> => {
  const body = JSON.stringify({
    currency,
    payInMethod: "crypto",
  });
  const url = `${baseUrl}${updateQuotePath.replace("<UUID>", uuid)}`;
  const res = await fetch(url, {
    method: "PUT",
    body,
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to update quote");

  return res.json();
};

export const acceptQuote = async (uuid: string): Promise<any> => {
  const body = JSON.stringify({
    successUrl: "no_url",
  });

  const url = `${baseUrl}${acceptQuotePath.replace("<UUID>", uuid)}`;

  const res = await fetch(url, {
    method: "PUT",
    body,
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to update quote");

  return res.json();
};

const summary = {
  metadata: {},
  uuid: "5cdc709f-31d1-4dc6-a6d4-1bd41fc764b8",
  merchantDisplayName: "Business Account",
  merchantId: "fb140b88-7296-4397-bd9e-47b29a4805ee",
  dateCreated: 1747680749783,
  expiryDate: 1747680809783,
  quoteExpiryDate: null,
  acceptanceExpiryDate: null,
  quoteStatus: "TEMPLATE",
  reference: "test_reference_in_5pEHd3",
  type: "IN",
  subType: "merchantPayIn",
  status: "PENDING",
  displayCurrency: {
    currency: "ZAR",
    amount: 200,
    actual: 0,
  },
  walletCurrency: {
    currency: "ZAR",
    amount: 200,
    actual: 0,
  },
  paidCurrency: {
    currency: null,
    amount: 0,
    actual: 0,
  },
  feeCurrency: {
    currency: "ZAR",
    amount: 0,
    actual: 0,
  },
  networkFeeCurrency: null,
  displayRate: null,
  exchangeRate: null,
  address: null,
  returnUrl: "",
  redirectUrl:
    "https://pay.sandbox.bvnk.com/payin/5cdc709f-31d1-4dc6-a6d4-1bd41fc764b8",
  transactions: [],
  refund: null,
  refunds: [],
  currencyOptions: [],
  flow: "DEFAULT",
  twoStep: false,
  pegged: false,
  customerId: "123",
  walletId: "acc:23072827499842:8OyLj:0",
} as any as PayInSummary;
