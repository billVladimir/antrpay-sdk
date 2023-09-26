import axios, { AxiosInstance } from "axios";

export enum Curerncy {
  RUB = 1,
}

export interface InitParams {
  apiKey: string;
  baseUrl?: string;
}

export interface CreatePaymentFormParams {
  clientOrderID: string;
  payerID: string;
  amount: number;
  expireAt: number;
  currencyID: Curerncy.RUB;
  webhookURL: string;
  redirectURLs: {
    successUrl: string;
    failUrl: string;
  };
}

export interface CreatePaymentFormResponse {
  success: boolean;
  externalID: string;
  formURL: string;
}

export class Antrpay {
  private readonly apiKey: string;
  private readonly baseUrl: string = "https://antrpay.com/api/api";
  private readonly axiosInstance: AxiosInstance;

  constructor({ apiKey, baseUrl }: InitParams) {
    this.apiKey = apiKey;
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "API-Key": this.apiKey,
      },
    });
  }

  public async createPaymentForm(params: CreatePaymentFormParams) {
    const response = await this.axiosInstance.post(
      `/repayment/create_payment_fps`,
      params,
    );
    return response.data;
  }
}
