import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, merge, Observable, of, shareReplay, startWith, Subject, switchMap, timer } from 'rxjs';
import { News } from '../classes/news';

interface CalgaryNewsItem {
  title?: string;
  pubdate?: string;
  link?: string;
}

export type NewsState =
  | { status: 'loading'; news: News[] }
  | { status: 'ready'; news: News[] }
  | { status: 'error'; news: News[] };

const NEWS_ENDPOINT = 'https://data.calgary.ca/resource/3x6m-4vs7.json';
const REFRESH_INTERVAL_MS = 30 * 60 * 1000;

@Injectable()
export class NewsService {
  private readonly retry$ = new Subject<void>();

  readonly state$: Observable<NewsState> = merge(
    of(undefined),
    timer(REFRESH_INTERVAL_MS, REFRESH_INTERVAL_MS),
    this.retry$
  ).pipe(
    switchMap(() => this.getNews().pipe(
      map(news => ({ status: 'ready' as const, news })),
      catchError(() => of({ status: 'error' as const, news: [] })),
      startWith({ status: 'loading' as const, news: [] })
    )),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private readonly http: HttpClient) {}

  retry(): void {
    this.retry$.next();
  }

  private getNews(): Observable<News[]> {
    const params = new HttpParams()
      .set('$select', 'title,pubdate,link')
      .set('$where', 'pubdate is not null')
      .set('$order', 'pubdate DESC')
      .set('$limit', '11');

    return this.http.get<CalgaryNewsItem[]>(NEWS_ENDPOINT, { params }).pipe(
      map(items => items
        .map(item => this.toNews(item))
        .filter((item): item is News => item !== null)
        .sort((a, b) => b.pubdate.valueOf() - a.pubdate.valueOf())
        .slice(0, 11))
    );
  }

  private toNews(item: CalgaryNewsItem): News | null {
    if (!item.title?.trim() || !item.pubdate || !item.link) return null;

    const pubdate = new Date(item.pubdate);
    if (Number.isNaN(pubdate.valueOf())) return null;

    try {
      const link = new URL(item.link);
      if (link.protocol !== 'https:') return null;
      return new News(item.title.trim(), pubdate, link);
    } catch {
      return null;
    }
  }
}
