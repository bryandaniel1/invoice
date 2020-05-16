import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { InvoicesService, Invoice } from '../services';

/**
 * Displays the list of recent invoices.
 */
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[];

  /**
   * Initializes the dependencies.
   * 
   * @param loadingService the loading service
   * @param invoicesService the invoices service
   */
  constructor(private loadingService: TdLoadingService, private invoicesService: InvoicesService) { }

  /**
   * Performed after construction to fetch the list of invoices to display.
   */
  ngOnInit() {
    this.loadingService.register('invoices');
    this.invoicesService.query<Array<Invoice>>({ sort: 'created', order: 'desc' })
      .subscribe(invoices => {
        this.invoices = invoices;
        this.loadingService.resolve('invoices');
      });
  }
}