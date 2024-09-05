import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpClientService {
  constructor(private httpService: HttpService) {}

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const { data } = await firstValueFrom(
      this.httpService.get(url, config ?? {}),
    );
    return data as T;
  }
}
