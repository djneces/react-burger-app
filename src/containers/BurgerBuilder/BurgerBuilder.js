import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
  //constructor(props) {
  //     super(props);
  //     this.state = {...}
  // }

  //Local state
  state = {
    purchasing: false, //modal
    loading: false, //loading to show spinner
    error: false, // axios get error
  };

  // set up the state dynamically - fetch data - componentDidMount
  componentDidMount() {
    //firebase needs .json!!!
    // axios
    //   .get('/ingredients.json')
    //   .then((response) => {
    //     this.setState({ ingredients: response.data });
    //     this.updatePurchaseState(this.state.ingredients); //after fetch, check if any ingredients => set purchasable => affects the order btn
    //   })
    //   .catch((error) => {
    //     this.setState({ error: true });
    //   });
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((acc, el) => acc + el, 0);
    return sum > 0; //true/false
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.props.history.push('/checkout');
  };

  render() {
    const disabledInfo = {
      ...this.props.ings,
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0; //updates {} eg: bacon: true, salad: false etc.
    }

    let orderSummary = null;

    //set the spinner until we fetch data from the DB
    let burger = this.state.error ? (
      <p>Ingredients can't be loaded'</p>
    ) : (
      <Spinner />
    );
    //if I have fetched the data-ingredients, show this
    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            //we need to execute when loads
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            price={this.props.price}
          />
        </Aux>
      );
      //summary also waiting for the ingredients from the DB
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          price={this.props.price.toFixed(2)}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
        />
      );
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

//which property receives which slice of state, we change local state for props in the code
const mapStateToProps = (state) => {
  return {
    //state.ingredients from the reducer
    ings: state.ingredients,
    //we need to fetch the price from reducer
    price: state.totalPrice,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //dispatches an object
    // prettier-ignore
    onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENTS, ingredientName: ingName }),

    // prettier-ignore
    onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENTS, ingredientName: ingName, }),
  };
};

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
