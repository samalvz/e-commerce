import Commerce from '@chec/commerce.js'

/* connects to comerceJS also supplies public key*/

export const commerce = new Commerce(process.env.REACT_APP_CHEC_PUBLIC_KEY, true);