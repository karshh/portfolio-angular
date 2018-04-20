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
			headers: new HttpHeaders({ 'Origin': 'https://usharma.ca'})
		});
		return next.handle(req)
		      .map((event: HttpEvent<any>) => {
		        if (event instanceof HttpResponse) {
		          console.info('HttpResponse::event =', event, ';');
		        } else console.info('event =', event, ';');
		        return event;
		      });
		  }

	}