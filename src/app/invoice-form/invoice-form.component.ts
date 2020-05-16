import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoicesService, Invoice, CustomersService, Customer } from '../services';
import { combineLatest } from 'rxjs';
import { map } from "rxjs/operators";
import { HoursValidator } from '../validators/hours.validator';

/**
 * Provides a form for adding and editing invoice data.
 */
@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;
  invoice: Invoice;
  customer: Customer;
  customers: Customer[];
  total = 0;

  /**
   * Sets the dependencies and builds the invoice form.
   * 
   * @param loadingService the loading service
   * @param invoicesService the invoices service
   * @param router the router
   * @param dialogService the dialog service
   * @param customersService the customers service
   * @param formBuilder the FormBuilder object
   * @param route the ActivatedRoute object
   */
  constructor(
    private loadingService: TdLoadingService,
    private invoicesService: InvoicesService,
    private router: Router,
    private dialogService: TdDialogService,
    private customersService: CustomersService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) {

    this.invoiceForm = this.formBuilder.group({
      id: [''],
      service: ['', Validators.required],
      customerId: ['', Validators.required],
      rate: ['', Validators.required],
      hours: ['', [Validators.required, HoursValidator]],
      date: ['', Validators.required],
      paid: ['']
    });

  }

  /**
   * Performed after construction to collect customer and invoice data.
   */
  ngOnInit() {
    this.loadingService.register('invoice');
    this.loadingService.register('customers');

    this.customersService.query<Array<Customer>>().subscribe(customers => {
      this.customers = customers;
      this.loadingService.resolve('customers');
    });

    this.route.params.pipe(map((params: Params) => params.invoiceId)).subscribe(invoiceId => {
      if (invoiceId) {
        this.invoicesService.get<Invoice>(invoiceId).subscribe(invoice => {
          this.invoiceForm.setValue(invoice);
          this.invoice = invoice;
          this.loadingService.resolve('invoice');
        });
      } else {
        this.invoice = new Invoice();
        this.loadingService.resolve('invoice');
      }
    });

    combineLatest(
      this.invoiceForm.get('rate').valueChanges,
      this.invoiceForm.get('hours').valueChanges
    ).subscribe(([rate = 0, hours = 0]) => {
      this.total = rate * hours;
    });
  }

  /**
   * Saves the invoice data.
   */
  save() {
    if (this.invoice.id) {
      this.invoicesService.update<Invoice>(this.invoice.id, this.invoiceForm.value).subscribe(response => {
        this.viewInvoice(response.id);
      });
    } else {
      this.invoicesService.create<Invoice>(this.invoiceForm.value).subscribe(response => {
        this.viewInvoice(response.id);
      });
    }
  }

  /**
   * Deletes the invoice after confirmation.
   */
  delete() {
    this.dialogService.openConfirm({
      message: 'Are you sure you want to delete this invoice?',
      title: 'Confirm',
      acceptButton: 'Delete'
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.loadingService.register('invoice');
        this.invoicesService.delete(this.invoice.id).subscribe(response => {
          this.loadingService.resolve('invoice');
          this.invoice.id = null;
          this.cancel();
        });
      }
    });
  }

  /**
   * Returns to the previous view without saving.
   */
  cancel() {
    if (this.invoice.id) {
      this.router.navigate(['/invoices', this.invoice.id]);
    } else {
      this.router.navigateByUrl('/invoices');
    }
  }

  /**
   * Navigates to the invoice detail view.
   * 
   * @param id the invoice ID
   */
  private viewInvoice(id: number) {
    this.router.navigate(['/invoices', id]);
  }

}