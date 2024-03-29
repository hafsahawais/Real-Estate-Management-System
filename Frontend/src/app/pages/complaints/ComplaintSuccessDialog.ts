import {Component} from '@angular/core';

@Component({
  selector: 'complaint-success-dialog',
  template: `
    <h1 mat-dialog-title>Success</h1>
  <div mat-dialog-content>Complaint Submitted Successfully.</div>
  <div mat-dialog-actions>
    <button mat-button mat-dialog-close>Close</button>
  </div>
  `,
})
export class ComplaintSuccessDialog {}
