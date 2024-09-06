import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T> {
  @ApiProperty({ type: Number })
  responseCode: number;

  @ApiProperty({ type: String })
  responseMessage: string;

  @ApiProperty({ type: () => Object })
  responseData: T | undefined;

  static getSuccessResponse<T>(data?: T, message?: string, status?: number) {
    const response: BaseResponse<T> = new BaseResponse();
    response.responseCode = status ?? HttpStatus.OK;
    response.responseMessage = message ?? 'Success';
    response.responseData = data ?? undefined;
    return response;
  }

  static getBadRequestResponse<T>(data?: T, message?: string) {
    const response: BaseResponse<T> = new BaseResponse();
    response.responseCode = HttpStatus.BAD_REQUEST;
    response.responseMessage = message ?? 'Bad Request';
    response.responseData = data ?? ('Bad Request' as any);
    return response;
  }
}
