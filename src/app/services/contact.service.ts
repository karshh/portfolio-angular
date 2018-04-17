import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contact } from '../classes/contact';
import { Config } from './config';

enum MessageStatus { AVAILABLE, SENDING, SUCCESS, FAILURE };

@Injectable()
export class ContactService {

	status: MessageStatus;
  
  constructor(private http: HttpClient) {
  	this.status = MessageStatus.AVAILABLE;
  }


	sendEmail(contact: Contact): void {
  	this.status = MessageStatus.SENDING;
  	console.log('Sending message: ' + contact._subject);
  	
  	this.http.post(this.buildURL(), {
  		_replyto: contact._replyto,
  		name: contact.name,
  		_subject: contact._subject,
  		message: contact.message,
  		_honeypot: contact._honeypot
  	}).subscribe(() => {

  		console.log('Sent message: ' + contact._subject);
  		this.status = MessageStatus.SUCCESS;
  	}, (err) => {

  		console.log('Failed to send message: ' + contact._subject);
  		console.log(err);
  		this.status = MessageStatus.FAILURE;
  	})


  }

	isAvailable():boolean {
		return this.status == MessageStatus.AVAILABLE;
	}

	isSuccess():boolean {
		return this.status == MessageStatus.SUCCESS;	
	}

	isFailure():boolean {
		return this.status == MessageStatus.FAILURE;	
	}

	isBusy():boolean {
		return this.status == MessageStatus.SENDING;
	}

	resetStatus(): boolean {
		if (this.isBusy()) return false;
		this.status = MessageStatus.AVAILABLE;
		return true;
	}

  private buildURL():string {
  	return 'https://mailthis.to/' + Config.MAILTO_ID;
  }

}
