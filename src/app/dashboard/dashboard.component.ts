import {Subscription} from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Products } from '../models/products.model';
import { AngularFirestoreCollection } from '@angular/fire/firestore';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnDestroy {
  products: AngularFirestoreCollection<Products>;
  private subscription: Subscription;
  constructor(
    private productsServices: ProductsService
  ) {
    this.subscription = this.productsServices.getProducts().subscribe(data => {
      this.products = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Products;
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
