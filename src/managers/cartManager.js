import { error } from "console";
import fs from "fs";
import { ProductManager } from "./productManager.js";

export class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const cartsJSON = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(cartsJSON);
            } else {
                return [];
            }
        } catch (error) {
            console.log('Error al obtener carritos', error);
        }
    }

    async createCart() {
        try {
            const cartsFile = await this.getCarts();
            const maxCartId = Math.max(...cartsFile.map(cart => cart.id));
            const newCartId = maxCartId + 1;
            const cart = {
                id: newCartId,
                products: [],
            };
            cartsFile.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
            return cart;
        } catch (error) {
            console.log(error);
        }
    }

    async getCartById(id) {
        try {
            id = parseInt(id);
            const carts = await this.getCarts();
            const cart = carts.find((c) => c.id === id);
            return cart || null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async getCartIdInJson(id){
        try{
            id = parseInt(id);
            const carts = await this.getCarts();
            const cartId = carts.findIndex((c) => c.id === id);
            return cartId || null;
        } catch (error){
            return error;
        }
    }

    async saveProductToCart(idCart, idProd) {
        idProd = parseInt(idProd);
        const carts = await this.getCarts();
        const cartId = await this.getCartIdInJson(idCart);
        const productManager = new ProductManager('./src/data/products.json');
        const products = await productManager.getProductById(idProd);
        console.log('a ver: ', cartId, products);

        if (cartId && products) {
            const cartProduct = carts[cartId].products.find((p) => p.product === idProd);

            if (cartProduct) {
                cartProduct.quantity += 1;
            } else {
                const prod = {
                    product: idProd,
                    quantity: 1
                };

                carts[cartId].products.push(prod);
            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return carts[cartId];
        } else {
            return false
        }
    }
}