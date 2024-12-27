export interface IPayment {
    bank: string,
    accountNumber: string,
    amount: number,
    date: Date,
}

export interface IOrderedItem{
    id: string,
    quantity: number,
    sellingPrice: number,
}

export interface ISales {
    merchant: string,
    orderdItems: IOrderedItem[],
    payments: IPayment[],
}
