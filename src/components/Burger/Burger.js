import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './Burgeringredient/Burgeringredient';

const burger = (props) => {
  // ingredients in the states is an object => convert into array
  const transformedIngredients = Object.keys(props.ingredients) // keys => salad, bacon, cheese ...
    .map((igKey) => {
      // props.ingredients[igKey] = quantity, [...Array(2)] === [undefined], [undefined]
      return [...Array(props.ingredients[igKey])].map((_, i) => {
        return <BurgerIngredient key={igKey + i} type={igKey} />; //key => salad1 etc
      });
    });
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type='bread-top' />
      {transformedIngredients}
      <BurgerIngredient type='bread-bottom' />
    </div>
  );
};

export default burger;
