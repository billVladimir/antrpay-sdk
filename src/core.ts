import axios, { AxiosInstance } from "axios";

export enum TypeOperation {
  Invoice = "invoice",
  Withdraw = "withdraw",
}

export enum Status {
  Created = 1,
  Pending,
  Failed,
  Succeed,
}

export interface CreatePayoutParams {
  UUID: string;
  clientOrderID: string;
  sum: number;
  ttl: number;
  message: string;
  type: string;
  walletID: number;
  webhookUrl: string;
  cardNumber: string;
  bankName?: string;
  payerInfo: PayerInfo;
}

export interface PayerInfo {
  payerID: string;
}

export enum Currency {
  RUB = 1,
  KZT = 3,
  EUR = 4,
  INT = 34,
  TRY = 35,
  UZS = 36,
  AZN = 37,
  KGS = 38,
  BYN = 39,
}

export interface InitParams {
  publicKey: string;
  secretKey: string;
  baseUrl?: string;
}

export interface CreatePaymentFormParams {
  clientOrderID: string;
  payerID: string;
  amount: number;
  expireAt: number;
  currencyID: Currency;
  webhookURL: string;
  redirectURLs: {
    successUrl: string;
    failUrl: string;
  };
  clientIP: string;
}

export interface CreatePaymentFormResponse {
  success: boolean;
  externalID: string;
  formURL: string;
}

export interface P2PPaymentFormParams {
  clientOrderID: string;
  payerID: string;
  amount: number;
  expireAt: number;
  comment: string;
  clientIP: string;
  currencyID: Currency;
  callbackURL: string;
  redirect: {
    successURL: string;
    failURL: string;
  };
}

export interface P2PPaymentFormResponse extends CreatePaymentFormResponse {}

export interface GetOrderDetailsParams {
  clientOrderID: string;
  uuid: string;
  type: "invoice" | "withdrawal";
}

export interface GettingOrdersParams {
  statusId?: Status;
  sumAt?: number;
  sumTo?: number;
  createdAtFrom?: number;
  createdAtTo?: number;
  id?: string;
  type?: TypeOperation;
  gatewayName?: string;
  limit: number;
  offset: number;
}

export class Antrpay {
  private readonly publicKey: string;
  private readonly secretKey: string;
  private readonly baseUrl: string = "https://antrpay.com/api/api";
  private readonly axiosInstance: AxiosInstance;

  constructor({ publicKey, secretKey, baseUrl }: InitParams) {
    this.publicKey = publicKey;
    this.secretKey = secretKey;
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }
    const axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "API-Key": this.publicKey,
      },
    });
    this.axiosInstance = axiosInstance;
  }

  // PAYMENT

  /**
   * Method for creating a Fast Payment System payment using Antrpay payment page
   */
  public async createPaymentForm(
    params: CreatePaymentFormParams,
  ): Promise<CreatePaymentFormResponse> {
    const response = await this.axiosInstance.post(
      `/repayment/create_payment_fps`,
      params,
    );
    return response.data;
  }

  public async p2pPaymentForm(
    params: P2PPaymentFormParams,
  ): Promise<P2PPaymentFormResponse> {
    const response = await this.axiosInstance.post(
      `/repayment/p2p_form`,
      params,
    );
    return response.data;
  }

  // PAYOUT

  /**
   * Method for create withdrawal request
   */
  public async createPayout(params: CreatePayoutParams) {
    const response = await this.axiosInstance.post(
      `/repayment/create_payout`,
      params,
    );
    return response.data;
  }

  // ORDERS

  /**
   * Method for detailed information about an order
   *
   * You need to use the "clientOrderID" or "uuid" to search information about the order.
   */
  public async getOrderDetails(params: GetOrderDetailsParams) {
    const response = await this.axiosInstance.post(
      `/repayment/fetch_order_info`,
      params,
    );
    return response.data;
  }

  /**
   * Method for current balance for each of the available currencies
   */
  public async balanceInfo() {
    const response = await this.axiosInstance.post(
      `/repayment/fetch_balance`,
      {},
    );
    return response.data;
  }

  /**
   * Method for getting orders' information by filtering.
   */
  public async getOrders(params: GettingOrdersParams) {
    const response = await this.axiosInstance.post(
      `/repayment/get_orders`,
      params,
    );
    return response.data;
  }
}
