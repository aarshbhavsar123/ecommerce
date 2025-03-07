    import { connect } from "@/dbConfig/dbConfig";
    import Product from "@/models/productModel";
    import { NextRequest, NextResponse } from "next/server";
    import { prisma } from "@/dbConfig/dbConfig";
    import Cart from "@/models/cartSchema";
    

    connect();

    async function createOrder1(userId: string, address: string, products: any[],quantity:number) {
        const order = await prisma.order.create({
            data: {
                user_id: userId,
                address: address,
                items: {
                    create: products.map((product: any) => ({
                        product_id: product.product._id, 
                        quantity:quantity
                    }))
                }
            },
            include: { items: true }
        });

        // console.log("Order Created:", order);
        

        return order;
    }
    async function createOrder2(userId: string, address: string, products: any[]) {
        const order = await prisma.order.create({
            data: {
                user_id: userId,
                address: address,
                items: {
                    create: products.map((product: any) => ({
                        product_id: product.product._id, 
                        quantity:product.quantity
                    }))
                }
            },
            include: { items: true }
        });

        // console.log("Order Created:", order);
        

        return order;
    }
    export async function POST(request: NextRequest) {
        try {
            var { userId, address, cart, quantity } = await request.json();
            
            if(quantity)
            {
                await createOrder1(userId, address, cart, parseInt(quantity,10));
            }
            else if(!quantity)
            {
                // console.log(cart);
                await createOrder2(userId,address,cart);
                await Cart.findOneAndUpdate(
                    { owner_id: userId },
                    { $set: { products: [] } },
                );
            }
            return NextResponse.json({ message: "Success" });
        } 
        catch (e: any) 
        {
            console.log(e.message);
            return NextResponse.json({ message: "Error" }, { status: 400 });
        }
    }
