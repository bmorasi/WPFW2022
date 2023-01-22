import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div aria-labelledby="Klik hier om te boeken">
            Klik <Link to="/Boek">hier</Link> om te boeken.
      </div>
    );
  }
}
