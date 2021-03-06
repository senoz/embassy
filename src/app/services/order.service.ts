import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  order$: any;

  constructor(private firestore: AngularFirestore) {
    this.order$ = this.firestore.collection('orderDetails');
  }

  getOrders() {
    return this.order$.snapshotChanges();
  }

  getUnDeliveredOrders() {
    return this.firestore.collection('orderDetails',
      ref => ref.where('isDelivered', '==', false)
        .where('isCancelled', '==', false)
        .orderBy('date', 'desc'))
      .snapshotChanges();
  }

  getPendingAmountOrders() {
    return this.firestore.collection('orderDetails',
      ref => ref.where('isDelivered', '==', true)
        .where('isPaid', '==', false)
        .orderBy('date', 'desc'))
      .snapshotChanges();
  }

  getDeliveredOrders() {
    return this.firestore.collection('orderDetails',
      ref => ref.where('isDelivered', '==', true)
        .orderBy('date', 'desc'))
      .snapshotChanges();
  }

  getAdvancePaidOrders() {
    return this.firestore.collection('orderDetails',
      ref => ref.where('isAdvancePaid', '==', true))
      .snapshotChanges();
  }

  getPendingOrdersByUserId(id) {
    return this.firestore.collection('orderDetails',
      ref => ref.where('userId', '==', id)
        .where('isDelivered', '==', false)
        .where('isCancelled', '==', false)
        .orderBy('date', 'desc'))
      .snapshotChanges();
  }

  getOrderById(id) {
    return this.firestore.collection('orderDetails',
      ref => ref.where(firebase.firestore.FieldPath.documentId(), '==', id).limit(1))
      .snapshotChanges();
  }

  getOrdersByUserId(id) {
    return this.firestore.collection('orderDetails',
      ref => ref.where('userId', '==', id)
        .orderBy('date', 'desc'))
      .snapshotChanges();
  }

  getDeliveredNotCancelledOrdersByUserId(id) {
    return this.firestore.collection('orderDetails',
      ref => ref.where('userId', '==', id)
        .where('isDelivered', '==', true)
        .where('isCancelled', '==', false)
        .orderBy('date', 'desc'))
      .snapshotChanges();
  }

  isOrderExists(userId) {
    return this.firestore.collection('orderDetails',
      ref => ref.where('userId', '==', userId)
        .where('isDelivered', '==', true)
    ).snapshotChanges();
  }

  isAddressExists(address) {
    return this.firestore.collection('orderDetails',
      ref => ref.where('address.apartmentName', '==', address.apartmentName)
        .where('address.block', '==', address.block)
        .where('address.doorNumber', '==', address.doorNumber)
    ).snapshotChanges();
  }

  getOrdersByProductId(id) {
    return this.firestore.collection('orderDetails',
      ref => ref.where('productId', '==', id)
        .where('isCancelled', '==', false)
        .where('isDelivered', '==', false))
      .snapshotChanges();
  }

  newOrder(order: Order) {
    order.date = firebase.firestore.FieldValue.serverTimestamp();
    return this.order$.add(order);
  }

  cancelOrder(orderId) {
    return this.order$
      .doc(orderId)
      .set({ isCancelled: true }, { merge: true });
  }

  setPaidUser(userId) {
    this.firestore.collection('orderDetails',
      ref => ref.where('userId', '==', userId)
        .where('isPaid', '==', false)
        .where('isDelivered', '==', true))
      .get().toPromise().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const OrderRef = this.firestore.collection('orderDetails').doc(doc.id);
          OrderRef.set({ isPaid: true, amountReceivedBy: localStorage.getItem('adminUser') }, { merge: true });
        });
      });
  }

  getReceivedCanUser(userId) {
    return this.firestore.collection('orderDetails',
      ref => ref.where('userId', '==', userId)
        .where('isDelivered', '==', true)
        .orderBy('date', 'desc')
        .limit(1)).snapshotChanges();
  }

  setReceivedCanUser(id, ReturnItem) {
    return this.firestore.collection('orderDetails').doc(id)
      .set({ return: ReturnItem }, { merge: true });
  }

  deliverOrder(order) {
    const updateDate = firebase.firestore.FieldValue.serverTimestamp();
    const amountReceivedUser = (order.isPaid) ? order.amountReceivedBy : '';
    return this.order$
      .doc(order.id)
      .set({
        isDelivered: true,
        quantity: order.quantity,
        return: order.return,
        isPaid: order.isPaid,
        isAdvancePaid: order.isAdvancePaid,
        advanceCan: order.advanceCan,
        amountReceivedBy: amountReceivedUser,
        updateAt: updateDate
      }, { merge: true });
  }

  checkValidPromotion(promo) {
    return this.firestore.collection('promotion',
      ref => ref.where('couponCode', '==', promo)
        .where('isActive', '==', true)
        .limit(1))
      .snapshotChanges();
  }

  getPromoCode() {
    return this.firestore.collection('promotion',
      ref => ref.where('isActive', '==', true)
        .limit(1))
      .snapshotChanges();
  }

  getCommissionAmount() {
    return this.firestore.collection('commission').snapshotChanges();
  }

  getCommissionNotPaidOrders() {
    return this.firestore.collection('orderDetails',
      ref => ref.where('isCommissionPaid', '==', false)
        .where('isDelivered', '==', true)
        .where('isPaid', '==', true)).snapshotChanges();
  }

  settleCommission() {
    this.firestore.collection('orderDetails',
      ref => ref.where('isCommissionPaid', '==', false)
        .where('isDelivered', '==', true)
        .where('isPaid', '==', true))
      .get().toPromise().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const OrderRef = this.firestore.collection('orderDetails').doc(doc.id);
          OrderRef.set({ isCommissionPaid: true }, { merge: true });
        });
      });
  }
}
