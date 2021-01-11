
import React, { Component } from 'react';
// import _ from 'lodash';
import axios from 'axios';
import './css/App.css';

const API_URL = 'https://data.townofcary.org/api/v2/catalog/datasets/parks-and-recreation-feature-map/exports/json';
const DISPLAY_FIELDS = [
  'name',
  'baseball',
  'basketball',
  'battingcages',
  'climbingropes',
  'dogpark',
  'fitnesstrail',
  'openspace',
  'picnic',
  'skatepark',
  'soccer',
  'tenniscourt',
];

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      api_data:[],
      filtered_data: []
    }

  }






  componentDidMount(){
      axios.get(API_URL)
        .then(results => this.setState({api_data: results.data})) 
        .catch(err => console.log(err));

        // console.log(this.state.api_data);
  }



  tableDropDown(selection){


    return(
      <div>
        test
      </div>
    )
  }

  render() {
    console.log(this.state.api_data);


    return (
      <div className="table">
        {this.tableDropDown}



        <table>
          <tr>
            {DISPLAY_FIELDS.map((item)=>
              <td> {item} </td>
              
              )}
          </tr>

            {this.state.api_data.map((item)=>
              <tr>
                <td> {item.name}</td>
                <td> {(item.baseball) ? item.baseball : "N/A"}</td>
                <td> {item.basketball}</td>
                <td> {item.battingcages}</td>
                <td> {item.climbingropes}</td>
                <td> {item.dogpark}</td>
                <td> {item.fitnesstrail}</td>
                <td> {item.openspace}</td>
                <td> {item.picnic}</td>
                <td> {item.skatepark}</td>
                <td> {item.soccer}</td>
                <td> {item.tenniscourt}</td>
              </tr>
            )}
        

        </table>



      </div>
    );
  }
}

export default App;















