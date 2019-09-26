export class Order {
    id: any;
    userId: string;
    productId: string;
    quantity: number;
    return: number;
    isPaid: boolean;
    isDelivered: boolean;
    paymentType: string;
    total: number;
    date: any;
    isCancelled: boolean;
    isPromotionApplied: boolean;
    promotionCode: string;
    address: {
        id: any;
        userId: string;
        apartmentName: string;
        doorNumber: string;
        block: string;
        floor: number;
    };
}
