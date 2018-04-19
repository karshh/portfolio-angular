import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
	constructor() { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		console.log("intercepted request ... ");
		req = req.clone({
			withCredentials: true
		});
		return next.handle(req)
		      .map((event: HttpEvent<any>) => {
		        if (event instanceof HttpResponse) {
		          event = event.clone({
		          	headers: new HttpHeaders({
		          		'Access-Control-Allow-Origin': 'http://localhost:4200'
		          	})
		          });
		          console.info('HttpResponse::event =', event, ';');
		        } else console.info('event =', event, ';');
		        return event;
		      });
		  }

	}