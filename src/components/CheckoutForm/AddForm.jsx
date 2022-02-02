import React, {useState, useEffect} from 'react'
import {InputLabel, Select, MenuItem, Button, Grid, Typography} from '@material-ui/core'
import {useForm, FormProvider} from "react-hook-form";
import {Link} from 'react-router-dom'

import {commerce} from '../../lib/commerce'

import FormInput from './FormInput'

/* ADDRESS form component for shipping information*/

const AddressForm = ({checkoutToken, next}) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('')
    const [shippingSubdivisions, setShippingSubdivisions] = useState([])
    const [shippingSubdivision, setShippingSubdivision] = useState('')
    const [shippingOptions, setShippingOptions] = useState([])
    const [shippingOption, setShippingOption] = useState('')
    const methods = useForm();

    const countries = Object.entries(shippingCountries).map(([code, name]) => ({id: code, label: name}))
    const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({id: code, label: name}))
    const options = shippingOptions.map((sO) => // sO -> "shippingOption"
        ({id: sO.id, label: `${sO.description} - ${sO.price.formatted_with_symbol}`}))

    // this region is for the country dropdown  area --------------------------------------------------
    const fetchShippingCountries = async (checkoutTokenId) => {
        // response with countries available to ship to
        const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId)
        setShippingCountries(countries)
        setShippingCountry(Object.keys(countries)[0])
    }
    // country subdivision or state
    const fetchSubdivisions = async (countryCode) => {
        // response with subdivisions available
        const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode)
        setShippingSubdivisions(subdivisions)
        setShippingSubdivision(Object.keys(subdivisions)[0])
    }
    // international or domestic shipping option
    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        // responds with shipping options (prices for domestic or international)
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region})
        setShippingOptions(options)
        setShippingOption(options[0].id)
    }

    useEffect(() => {
        fetchShippingCountries(checkoutToken.id)
        // no dependencies
    }, [])

    useEffect(() => {
        if (shippingCountry) fetchSubdivisions(shippingCountry)
        // dependency - this useEffect will take effect when 'shippingCountry' changes
    }, [shippingCountry])

    useEffect(() => {
        if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision)
        // dependency - this will update once a shipping subdivision is available
    }, [shippingSubdivision])
    // end country and shipping dropdown region --------------------------------------------------------------

    return (
        <>
            <Typography variant={'h6'} gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => next({
                    ...data,
                    shippingCountry,
                    shippingSubdivision,
                    shippingOption
                }))}>
                    <Grid container spacing={3}>
                        <FormInput name={'firstName'} label={'First Name'} defaultValue={'Spongebob'}/>
                        <FormInput name={'lastName'} label={'Last Name'} defaultValue={'Squarepants'}/>
                        <FormInput name={'email'} label={'Email'} defaultValue={'squarepants.bob@bikinibottom.com'}/>
                        <FormInput name={'address1'} label={'Address'} defaultValue={'124 Conch St'}/>
                        <FormInput name={'city'} label={'City'} defaultValue={'Bikini Bottom'}/>
                        <FormInput name={'zip'} label={'Zip Code'} defaultValue={'96970'}/>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth
                                    onChange={(e) => setShippingCountry(e.target.value)}>
                                {countries.map((country) => (
                                    <MenuItem key={country.id} value={country.id}>
                                        {country.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>State | Subdivision</InputLabel>
                            <Select value={shippingSubdivision} fullWidth
                                    onChange={(e) => setShippingSubdivision(e.target.value)}>
                                {subdivisions.map((subdivision) => (
                                    <MenuItem key={subdivision.id} value={subdivision.id}>
                                        {subdivision.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>
                                Shipping Options
                            </InputLabel>
                            <Select value={shippingOption} fullWidth
                                    onChange={(e) => setShippingOption(e.target.value)}>
                                {options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>

                    <br/>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button component={Link} to={'/cart'} variant={'outlined'}>Back to Cart</Button>
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Next</Button>
                    </div>

                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm