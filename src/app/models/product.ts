export class Product {
    id: number;
    total_price: number;
    name: string
    slug:string
    description: string;
    shipping_info:string;
    price:number;
    available: boolean
    created: Date;
    updated: Date;
    isPremium: boolean
    color: string
    bestseller: boolean;
    is_approved: boolean;
    sold_quantity: number;
    discount_state: false;
    discount_price: number;
    discount_start_date: Date;
    discount_finish_date: Date;
    category: number;
    types: number;
    classes: number;
    firm: number;
    sizes: number[]
    images:number[]
}