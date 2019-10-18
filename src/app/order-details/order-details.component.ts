import { AlertService } from '../services/alert.service';
import { Subscription } from 'rxjs';
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
import { Users } from '../models/users.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  providers: [DatePipe]
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  isWallet = false;
  user = {
    wallet: 0
  } as Users;
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
    received: 0,
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
    walletUsed: 0,
    walletPending: 0,
    isAdvancePaid: false,
    advanceCan: 0,
    isCommissionPaid: false
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
  mywallet = 0;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private apartmentDetailsService: ApartmentDetailsService,
    private addressService: AddressService,
    private orderService: OrderService,
    private router: Router,
    private alert: AlertService,
    private afs: AngularFirestore,
    private globals: ConstantsService,
    private userService: UsersService
  ) {
    this.userService.getUserById(this.model.userId).subscribe(data => {
      if (data.length) {
        this.user = data[0].payload.doc.data() as Users;
        this.mywallet = this.user.wallet;
      }
    });
    this.products = this.productsService.getProductsById(this.route.snapshot.params.id);
    this.products.subscribe(product => {
      if (product.length) {
        this.product = product[0].payload.doc.data() as Products;
        this.model.total = (this.model.quantity * this.product.price);
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
    this.userService.setWalletAmount(this.model.userId, this.mywallet);
    this.alert.success('You have placed your successfully');
    setTimeout(() => {
      this.router.navigate(['/my-orders']);
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
          switch (promotion.type) {
            case 1:
              this.model.walletPending = 0;
              this.model.total = (this.model.quantity * (this.product.price - promotion.discount));
              break;
            case 2:
              this.model.walletPending = 0;
              this.model.total = (this.model.total - promotion.discount);
              break;
            default:
              this.model.walletPending = promotion.discount;
          }
          this.model.promotionCode = promotion.couponCode;
        }
      });
    }
    return this.model.total;
  }

  checkPromo(val) {
    this.isWallet = false;
    this.mywallet = this.user.wallet;
    this.model.total = (this.model.quantity * this.product.price);
    this.isCoupon = !val;
    if (!this.isCoupon) {
      this.model.total = (this.model.quantity * this.product.price);
      this.model.isPromotionApplied = false;
      this.model.promotionCode = '';
      this.model.walletPending = 0;
    }
  }

  applyWallet(val) {
    this.isCoupon = false;
    if (!this.isCoupon) {
      this.model.total = (this.model.quantity * this.product.price);
      this.model.isPromotionApplied = false;
      this.model.promotionCode = '';
    }
    this.isWallet = !val;
    if (this.isWallet) {
      if (this.model.total > this.mywallet) {
        this.model.total -= this.mywallet;
        this.mywallet = 0;
      } else {
        this.mywallet -= this.model.total;
        this.model.total = 0;
      }
    } else {
      this.mywallet = this.user.wallet;
      this.model.total = (this.model.quantity * this.product.price);
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
