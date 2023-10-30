export interface User {
  id: string;
  name: string;
  otp: string;
  createdAt: Date;
  modifiedAt: Date;
  lastOtpRequestAt: Date;
  lastOtpValidationAt: Date | null;
}
