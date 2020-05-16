import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TdLoadingService } from '@covalent/core/loading';
import { CustomersService, Customer } from '../services';
import { map, switchMap } from "rxjs/operators";

/**
 * Displays details of a customer.
 */
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer: Customer;

  /**
   * Sets the dependencies.
   * 
   * @param customersService the customer service
   * @param loadingService the loading service
   * @param route the ActivatedRoute object
   */
  constructor(
    private customersService: CustomersService,
    private loadingService: TdLoadingService,
    private route: ActivatedRoute) { }

  /**
   * Performed after construction to fetch details for the customer identified by the customerId.
   */
  ngOnInit() {
    this.loadingService.register('customer');
    this.route.params
      .pipe(map((params: Params) => params.customerId))
      .pipe(switchMap(customerId => this.customersService.get<Customer>(customerId)))
      .subscribe(customer => {
        this.customer = customer;
        this.loadingService.resolve('customer');
      });
  }
}