import { add, isAfter, isBefore } from 'date-fns';
import { Inject, Service } from 'fastify-decorators';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserPgsqlRepository } from '../../infrastructure/database/repositories/pgsql/user-pgsql.repository';
import { env } from '../../lib/config/env';
import {
  ERR_OTP_EXPIRED,
  ERR_OTP_NOT_FOUND,
  ERR_OTP_REQUEST_TOO_SOON,
  ERR_USER_NOT_FOUND,
} from '../../lib/errors/user';
import { generateOtp } from '../../lib/utils/helpers';

@Service()
export class OtpService {
  @Inject(UserPgsqlRepository) userRepository: UserRepository;

  async createOrUpdateOtpByUserId(userId: string) {
    const now = new Date();

    const user = await this.userRepository.getOne({
      where: { id: userId },
      select: {
        id: true,
        otp: true,
        lastOtpRequestAt: true,
      },
    });

    if (!user) throw ERR_USER_NOT_FOUND();

    const otpExpiry = add(user.lastOtpRequestAt, { minutes: env.OTP_EXPIRY_MINUTES });

    if (user.otp && isBefore(now, otpExpiry)) {
      throw ERR_OTP_REQUEST_TOO_SOON();
    }

    const otp = generateOtp();

    await this.userRepository.updateOneById(userId, {
      otp,
      lastOtpRequestAt: new Date(),
      lastOtpValidationAt: null,
    });

    return {
      otp,
      userId,
    };
  }

  async validateOtpByUserId(userId: string, otp: string) {
    const now = new Date();

    const user = await this.userRepository.getOne({
      where: { id: userId, otp },
    });

    if (!user) throw ERR_OTP_NOT_FOUND();

    const otpExpiry = add(user.lastOtpRequestAt, { minutes: env.OTP_EXPIRY_MINUTES });

    if (isAfter(now, otpExpiry)) {
      throw ERR_OTP_EXPIRED();
    }

    if (user.lastOtpValidationAt) {
      throw ERR_OTP_EXPIRED('potentially compromised');
    }

    await this.userRepository.updateOneById(userId, {
      lastOtpValidationAt: new Date(),
    });

    return user.id;
  }
}
