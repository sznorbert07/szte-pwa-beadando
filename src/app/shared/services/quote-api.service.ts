import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, timeout } from 'rxjs';
import { Quote, QuoteApiResponse } from '../model/quote';

@Injectable()
export class QuoteApiService {
  private _apiUrl: string = 'https://quotes.rest/qod?language=en';
  constructor(private httpClient: HttpClient) {}

  public getQuote(): Observable<Quote> {
    return this.httpClient.get<QuoteApiResponse>(this._apiUrl, { responseType: 'json' }).pipe(
      timeout(5000),
      map((response) => {
        return {
          quote: response.contents.quotes[0].quote,
          date: new Date(response.contents.quotes[0].date),
        } as Quote;
      })
    );
  }
}
