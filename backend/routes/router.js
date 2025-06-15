import express from 'express'
import { registerBusinessman } from '../controller/signup.js'
import { loginBusinessman } from '../controller/login.js'
import { checkAuth,logout } from '../controller/logout.js'
import { getBusinessById } from '../controller/getBusinessById.js'
import { addItemToBusiness, deleteItemFromBusiness, updateItemInBusiness,getBusinessItemsPublic,releaseItems,reserveItems,getBankDetailsByBusinessName, getAllBusinessNames} from '../controller/business.js';
import { verifytoken } from '../middleware/verifytoken.js'
import { confirmOrder, getOrdersByBusinessName, getSalesDashboard, markOrderAsDispatched, updateOrderStatus } from '../controller/orderController.js'
const router =express.Router()

// login logut sigin routes
router.post('/register',registerBusinessman)
router.post('/login',loginBusinessman)
router.post('/logout',logout)
router.get('/checkauth',verifytoken,checkAuth)
router.get('/all_businesses', getAllBusinessNames);

// adding items ,removing making chnages routes
router.get('/business/:id',verifytoken,getBusinessById)
router.post('/business/:id/item', verifytoken, addItemToBusiness);
router.delete('/business/:id/item/:itemId', verifytoken, deleteItemFromBusiness);
router.put('/business/:id/item/:itemId', verifytoken, updateItemInBusiness);

// fetching the data items,carts for the people(public)
router.get('/business/people/:businessname', getBusinessItemsPublic);
router.post('/business/people/place_order/:businessName',reserveItems)
router.post('/business/people/release_items',releaseItems)
router.get('/business/bank-details/:businessName', getBankDetailsByBusinessName);

// orders
router.post("/confirm-order", confirmOrder);
router.get("/orders/business/:businessName", getOrdersByBusinessName);
router.put("/orders/:orderId/status", updateOrderStatus);
router.put("/orders/:orderId/dispatched", markOrderAsDispatched);
router.get("/orders/dashboard/:businessName", getSalesDashboard);
export default router;