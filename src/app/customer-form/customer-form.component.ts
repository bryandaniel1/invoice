import { Component, OnInit } from '@angular/core';
import { NgForm, NgControl } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TdLoadingService } from '@covalent/core/loading';
import { TdDialogService } from '@covalent/core/dialogs';
import { CustomersService, Customer } from '../services';
import { map } from "rxjs/operators";

/**
 * Provides a form for adding and editing customer data.
 */
@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  customer: Customer;

  /**
   * Sets the dependencies.
   * 
   * @param loadingService the loading service
   * @param router the router
   * @param dialogService the dialog service
   * @param customersService the customers service
   * @param route the ActivatedRoute object
   */
  constructor(
    private loadingService: TdLoadingService,
    private router: Router,
    private dialogService: TdDialogService,
    private customersService: CustomersService,
    private route: ActivatedRoute) { }

  /**
   * Performed after construction to fetch customer data if it exists.
   */
  ngOnInit() {
    this.loadingService.register('customer');
    this.route.params.pipe(map((params: Params) => params.customerId)).subscribe(customerId => {
      if (customerId) {
        this.customersService.get<Customer>(customerId).subscribe(customer => {
          this.customer = customer;
          this.loadingService.resolve('customer');
        });
      } else {
        this.customer = new Customer();
        this.loadingService.resolve('customer');
      }
    });
  }

  /**
   * Saves customer data.
   */
  save() {
    if (this.customer.id) {
      this.customersService.update<Customer>(this.customer.id, this.customer).subscribe(response => {
        this.viewCustomer(response.id);
      });
    } else {
      this.customersService.create<Customer>(this.customer).subscribe(response => {
        this.viewCustomer(response.id);
      });
    }
  }

  /**
   * Deletes a customer.
   */
  delete() {
    this.dialogService.openConfirm({
      message: 'Are you sure you want to delete this customer?',
      title: 'Confirm',
      acceptButton: 'Delete'
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        this.loadingService.register('customer');
        this.customersService.delete(this.customer.id).subscribe(response => {
          this.loadingService.resolve('customer');
          this.customer.id = null;
          this.cancel();
        });
      }
    });
  }

  /**
   * Returns to the previous view without saving.
   */
  cancel() {
    if (this.customer.id) {
      this.router.navigate(['/customers', this.customer.id]);
    } else {
      this.router.navigateByUrl('/customers');
    }
  }

  /**
   * Navigates to the customer detail view.
   * 
   * @param id the customer ID
   */
  private viewCustomer(id: number) {
    this.router.navigate(['/customers', id]);
  }
}