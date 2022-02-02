import React from 'react'
import {TextField, Grid} from '@material-ui/core'
import {useFormContext, Controller} from 'react-hook-form'

/* this class creates an single input form element to be used in AddForm.jsx
*  i.e. "first name", "last Name", "city", etc is each 1 individual FormInput
* */

const FormInput = ({name, label, defaultValue}) => {
    const {control} = useFormContext()

    return (
        <Grid item xs={12} sm={6}>
            <Controller
                control={control}
                name={name}
                render={({field}) => (
                    <TextField
                        fullWidth
                        defaultValue={defaultValue}
                        label={label}
                        required
                    />
                )}
            />
        </Grid>
    )
}

export default FormInput