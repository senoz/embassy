import { AlertService } from '../services/alert.service';
import { Observable, Subscription } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { OnDestroy, Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Products } from '../models/products.model';
import { ApartmentDetailsService } from '../services/apartment-details.service';
import { ApartmentDetails } from '../models/apartment-details.model';
import { AddressService } from '../services/address.service';
import { Address } from '../models/address.model';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';
import { DatePipe } from '@angular/common';
import { ConstantsService } from '../services/constants.service';
import { Coupon } from '../models/coupon.model';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  providers: [DatePipe]
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  product = {
    name: '',
    description: '',
    url: '',
    price: 0
  } as Products;
  invalidCoupon: boolean;
  isCouponApplied: boolean;
  gpayNumber;
  isCoupon = false;
  addresses: Address;
  products$: AngularFirestoreCollection<Products>;
  private subscription: Subscription;
  myDate = new Date();
  model: any = {
    userId: localStorage.getItem('userId'),
    quantity: 1,
    return: 0,
    address: {
      apartmentName: 'Embassy Residency',
      doorNumber: '',
      block: '',
      floor: '',
    },
    productId: '',
    isPaid: false,
    isDelivered: false,
    paymentType: 'cod',
    total: 30,
    isCancelled: false,
    isPromotionApplied: false,
    promotionCode: ''
  };

  productId: string;
  apartment: any = [];
  aprtBlocks: any;
  aprtFloors: any;
  userAddress: any;
  showAddress = false;
  addressRef: any;
  showOrders = true;
  orders: any;
  orderRef: any;
  products: any;
  orderId: string;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private apartmentDetailsService: ApartmentDetailsService,
    private addressService: AddressService,
    private orderService: OrderService,
    private router: Router,
    private alert: AlertService,
    private afs: AngularFirestore,
    private datePipe: DatePipe,
    private globals: ConstantsService
  ) {
    this.products = this.productsService.getProductsById(this.route.snapshot.params.id);
    this.products.subscribe(product => {
      if (product.length) {
        this.product = product[0].payload.doc.data() as Products;
      }
    });
   }

  ngOnInit() {
    this.getApartmentDetails();
    this.getCurrentUserAddress();
    this.gpayNumber = this.globals.gpayNumber;
  }

  onSubmit() {
    const address = this.model.address;
    address.userId = localStorage.getItem('userId');
    if (!this.addresses) {
      this.addAddress(address);
    } else {
      this.updateAddress(address);
    }
    this.orderService.newOrder(this.model);

    this.alert.success('You have placed your successfully');
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }

  editAdddress() {
    this.model.address = this.addresses;
    this.blockChange(this.model.address.block);
    this.showAddress = true;
  }

  updateAddress(address: Address) {
    return this.addressRef.update(address);
  }

  addAddress(address: Address) {
    return this.addressService.addAddress(address);
  }

  hideAddress() {
    this.showAddress = false;
  }

  changePayment(value) {
    this.model.paymentType = value;
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
    this.isCouponApplied = true;
    if (promo) {
      this.orderService.checkValidPromotion(promo).subscribe(coupon => {
        if (!coupon.length) {
          this.invalidCoupon = true;
          setTimeout(() => {
            this.invalidCoupon = false;
            this.model.promotionCode = '';
          }, 2000);
        } else {
          this.invalidCoupon = false;
          this.model.isPromotionApplied = true;
          const promotion = coupon[0].payload.doc.data() as Coupon;
          this.model.total = (this.model.quantity * (this.product.price - promotion.discount));
          this.model.promotionCode = promotion.couponCode;
        }
      });
    }
  }

  checkPromo(val) {
    this.isCoupon = !val;
    if (!this.isCoupon) {
      this.model.total = (this.model.quantity * this.product.price);
      this.model.isPromotionApplied = false;
    }
  }

  manageQuantity(type) {
    if (type) {
      this.model.quantity++;
    } else {
      this.model.quantity--;
    }
    this.model.total = (this.model.quantity * this.product.price);
  }

  manageReturn(type) {
    if (type) {
      this.model.return++;
    } else {
      this.model.return--;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
