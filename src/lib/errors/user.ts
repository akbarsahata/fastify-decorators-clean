import createError from 'fastify-error';

export const ERR_USER_NOT_FOUND = createError('USER_NOT_FOUND', 'User not found', 404);

export const ERR_OTP_NOT_FOUND = createError('otp_not_found', 'OTP not found', 400);

export const ERR_OTP_EXPIRED = createError('otp', 'OTP expired', 400);

export const ERR_OTP_REQUEST_TOO_SOON = createError('otp', 'OTP request too soon', 400);
