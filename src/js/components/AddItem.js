import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { addProduct } from '../actions/productActions';
import PropTypes from 'prop-types';
import ErrorAlert from './ErrorAlert';
import Loader from './Loader';
import { setWindowTop } from '../utils/functions';

class AddItem extends Component {
    state = {
        name: '',
        price: '',
        image: null,
        imageName: '',
        uploadBg: '',
        msg: null,
        loading: false
    }

    static propTypes = {
        addProduct: PropTypes.func.isRequired,
        product: PropTypes.object,
        error: PropTypes.object
    };

    componentDidMount() {
        setWindowTop();
    }

    componentDidUpdate(prevProps) {
        const { loading } = this.props.product;
        const { error } = this.props;

        if(prevProps.error !== error) {
            this.setState({msg: error.msg.error, loading: false});
        } 

        if(prevProps.product.loading !== loading) {
            // Route back to home
            this.props.history.push('/');
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        
        // Set image to state and file uploader background
        if(e.target.type === 'file') {
            this.setState({ image: e.target.files[0], imageName: e.target.files[0].name });

            const reader = new FileReader();

            reader.onload = (e) => {
                this.setState({ uploadBg: e.target.result });
            };

            reader.readAsDataURL(e.target.files[0]);
        }   
    }
    

    onSubmit = (e) => {
        e.preventDefault();

        const product = {
            name: this.state.name,
            price: this.state.price,
            image: this.state.image
        };

        const formData = new FormData();

        formData.append('name', product.name);
        formData.append('price', product.price);
        formData.append('product', product.image);

        // Add product via addProduct action
        this.props.addProduct(formData);

        this.setState({loading: true});
    }

    render() {
        return (
           <div className="form">
                <form onSubmit={this.onSubmit}>
                    {this.state.msg ? <ErrorAlert message={this.state.msg} /> : null}

                    {this.state.loading ? <div className="form__disabled"><Loader /></div> : null}

                    <h2>Add Item</h2>

                    <div className="form__row form__row--image">
                        <label htmlFor="image" style={{backgroundImage: `url(${this.state.uploadBg})`}}>{this.state.imageName === '' ? 'Upload an image' : this.state.imageName}</label>
    
                        <input type="file" name="image" id="image" className="hidden" onChange={this.onChange} />
                    </div>
    
                    <div className="form__row">
                        <label htmlFor="name">Name</label>
    
                        <input type="text" name="name" id="name" className="field" placeholder="Name" onChange={this.onChange} />
                    </div>
    
                    <div className="form__row">
                        <label htmlFor="price">Price $</label>
    
                        <input type="number" name="price" id="price" className="field" placeholder="Price" onChange={this.onChange} />
                    </div>
    
                    <div className="form__actions">
                        <button type="submit" className="btn">Add</button>
                    </div>
                </form>
           </div>
        );
    }
}

const mapStateToProps = (state) => ({
    product: state.product,
    error: state.error
});


export default connect(mapStateToProps, { addProduct })(AddItem);