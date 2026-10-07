// docs/API_SPEC.md 6장 services/errors.ts의 임시 구현. services가 올라오면 "@/services/errors"로 교체합니다.

export type AppErrorCode =
  | "NOT_AUTHENTICATED"
  | "CART_EMPTY"
  | "UNAVAILABLE_ITEM"
  | "PURCHASE_LIMIT_EXCEEDED"
  | "OUT_OF_STOCK"
  | "INVALID_ORDER"
  | "ALREADY_CANCELLED"
  | "INVALID_CREDENTIALS"
  | "EMAIL_ALREADY_EXISTS"
  | "WEAK_PASSWORD"
  | "UNKNOWN";

export class AppError extends Error {
  code: AppErrorCode;
  detail?: string;

  constructor(code: AppErrorCode, detail?: string) {
    super(code);
    this.code = code;
    this.detail = detail;
  }
}
