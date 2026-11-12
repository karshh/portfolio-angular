import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../portfolio/classes/contact';

enum MessageStatus { AVAILABLE, SENDING, SUCCESS, FAILURE };

@Injectable()
export class ContactService {

	status: MessageStatus;
  
  constructor(private http: HttpClient) {
  	this.status = MessageStatus.AVAILABLE;
  }


  sendEmail(contact: Contact): void  {
    this.status = MessageStatus.SENDING;
    this.http.post('/api/contact', contact).subscribe({
      next: () => this.status = MessageStatus.SUCCESS,
      error: () => this.status = MessageStatus.FAILURE
    });
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

  getConfig() {
    return this.http.get<{ turnstileSiteKey: string }>('/api/contact/config');
  }
}
