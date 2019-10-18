import {ViewChild, Component,  OnInit} from '@angular/core';
import { OrderService } from '../services/order.service';
import { Subscription } from 'rxjs';
import { Order } from '../models/order.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AddressService } from '../services/address.service';
import { Address } from '../models/address.model';
import { ApartmentDetailsService } from '../services/apartment-details.service';
import { ApartmentDetails } from '../models/apartment-details.model';
import { ProductsService } from '../services/products.service';
import { Products } from '../models/products.model';
import { ConstantsService } from '../services/constants.service';
import { Coupon } from '../models/coupon.model';
import { GenericService } from '../services/generic.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css'],
})
export class EditOrderComponent implements OnInit {
  products: any;
  private subscription: Subscription;
  orders: any;
  orderRef: firebase.firestore.DocumentReference;
  orderId: string;
  addresses: any;
  addressRef: any;
  showAddress: boolean;

  apartment: any[];
  aprtBlocks: any[];
  aprtFloors: number[];
  product = {
    name: '',
    description: '',
    url: '',
    price: 0
  } as Products;
  model: any = {
    userId: localStorage.getItem('userId'),
    quantity: 1,
    return: 0,
    address: {
      apartmentName: this.globals.defaultApartment,
      doorNumber: '',
      block: '',
      floor: '',
    },
    productId: this.route.snapshot.params.id,
    isPaid: false,
    isDelivered: false,
    paymentType: 'cod',
    total: this.product.price,
    isCancelled: false,
    isPromotionApplied: false,
    promotionCode: '',
    isAdvancePaid: false,
    advanceCan: 0,
    isCommissionPaid: false
  };
  gpayNumber: number;
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private productsService: ProductsService,
    private addressService: AddressService,
    private apartmentDetailsService: ApartmentDetailsService,
    private router: Router,
    private globals: ConstantsService,
    private genericService: GenericService
  ) { }

  ngOnInit() {
    this.orderId = this.route.snapshot.params.id;
    this.getOrderDetails(this.orderId);
    this.getCurrentUserAddress();
    this.gpayNumber = this.globals.gpayNumber;
  }

  onSubmit() {
    const address = this.model.address;
    this.updateAddress(address);
    this.updateOrder(this.model);
    this.alert.success('Your order has updated successfully');
    setTimeout(() => {
      this.router.navigate(['/my-orders']);
    }, 2000);
  }

  editAdddress() {
    this.model.address = this.addresses;
    this.blockChange(this.model.address.block);
    this.showAddress = true;
  }

  hideAddress() {
    this.showAddress = false;
  }

  changePayment(value) {
    this.model.paymentType = value;
  }

  getOrderDetails(orderId) {
    this.subscription = this.orderService.getOrderById(orderId)
    .subscribe(order => {
      if (order.length) {
        this.model = order[0].payload.doc.data() as Order;
        this.model.isAdvancePaid = false;
        this.model.advanceCan = 0;
        this.model.isCommissionPaid = false;
        this.orderRef = order[0].payload.doc.ref;
        this.orderId = order[0].payload.doc.id;
        this.products = this.productsService.getProductsById(this.model.productId);
        this.products.subscribe(product => {
          if (product.length) {
            this.product = product[0].payload.doc.data() as Products;
          }
        });
        // this.genericService.getProductById(this.model.productId, this.productsService.product);
        this.getApartmentDetails();
      }
    });
  }

  updateOrder(order: Order) {
    return this.orderRef.update(order);
  }

  updateAddress(address: Address) {
    return this.addressRef.update(address);
  }

  getCurrentUserAddress() {
    const userId = localStorage.getItem('userId');
    this.subscription = this.addressService.getAddresses(userId).subscribe(data => {
      if (data.length) {
        this.addresses = data[0].payload.doc.data() as Address;
        this.addressRef = data[0].payload.doc.ref;
      }
      if (!this.addresses) {
        this.showAddress = true;
      } else {
        this.model.address = this.addresses;
        this.showAddress = false;
      }
    });
  }

  getApartmentDetails() {
    this.apartmentDetailsService.getApartmentDetails().subscribe(aprt => {
      this.apartment = aprt.map(a => {
        const data = a.payload.doc.data() as ApartmentDetails;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
      this.apartmentChange(this.model.address.apartmentName);
    });
  }

  apartmentChange(value) {
    if (!value) {
      return;
    }
    this.aprtBlocks = this.apartment.filter(x => x.name === value);
    return true;
  }

  blockChange(value) {
    if (!value) {
      return;
    }
    const floorArray = this.aprtBlocks.filter(x => x.block === value);
    this.aprtFloors = Array.from(Array(floorArray[0].floor + 1).keys());
    this.aprtFloors.shift();
    return true;
  }

  applyCoupon(promo) {
    if (promo) {
      this.orderService.checkValidPromotion(promo).subscribe(coupon => {
        if (coupon.length) {
          const promotion = coupon[0].payload.doc.data() as Coupon;
          if (promotion.type === 1) {
            this.model.total = (this.model.quantity * (this.product.price - promotion.discount));
          } else if (promotion.type === 2) {
            this.model.total = (this.model.total - promotion.discount);
          }
        }
      });
    }
    return this.model.total;
  }

  manageQuantity(type) {
    if (type) {
      this.model.quantity++;
    } else {
      this.model.quantity--;
    }
    // this.model.total = (this.model.quantity * this.product.price);
    if (this.model.promotionCode) {
      this.model.total = this.applyCoupon(this.model.promotionCode);
    } else {
      this.model.total = (this.model.quantity * this.product.price);
    }
  }
}
