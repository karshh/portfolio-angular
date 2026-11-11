import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject, merge, of, timer } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { WeatherObservation, WeatherService } from './services/weather.service';

export type WeatherState =
  | { status: 'loading' }
  | { status: 'ready'; observation: WeatherObservation }
  | { status: 'error' };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeComponent implements OnInit {
  link = 'home';
  clock$: Observable<string>;
  weather$: Observable<WeatherState>;
  private readonly weatherRefresh = new Subject<void>();

  constructor(private weather: WeatherService) {}

  ngOnInit() {
    this.clock$ = timer(0, 500).pipe(
      map(() => new Date().toLocaleTimeString('en-US', { timeZone: 'America/Denver' }))
    );

    this.weather$ = merge(of(undefined), timer(600000, 600000), this.weatherRefresh).pipe(
      switchMap(() => this.weather.getWeather().pipe(
        map((observation): WeatherState => ({ status: 'ready', observation })),
        catchError(() => of<WeatherState>({ status: 'error' })),
        startWith<WeatherState>({ status: 'loading' })
      ))
    );
  }

  retryWeather(): void {
    this.weatherRefresh.next();
  }
}
