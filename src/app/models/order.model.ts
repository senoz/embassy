export class Order {
    id: any;
    userId: string;
    productId: string;
    isPaid: boolean;
    isDelivered: boolean;
    paymentType: string;
    total: number;
    address: {
        id: any;
        userId: string;
        apartmentName: string;
        doorNumber: string;
        block: string;
        floor: number;
    };
}
