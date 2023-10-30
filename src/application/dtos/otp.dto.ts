import { Static, Type } from '@sinclair/typebox';

export const requestOtpRequestBodyDTO = Type.Object({
  user_id: Type.String(),
});

export const requestOtpSuccessResponseDTO = Type.Object({
  user_id: Type.String(),
  otp: Type.String(),
});

export const requestOtpErrorResponseDTO = Type.Object({
  error: Type.String(),
  error_description: Type.String(),
});

export const validateOtpRequestBodyDTO = Type.Object({
  user_id: Type.String(),
  otp: Type.String(),
});

export const validateOtpSuccessResponseDTO = Type.Object({
  user_id: Type.String(),
  message: Type.String(),
});

export type RequestOtpRequestBody = Static<typeof requestOtpRequestBodyDTO>;

export type RequestOtpSuccessResponse = Static<typeof requestOtpSuccessResponseDTO>;

export type RequestOtpErrorResponse = Static<typeof requestOtpErrorResponseDTO>;

export type ValidateOtpRequestBody = Static<typeof validateOtpRequestBodyDTO>;

export type ValidateOtpSuccessResponse = Static<typeof validateOtpSuccessResponseDTO>;
