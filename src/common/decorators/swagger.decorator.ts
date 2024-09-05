import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiParam,
} from '@nestjs/swagger';
import { BaseResponse } from '../../dto/baseResponse.dto';

export interface ApiBaseResponseOptions<T> {
  model: T;
  isArray?: boolean;
  statusCode?: number;
  description?: string;
}

export interface ApiParamOptions {
  name?: string;
  type?: Type<unknown>;
  example?: any;
}
export function ApiBaseResponse<T extends Type>(
  options: ApiBaseResponseOptions<T>,
) {
  const { model, isArray = false, statusCode = 200, description } = options;
  return applyDecorators(
    ApiExtraModels(BaseResponse as any, model as any),
    ApiResponse({
      status: statusCode,
      description: description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponse.name) },
          {
            properties: {
              responseData: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(model.name) },
                  }
                : { $ref: getSchemaPath(model.name) },
            },
          },
        ],
      },
    }),
  );
}

export function ApiNotFoundBaseResponse<T extends Type>(model?: T) {
  return applyDecorators(
    ApiExtraModels(BaseResponse as any, (model ?? 'string') as any),
    ApiResponse({
      status: 404,
      description: 'Data not found',
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponse.name) },
          {
            properties: {
              responseData: {
                type: 'string',
              },
              responseCode: {
                type: 'number',
                example: 404,
              },
            },
          },
        ],
      },
    }),
  );
}

export function ApiParamId(options?: ApiParamOptions) {
  const { name = 'id', type, example } = options ?? {};
  return applyDecorators(
    ApiParam({
      name: name,
      type: type || Number,
      example: example || 1,
    }),
  );
}
