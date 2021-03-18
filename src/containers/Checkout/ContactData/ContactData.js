import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name',
        },
        //value showed on the screen is updated from inputChangedHandler
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP',
        },
        value: '',
        validation: {
          required: true,
          minLength: 5,
          maxLength: 7,
        },
        valid: false,
        touched: false,
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your E-mail',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayValue: 'Fastest' },
            { value: 'cheapest', displayValue: 'Cheapest' },
          ],
        },
        value: '',
        //valid and validation added so we don't get undefined in checkValidity and inputChangedHandler
        valid: true,
        validation: {},
      },
    },
    loading: false,
    formIsValid: false, // to active the order btn
  };

  orderHandler = (event) => {
    event.preventDefault();

    this.setState({ loading: true });
    const formData = {};
    //{name: 'John', street: 'test st' }
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value;
    }

    const order = {
      ingredients: this.props.ings,
      //in production we calculate price on the server = avoid user data manipulation
      price: this.props.price,
      orderData: formData,
    };
    //firebase needs .json!!!
    axios
      .post('/orders.json', order)
      .then((response) => {
        this.setState({ loading: false }); //after post, remove the spinner,
        //we had to pass ...props from Checkout, so push works here (so we have access to history)
        this.props.history.push('/');
      })
      .catch((error) => {
        this.setState({ loading: false }); //remove spinner here, so user doesn't expect results
      });
  };

  checkValidity(value, rules) {
    let isValid = true;
    //Set of our rules
    if (rules.required) {
      isValid = value.trim() !== '' && isValid; // if input empty false, otherwise true
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      //&& isValid so if the previous statement sets isValid to false, this doesn't apply a doesn't override to false to true
      isValid = value.length <= rules.maxLength && isValid;
    }
    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      //we need object DEEP clone
      ...this.state.orderForm,
    };

    const updatedFormElement = {
      //object copy within name (value of name), street...
      // => we don't need to clone passed 2nd level, we don't need to change e.g. options[]
      // (options are referencing the ORIGINAL obj!)
      ...updatedOrderForm[inputIdentifier],
    };
    updatedFormElement.value = event.target.value;
    updatedFormElement.valid = this.checkValidity(
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      //&& formIsValid (initial true) so we don't override potential false from inputIdentifier in previous enum.
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };

  render() {
    // orderForm object => array
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key, // name, street, zipCode, country, email, deliveryMethod
        config: this.state.orderForm[key], // values for the keys, (config is my naming)
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map((formElement) => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation} //if this doesn't exist -> false
            touched={formElement.config.touched} //CSS styling applies only when touched
            //arrow func so we can pass formElement.id to know where the input is coming from (id is name, street..)
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <Button
          btnType='Success'
          disabled={!this.state.formIsValid}
          clicked={this.orderHandler}
        >
          ORDER
        </Button>
      </form>
    );

    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.ingredients,
    price: state.totalPrice,
  };
};

export default connect(mapStateToProps)(ContactData);
