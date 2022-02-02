import React from 'react'
import {Typography, Button, Divider} from '@material-ui/core'
import {Elements, CardElement, ElementsConsumer} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'

import Review from './Review'

// get stripe api key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

/* element for displaying review and handling payment, it does not collect actual payment information */

const PaymentForm = ({checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout, timeout}) => {
    const handleSubmit = async (event, elements, stripe) => {
        event.preventDefault()

        //  ensures stripe and elements are available else stripe will not continue
        if (!stripe || !elements) return

        // get card element
        const cardElement = elements.getElement(CardElement)

        // use stripe api to create a payment method from available cardElement
        const {error, paymentMethod} = await stripe.createPaymentMethod({type: 'card', card: cardElement})

        if (error) {
            console.log('[error]', error)
        } else {
            // object which holds ALL cart and customer information that has been gathered thus far and sends to commerceJS
            const orderData = {
                line_items: checkoutToken.live.line_items,
                customer: {
                    firstName: shippingData.firstName,
                    lastName: shippingData.lastName,
                    email: shippingData.email
                },
                shipping: {
                    name: 'International',
                    street: shippingData.address1,
                    town_city: shippingData.city,
                    county_state: shippingData.shippingSubdivision,
                    postal_zip_code: shippingData.zip,
                    country: shippingData.shippingCountry,
                },
                fulfillment: {shipping_method: shippingData.shippingOption},
                payment: {
                    gateway: 'stripe',
                    stripe: {
                        payment_method_id: paymentMethod.id
                    }
                }
            }
            onCaptureCheckout(checkoutToken.id, orderData)
            timeout()    // calls timeout function as no real credit card is being used
            nextStep()
        }
    }
    return (
        <>
            <Review checkoutToken={checkoutToken}/>
            <Divider/>
            <Typography variant={'h6'} gutterBottom style={{margin: '20px 0'}}>Payment Method</Typography>

            {/*below is stripe stuff funny syntax*/}
            <Elements stripe={stripePromise}>
                <ElementsConsumer>
                    {({elements, stripe}) => (
                        <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                            <CardElement/>
                            <br/><br/>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Button variant={'outlined'} onClick={backStep}>Back</Button>
                                <Button type={'submit'} variant={'contained'} disabled={!stripe} color={'primary'}>
                                    Pay {checkoutToken.live.subtotal.formatted_with_symbol}
                                </Button>
                            </div>
                        </form>
                    )}
                </ElementsConsumer>
            </Elements>
        </>
    )
}

export default PaymentForm