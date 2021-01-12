const e = React.createElement;

const Modal = ({ handleClose, handleSubmit, show, action, genders, sources, customerEdit }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={ showHideClassName }>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title" >{ action }</h1>
                    </div>
                    <form onSubmit={ handleSubmit }>
                        <div className="modal-body">
                            <div>
                                <input type="hidden" name="id" defaultValue={customerEdit.id} />
                                <div className="form-group name">
                                    <label htmlFor="name">Name: </label>
                                    <input type="text" className="form-control" placeholder="Full Name" name="name" defaultValue={customerEdit.name} required />
                                </div>
                                <div className="form-group dob">
                                    <label htmlFor="dob">Date of Birth: </label>
                                    <input type="date" className="form-control" name="dob" defaultValue={customerEdit.dob} />
                                </div>
                                <div className="form-group address">
                                    <label htmlFor="address">Address: </label>
                                    <textarea row="3" className="form-control" name="address" defaultValue={customerEdit.address}></textarea>
                                </div>
                                <div className="form-group gender">
                                    <label htmlFor="gender">Gender: </label>
                                    <select className="form-control" name="gender" defaultValue={customerEdit.gender}>
                                        {genders.map((gender) => {
                                            return (
                                                <option key={gender.id} value={gender.id}>{ gender.gender }</option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className="form-group contact">
                                    <label htmlFor="contact">Contact: </label>
                                    <input type="number" className="form-control" name="contact" defaultValue={customerEdit.contact} required />
                                </div>
                                <div className="form-group source">
                                    <label htmlFor="source">Source: </label>
                                    <select className="form-control" name="source" defaultValue={customerEdit.source}>
                                        {sources.map((source) => {
                                            return (
                                                <option key={source.id} value={source.id}>{ source.source }</option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <a className="btn btn-primary" onClick={ handleClose }>Close</a>
                            <button type="submit" className="btn btn-success">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

class Customer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customers: [],
            customerEdit: {},
            newCustomer: [],
            genders: [],
            sources: [],
            action: "",
            errors: {
                name: ''
            }
        }

        this.showModalAdd = this.showModalAdd.bind(this);
        this.showModalEdit = this.showModalEdit.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.saveCustomer = this.saveCustomer.bind(this);
    }

    showModalAdd = () => {
        this.setState({
            show: true,
            action: "Add",
            customerEdit: {}
        });
    };

    showModalEdit = (customer) => {
        this.setState({
            show: true,
            action: "Edit",
            customerEdit: customer
        })  
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    componentDidMount() {
        axios.get("WebService/WebService.asmx/GetCustomerList")
        .then(res => {
            this.setState({ customers: res.data })
        })

        axios.get("WebService/WebService.asmx/GetGender")
        .then(res => {
            this.setState({ genders: res.data })
        })

        axios.get("WebService/WebService.asmx/GetSource")
        .then(res => {
            this.setState({ sources: res.data })
        })
    }

    deleteCustomer = (customer) => {
        axios.get(`WebService/WebService.asmx/DeleteCustomer?id=${customer.id}`)
        .then(res => {
            this.setState(previousState => {
                return {
                    customers: previousState.customers.filter(c => c.id !== customer.id)
                }
            })
        })
    }

    saveCustomer = () => {
        event.preventDefault();
        
        const genderValue = event.target.gender.value;
        const genderText = event.target.gender[event.target.gender.selectedIndex].text;

        const sourceValue = event.target.source.value;
        const sourceText = event.target.source[event.target.source.selectedIndex].text;

        const dobValue = event.target.dob.value;
        const dobText = dobValue == "" ? null : dobValue;

        const id = parseInt(event.target.id.value);
        const name = event.target.name.value;
        const address = event.target.address.value;
        const contact = event.target.contact.value;

        const isAdd = isNaN(id);

        const customer = {
            id: id,
            name: name,
            dob: dobText,
            address: address,
            gender: genderText,
            contact: contact,
            source: sourceText
        }

        if (isAdd) {
            axios.get("WebService/WebService.asmx/AddCustomer", {
                params: {
                    name: customer.name,
                    dob: dobValue,
                    address: customer.address,
                    gender: genderValue,
                    contact: customer.contact,
                    source: sourceValue
                }
            })
            .then(res => {
                customer.id = res.data[0].id;

                this.setState({
                    customers: this.state.customers.concat(customer)
                })
            })
        } else {
            axios.get("WebService/WebService.asmx/EditCustomer", {
                params: {
                    id: customer.id,
                    name: customer.name,
                    dob: dobValue,
                    address: customer.address,
                    gender: genderValue,
                    contact: customer.contact,
                    source: sourceValue
                }
            })
            .then(res => {
                this.setState(previousState => {
                    return {
                        customers: previousState.customers.filter(c => c.id !== customer.id),
                    }
                })

                this.setState({
                    customers: this.state.customers.concat(customer)
                })

                let customerSorted;
                customerSorted = this.state.customers.sort((a, b) => {
                    return parseInt(a.id) - parseInt(b.id);
                })

                this.setState({
                    customers: customerSorted
                })
            })
        }
        

        this.hideModal();
    }

    render() {
        return (
            <div>
                <a className="btn btn-primary" onClick={ this.showModalAdd }><i className="fas fa-plus"></i> Add</a>
                <table className='table'>
                    <thead>
                        <tr>
                            <th width="15%">Profile Picture</th>
                            <th width="15%">Name</th>
                            <th width="5%">DOB</th>
                            <th width="25%">Address</th>
                            <th width="10%">Gender</th>
                            <th width="10%">Contact</th>
                            <th width="10%">Source</th>
                            <th width="10%" style={{textAlign: "center"}}><i className="fas fa-cog"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.customers.map((customer) => {
                            return (
                                <tr key={ customer.id }>
                                    <td><img src={`/ProfileImage/${1}.jpg`} width="100px" height="100px" /></td>
                                    <td>{ customer.name }</td>
                                    <td>{ new Date(customer.dob).getFullYear() == "1970" ? "" : (new Date(customer.dob).toLocaleDateString()) }</td>
                                    <td>{ customer.address }</td>
                                    <td>{ customer.gender }</td>
                                    <td>{ customer.contact }</td>
                                    <td>{ customer.source }</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="button" onClick={() => this.showModalEdit(customer)}><i className="fas fa-edit"></i></a>&nbsp;&nbsp;
                                        <a className="button" onClick={() => this.deleteCustomer(customer)}><i className="fas fa-trash-alt"></i></a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <Modal handleClose={this.hideModal} handleSubmit={this.saveCustomer} action={this.state.action} show={this.state.show} genders={this.state.genders} sources={this.state.sources} customerEdit={this.state.customerEdit}>
                </Modal>
            </div>
        );
    }
}

ReactDOM.render(e(Customer), document.querySelector('#customer'));