import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core/loading';
import { CustomersService, Customer } from '../services';

/**
 * Displays the list of customers.
 */
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[];

  /**
   * Initializes the dependencies.
   * 
   * @param loadingService the loading service
   * @param customersService the customers service
   */
  constructor(private loadingService: TdLoadingService, private customersService: CustomersService) { }

  /**
   * Performed after construction to fetch the list of customers to display.
   */
  ngOnInit() {
    this.loadingService.register('customers');
    this.customersService.query<Array<Customer>>({sort: 'created', order: 'desc'})
      .subscribe(customers => {
        this.customers = customers;
        this.loadingService.resolve('customers');
      });
  }
}