import { BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BaseResponse } from '../../dto/baseResponse.dto';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

export const extractUsernameFromEmail = (email: string): string => {
  if (!email) {
    throw new BadRequestException('Email is required');
  }
  return email.split('@')[0];
};

/**
 * Hash a password using bcrypt.
 *
 * @param password The password to hash.
 * @param saltOrRound The number of rounds to use when hashing the password.
 ** @returns The hashed password.
 * */
export const hashPassword = (
  password: string,
  saltOrRound?: number,
): string => {
  if (!password) {
    throw new BadRequestException('Password is required');
  }
  return bcrypt.hashSync(password, saltOrRound ?? 10);
};

export const isPasswordValid = (
  password: string,
  hash: string | undefined,
): boolean => {
  if (!password || !hash) {
    return false;
  }
  return bcrypt.compareSync(password, hash);
};

/**
 * Translate a Prisma error into a BaseResponse object.
 *
 * @param err The error from Prisma.
 * @param defaultMessage The default message to use if the error is not a
 *                        PrismaClientKnownRequestError or
 *                        PrismaClientValidationError.
 * @returns A BaseResponse object containing the translated error.
 */
export const translatePrismaError = (err: Error, defaultMessage: string) => {
  const response: BaseResponse<any> = new BaseResponse();
  response.responseMessage = defaultMessage;
  switch (err.name) {
    case PrismaClientKnownRequestError.name: {
      const prismaErr: PrismaError = getPrismaError(err);
      response.responseCode = prismaErr.httpStatus;
      response.responseData = prismaErr.message;
      break;
    }
    case PrismaClientValidationError.name: {
      response.responseCode = HttpStatus.BAD_REQUEST;
      const messages = err.message.split('\n');
      response.responseData =
        messages[messages.length - 1]?.trim() ??
        PrismaClientValidationError.name;
      break;
    }
    default:
      response.responseCode = HttpStatus.INTERNAL_SERVER_ERROR;
      break;
  }
  return response;
};

/**
 * Add a specified number of days to the given date.
 *
 * @param date The date to which to add the days.
 * @param days The number of days to add.
 * @returns A new `Date` object, which is the result of adding
 * `days` to `date`.
 */

export const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Calculate a date 30 days from now.
 *
 * @returns A new `Date` object, which is 30 days from the current date.
 */

export const next30Days = () => {
  return addDays(new Date(), 30);
};

export declare interface PrismaError {
  message: string;
  httpStatus: number;
}
export const getPrismaError = (error: any): PrismaError => {
  const logger: Logger = new Logger('CommonUtil');
  switch (error.code) {
    case 'P2002':
      return {
        message: `Duplicate entry for attribute ${error.meta.target} of ${error.meta?.modelName}`,
        httpStatus: HttpStatus.CONFLICT,
      };
    case 'P2025':
      return {
        message: `${error.meta.cause} Model: ${error.meta.modelName}`,
        httpStatus: HttpStatus.NOT_FOUND,
      };
    case 'P2003':
      return {
        message: `Foreign key constraint failed on the field: ${error.meta['field_name']}`,
        httpStatus: HttpStatus.BAD_REQUEST,
      };
    case 'P1001':
      return {
        message: 'Database connection timeout. Please try again.',
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    case 'P2024': {
      const message = error?.message?.split('\n');
      return {
        message:
          message[message.length - 1]?.trim() ??
          `error ${error.code}: ${error.message}`,
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
    default:
      logger.error(error);
      return {
        message: 'something went wrong',
        httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      };
  }
};

/**
 * Converts a wildcard pattern to a regular expression.
 * @param pattern The wildcard pattern (e.g., '/api/somepath/*')
 * @returns A regular expression that matches the pattern.
 */
export const convertPatternToRegExp = (pattern: string): RegExp => {
  const escapedPattern = pattern
    .replace(/([.*+?^${}()|[\]\\])/g, '\\$1') // Escape special characters
    .replace(/:\w+/g, '\\w+') // Convert ':id' or ':parameter' to '\d+' for numeric values
    .replace(/\\\*/g, '.*') // Replace '*' with '.*'
    .replace(/\\\?/g, '.') // Optionally replace '?' with '.'
    .replace(/\\\[/g, '[') // Unescape '[' for character classes
    .replace(/\\]/g, ']') // Unescape ']' for character classes
    .replace(/\\\(/g, '(') // Unescape '(' for capturing groups if needed
    .replace(/\\\)/g, ')'); // Unescape ')' for capturing groups if needed

  // Return a RegExp object with anchors to match the entire string
  return new RegExp(`^${escapedPattern}$`);
};

export const getUsername = (request: any) => {
  return request?.user?.username;
};
