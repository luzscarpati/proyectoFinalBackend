import { Router } from "express";
import ProductManager from "../managers/product.manager.js";

const router = Router();
const productManager = new ProductManager('./src/data/products.json')


router.get('/', async (req, res)=>{
    try {
        const products = await productManager.getProducts();
        res.render('home', {products});
    }catch (error) {
        res.status(500).json({error: 'No se pudo obtener la lista de productos'});
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        res.render('realTimeProducts');
    } catch (error) {
        res.status(500).json({ error: 'No se pudo obtener la lista de productos' });
    }
});


export default router;