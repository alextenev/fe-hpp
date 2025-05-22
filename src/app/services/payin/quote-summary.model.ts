export interface QuoteSummary {
  metadata: Metadata;
  uuid: string;
  merchantDisplayName: string;
  merchantId: string;
  dateCreated: number;
  expiryDate: number;
  quoteExpiryDate: any;
  acceptanceExpiryDate: any;
  quoteStatus: string;
  reference: string;
  type: string;
  subType: string;
  status: string;
  displayCurrency: DisplayCurrency;
  walletCurrency: DisplayCurrency;
  paidCurrency: DisplayCurrency;
  feeCurrency: DisplayCurrency;
  networkFeeCurrency: any;
  displayRate: any;
  exchangeRate: any;
  address: any;
  returnUrl: string;
  redirectUrl: string;
  transactions: any[];
  refund: any;
  refunds: any[];
  currencyOptions: any[];
  flow: string;
  twoStep: boolean;
  pegged: boolean;
  customerId: string;
  walletId: string;
}

interface Metadata {}

interface DisplayCurrency {
  currency: string;
  amount: number;
  actual: number;
}
