import { FastifyReply, FastifyRequest } from 'fastify';
import { Controller, Inject, POST } from 'fastify-decorators';
import {
  requestOtpErrorResponseDTO,
  RequestOtpRequestBody,
  requestOtpRequestBodyDTO,
  RequestOtpSuccessResponse,
  requestOtpSuccessResponseDTO,
  ValidateOtpRequestBody,
  validateOtpRequestBodyDTO,
  ValidateOtpSuccessResponse,
  validateOtpSuccessResponseDTO,
} from '../../../application/dtos/otp.dto';
import { OtpUseCase } from '../../../application/usecases/otp.usecase';

@Controller({
  route: '/otp',
  tags: [{ name: 'otp' }],
})
export default class OtpController {
  @Inject(OtpUseCase)
  private usecase: OtpUseCase;

  @POST({
    url: '/request',
    options: {
      schema: {
        body: requestOtpRequestBodyDTO,
        response: {
          '2xx': requestOtpSuccessResponseDTO,
          '4xx': requestOtpErrorResponseDTO,
        },
      },
    },
  })
  async requestOtp(
    request: FastifyRequest<{
      Body: RequestOtpRequestBody;
    }>,
    response: FastifyReply,
  ): Promise<RequestOtpSuccessResponse> {
    const result = await this.usecase.requestOtp(request.body);

    response.status(201);

    return result;
  }

  @POST({
    url: '/validate',
    options: {
      schema: {
        body: validateOtpRequestBodyDTO,
        response: {
          '2xx': validateOtpSuccessResponseDTO,
          '4xx': requestOtpErrorResponseDTO,
        },
      },
    },
  })
  async validateOtp(
    request: FastifyRequest<{
      Body: ValidateOtpRequestBody;
    }>,
    response: FastifyReply,
  ): Promise<ValidateOtpSuccessResponse> {
    const result = await this.usecase.validateOtp(request.body);

    response.status(200);

    return result;
  }
}
