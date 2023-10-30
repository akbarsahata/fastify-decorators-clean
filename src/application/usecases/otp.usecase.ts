import { Inject, Service } from 'fastify-decorators';
import {
  RequestOtpRequestBody,
  RequestOtpSuccessResponse,
  ValidateOtpRequestBody,
  ValidateOtpSuccessResponse,
} from '../dtos/otp.dto';
import { OtpService } from '../services/otp.service';

@Service()
export class OtpUseCase {
  @Inject(OtpService) service: OtpService;

  async requestOtp(body: RequestOtpRequestBody): Promise<RequestOtpSuccessResponse> {
    const { user_id } = body;

    const { otp, userId } = await this.service.createOrUpdateOtpByUserId(user_id);

    return {
      otp,
      user_id: userId,
    };
  }

  async validateOtp(body: ValidateOtpRequestBody): Promise<ValidateOtpSuccessResponse> {
    const { user_id, otp } = body;

    const userId = await this.service.validateOtpByUserId(user_id, otp);

    return {
      user_id: userId,
      message: 'OTP validated successfully.',
    };
  }
}
