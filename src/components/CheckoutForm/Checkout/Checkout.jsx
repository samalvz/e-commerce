import React, {useState, useEffect} from 'react'
import {
    Paper,
    Stepper,
    Step,
    StepLabel,
    Typography,
    CircularProgress,
    Divider,
    Button,
    CssBaseline
} from '@material-ui/core'
import {Link, useNavigate} from 'react-router-dom'

import {commerce} from '../../../lib/commerce'
import useStyles from './styles'
import AddressForm from '../AddForm'
import PaymentForm from '../PaymentFrom'

// steps of checkout process
const steps = ['Shipping address', 'Payment details'];

/* element to handle checkout*/

const Checkout = ({cart, order, onCaptureCheckout, error}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null)
    const [shippingData, setShippingData] = useState({})
    const [timeoutFinished, setTimeoutFinished] = useState(false) // debug tool
    const navigate = useNavigate()

    const classes = useStyles()  // allows for styling through styles.js

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'})
                // console.log(token)
                setCheckoutToken(token)
            } catch (error) {
                // useHistory hook (now useNaviage)
                //navigate('/')
            }
        }
        generateToken()
    }, [cart])

    // moves payment page one step forwards
    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)
    // moves payment page one step back
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

    // next button for shipping page (moves ahead 1 step)
    const next = (data) => {
        // sets shipping data
        setShippingData(data)
        nextStep()
    }

    /* debug tool as no real credit card is being used to purchase */
    const timeout = () => {
        setTimeout(() => {
            setTimeoutFinished(true)
        }, 1500)
    }

    // confirmation element for a successful order
    let Confirmation = () => order.customer ? (
        // useless as real customer data will not be used
        /*<>
            <div>
                <Typography variant={'h5'}>Successful Purchase! Thank you, {order.customer.firstname}!</Typography>
                <Divider className={classes.divider}/>
                <Typography variant={'subtitle2'}>Order ref: {order.customer_reference}</Typography>
            </div>
            <br/>
            <Button component={Link} to={'/'} variant={'outlined'} type={'button'}>Back to Product Page</Button>
        </>*/
        console.log('real customer')
    ) : timeoutFinished ? (
        // this defaults
        <>
            <div>
                <Typography variant={'h5'}>Successful Purchase, Thank you!</Typography>
                <Divider className={classes.divider}/>
            </div>
            <br/>
            <Button component={Link} to={'/'} variant={'outlined'} type={'button'}>Back to Product Page</Button>
        </>
    ) : (
        // spinner when loading confirmation (if the order takes a while)
        <div className={classes.spinner}>
            <CircularProgress/>
        </div>
    )
    // if error during confirmation (commented as error defaults due to no payment info)
    if (error) {
        /*Confirmation = () => (
            <>
                <Typography variant="h5">Error: {error}</Typography>
                <br/>
                <Button component={Link} variant="outlined" type="button" to="/">Back to Product Page</Button>
            </>
        )*/
    }

    // handles movement through steps of checkout
    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next}/>
        : <PaymentForm checkoutToken={checkoutToken} shippingData={shippingData} nextStep={nextStep} backStep={backStep}
                       onCaptureCheckout={onCaptureCheckout} timeout={timeout}/>

    return (
        <>
            {/* cssbaseline adds some autofixes which fixes some centering bugs for mobile devices */}
            <CssBaseline/>
            <div className={classes.toolbar}/>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant={"h4"} align={'center'}>Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation/> : checkoutToken && <Form/>}
                </Paper>
            </main>
        </>
    )
}

export default Checkout