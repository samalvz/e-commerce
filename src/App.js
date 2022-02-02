import React, {useState, useEffect} from 'react';
import {commerce} from './lib/commerce'
import {Products, Navbar, Cart, Checkout} from './components'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


const App = () => {
    /* commerce.js provides simple response calls to return backend information
    there is no need to write these functions as the API provides it */
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState({})
    const [order, setOrder] = useState({})
    const [errorMessage, setErrorMessage] = useState('')

    /* fetches list of current products from Commerce.js */
    const fetchProducts = async () => {
        const {data} = await commerce.products.list();
        setProducts(data)
        // console.log("fetchProducts")
    }

    /* retrieves the current cart from Commerce.js  */
    const fetchCart = async () => {
        //const cart = await commerce.cart.retrieve();
        //setCart(cart)
        setCart(await commerce.cart.retrieve())
    }

    /* handles when a product is added to the cart */
    const handleAddToCart = async (productID, quantity) => {
        const item = await commerce.cart.add(productID, quantity)
        setCart(item.cart)
        // console.log("handleAddToCart")
    }

    /* handle button for updating item quantity */
    const handleUpdateCartQty = async (productID, quantity) => {
        const {cart} = await commerce.cart.update(productID, {quantity})
        setCart(cart)
        // console.log("handleUpdateCartQty")
    }

    /* handle button for removing an item from cart */
    const handleRemoveFromCart = async (productID) => {
        const {cart} = await commerce.cart.remove(productID)
        setCart(cart)
        // console.log(' handleRemoveFromCart')
    }

    /* handle button for emptying cart */
    const handleEmptyCart = async () => {
        const {cart} = await commerce.cart.empty()
        setCart(cart)
        //console.log("handleEmptyCart")
    }

    /* refresh and empty cart after a successful order */
    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
        setCart(newCart);
    };

    /* handle when an order is completed by customer (PAY is clicked)*/
    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            console.log("trying...")
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
            setOrder(incomingOrder);
            refreshCart()
        } catch (error) {
            // console.log("error capturing checkout ")
            setErrorMessage(error.data.error.message)
            console.log(errorMessage)
            refreshCart()
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    // debug cart todo
    //console.log(cart)

    return (
        <Router>
            <div>
                <Navbar cartItemCount={cart.total_items}/>
                <Routes>

                    {/*Default page with products, this is the home route*/}
                    <Route path={"/e-commerce"} element={<Products products={products} onAddToCart={handleAddToCart}/>}/>


                    {/*Route for the cart component, on its own page*/}
                    <Route path={"/cart"} element={
                        <Cart
                            cart={cart}
                            onUpdateCartQty={handleUpdateCartQty}
                            onRemoveFromCart={handleRemoveFromCart}
                            onEmptyCart={handleEmptyCart}
                        />}/>

                    {/*Route for checkout form*/}
                    <Route path={"/checkout"} element={
                        <Checkout
                            cart={cart}
                            order={order}
                            onCaptureCheckout={handleCaptureCheckout}
                            error={errorMessage}
                        />}
                    />

                </Routes>
            </div>
        </Router>
    )
}

export default App