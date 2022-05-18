export interface QuoteApiResponse {
  success: 'string';
  contents: {
    quotes: [
      {
        author: 'string';
        quote: 'string';
        tags: ['string'];
        id: 'string';
        image: 'string';
        length: 0;
        date: Date,
      }
    ];
  };
}

export interface Quote {
  id?: string;
  quote: string;
  date: Date;
}
