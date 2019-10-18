export class Order {
    id: any;
    ref: any;
    userId: string;
    productId: string;
    quantity: number;
    return: number;
    received: number;
    isPaid: boolean;
    isDelivered: boolean;
    paymentType: string;
    total: number;
    date: any;
    isCancelled: boolean;
    isPromotionApplied: boolean;
    promotionCode: string;
    updateAt: any;
    amountReceivedBy: any;
    isAdvancePaid: boolean;
    advanceCan: number;
    isCommissionPaid: boolean;
    address: {
        id: any;
        userId: string;
        apartmentName: string;
        doorNumber: string;
        block: string;
        floor: number;
    };
}
