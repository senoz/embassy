export class Order {
    id: any;
    userId: string;
    productId: string;
    isPaid: boolean;
    isDelivered: boolean;
    paymentType: string;
    total: number;
    date: string;
    address: {
        id: any;
        userId: string;
        apartmentName: string;
        doorNumber: string;
        block: string;
        floor: number;
    };
}
