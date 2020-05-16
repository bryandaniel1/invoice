import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TdLoadingService } from '@covalent/core/loading';
import { InvoicesService, Invoice, CustomersService, Customer } from '../services';
import { map, switchMap } from "rxjs/operators";

/**
 * Displays a detailed invoice.
 */
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  invoice: Invoice;
  customer: Customer;

  /**
   * Sets the dependencies.
   * 
   * @param loadingService the loading service
   * @param invoicesService the invoices service
   * @param customersService the customers service
   * @param route the ActivatedRoute object
   */
  constructor(
    private loadingService: TdLoadingService,
    private invoicesService: InvoicesService,
    private customersService: CustomersService,
    private route: ActivatedRoute) { }

  /**
   * Performed after construction to fetch details for the invoice identified by the invoiceId.
   */
  ngOnInit() {
    this.loadingService.register('invoice');
    this.route.params
      .pipe(map((params: Params) => params.invoiceId))
      .pipe(switchMap(invoiceId => this.invoicesService.get<Invoice>(invoiceId)))
      .pipe(map(invoice => {
        this.invoice = invoice;
        return invoice.customerId;
      }))
      .pipe(switchMap(customerId => this.customersService.get<Customer>(customerId)))
      .subscribe(customer => {
        this.customer = customer;
        this.loadingService.resolve('invoice');
      });
  }
}