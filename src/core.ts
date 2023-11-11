import axios, { AxiosInstance } from "axios";

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
  payerInfo: PayerInfo;
}

export interface PayerInfo {
  payerID: string;
}

export enum Currency {
  RUB = 1,
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
  currencyID: Currency.RUB;
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

export interface GetOrderDetailsParams {
  clientOrderID: string;
  uuid: string;
  type: "invoice" | "withdrawal";
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
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "API-Key": this.publicKey,
      },
    });
  }

  /**
   * Method for creating a Fast Payment System payment using Antrpay payment page
   *
   * @param {CreatePaymentFormParams} params
   * @returns {object}
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

  /**
   * Method for detailed information about an order
   *
   * You need to use the "clientOrderID" or "uuid" to search information about the order.
   *
   * @param {GetOrderDetailsParams} params
   * @returns {object}
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
   * Method for create withdrawal request
   */
  public async createPayout(params: CreatePayoutParams) {
    const response = await this.axiosInstance.post(
      `/repayment/create_payout`,
      params,
    );
    return response.data;
  }
}
