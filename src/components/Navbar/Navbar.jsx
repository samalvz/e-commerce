import React from 'react'
import {AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography} from '@material-ui/core'
import {ShoppingCart} from "@material-ui/icons";
import {Link, useLocation} from "react-router-dom"

// import logo from '../../../public/commerceicon.png'
import desktop from '../../assets/desktop.png'

import useStyles from "./styles";

/* navbar element which is displayed above all elements, allows user to return to main page and shows cart*/

const Navbar = ({cartItemCount}) => {
    const classes = useStyles()
    const location = useLocation();

    return (
        <div>
            <AppBar position={'fixed'} className={classes.AppBar} color={"inherit"}>
                <Toolbar>
                    {/*Icon and title (Left)*/}
                    <Typography component={Link} to={"/e-commerce"} variant={'h6'} className={classes.title} color={'inherit'}>
                        <img src={desktop} alt={'Simple E-Commerce'} height={'25px'} className={classes.image}/>
                        Sam's PC Part Store
                    </Typography>

                    <div className={classes.grow}/>

                    {/*show cart button and badge on toolbar if on the home page*/}
                    {(location.pathname === '/e-commerce') && (
                    <div className={classes.button}>
                        {/*<Link to={"/cart"}>go to cart</Link>*/}
                        <IconButton component={Link} to={"/cart"} aria-label={'Show cart items'} color={'inherit'}>
                            <Badge badgeContent={cartItemCount} color={'secondary'}>
                                <ShoppingCart/>
                            </Badge>
                        </IconButton>
                    </div> )}


                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar