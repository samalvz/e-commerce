import React from 'react'
import {Container, Typography, Button, Grid} from '@material-ui/core'
import {Link} from 'react-router-dom'

import useStyles from "./styles"
import CartItem from './CartItem/CartItem'

/* element for when cart icon is clicked, shows cart items, and buttons to empty cart or begin checkout*/

const Cart = ({cart, onUpdateCartQty, onRemoveFromCart, onEmptyCart}) => {
    const classes = useStyles(); // hooks

    /* Empty cart element*/
    const EmptyCart = () => (
        <Typography variant={"subtitle1"}>Your cart is empty,
            <Link to={'/e-commerce'} className={classes.link}> add something now</Link>.
        </Typography>
    )

    /* Full cart element */
    const FilledCart = () => (
        <>
            {/* Grid for products in cart */}
            <Grid container spacing={3}>
                {cart.line_items.map((item) => (
                    <Grid item xs={12} sm={4} key={item.id}>
                        <div>
                            <CartItem item={item} onUpdateCartQty={onUpdateCartQty}
                                      onRemoveFromCart={onRemoveFromCart}/>
                        </div>
                    </Grid>
                ))}
            </Grid>

            {/* Subtotal and buttons (empty cart and checkout*/}
            <div className={classes.cardDetails}>
                <Typography variant="h4">Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
                <div>
                    <Button className={classes.emptyButton} size={"large"} type={"button"} variant={"contained"}
                            color={"secondary"} onClick={() => onEmptyCart()}>
                        Empty Cart
                    </Button>
                    <Button component={Link} to={'/checkout'} className={classes.checkoutButton} size={"large"} type={"button"} variant={"contained"}
                            color={"primary"}>
                        Checkout
                    </Button>
                </div>
            </div>

        </>
    )

    if (!cart.line_items) return '...loading'     // resolves issue where cart is not loaded on render

    return (
        <Container>
            <div className={classes.toolbar}/>
            {/* gutter bottom adds padding below the typography*/}
            <Typography className={classes.title} variant={"h3"} gutterBottom>Your Shopping Cart</Typography>
            {!cart.line_items.length ? <EmptyCart/> : <FilledCart/>}
        </Container>
    )
}

export default Cart