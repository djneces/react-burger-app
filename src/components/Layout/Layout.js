import React from 'react';
import Aux from '../../hoc/Aux';
import classes from './Layout.css';

const layout = (props) => (
  //adjacent elements must be wrapped = instead of div I use Aux func in hoc
  <Aux>
    <div> Toolbar, Sidebar Backdrop </div>
    <main className={classes.Content}>{props.children}</main>
  </Aux>
);

export default layout;
