import React, { Component } from 'react';
import axios from 'axios';


export class Boek extends Component {
    static displayName = Boek.name;

    constructor(props) {
        super(props);
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const data = { dag: this.state.dag, aantal: this.state.aantal, email: this.state.email };
        try {
            const response = await axios.post('/doeboeking', data);
            const result = response.data;
            this.setState({ result });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return (
            <form name="form" action="/doeboeking" method="get" aria-labelledby="Boekings vorm">
                Datum: <input type="date" name="dag" id="datepicker" aria-labelledby="Datum prikker"/>
                <br />
                Aantal mensen: <input type="number" name="aantal" aria-labelledby="Aantal mensen veld"/>
                <br />
                Email: <input type="email" name="email" aria-labelledby="email veld"/>
                <br />
                <br />
                <input type="submit" value="Doe boeking" aria-labelledby="Doe boeking knop"/>
            </form>
        );
    }
}