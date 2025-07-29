export interface BaseResponse<T = unknown> {
  message: string;
  success: boolean;
  data?: T;
}

export type SimpleResponse = BaseResponse<null>;
