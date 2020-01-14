import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Config } from './services/config';


@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
	constructor() { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		req = req.clone({
			headers: new HttpHeaders({ 'Origin': Config.PROXY_URL})
		});
		return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
		        if (event instanceof HttpResponse) {
		          console.info('HttpResponse::event =', event, ';');
		        } else console.info('event =', event, ';');
		      }));
		  }

	}