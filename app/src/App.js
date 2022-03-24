// import React from "react";
// import "./style.css";
// import './gridstyles.css';
// import "./timeline.css";
// import Timeline from './components/Timeline';
// import io from "socket.io-client";
// const socket = io.connect('/');

// const END_POINT_ROOT = "http://localhost:8000/";
// const INSTRUCTORS_RESOURCE = "users";

// export default class App extends React.Component {
//   state = {
//     instructors: [],
//     heightLimit: 8,
//     loaded: false,
//     error: ""
//   };

//   getHeightLimit() {
//     return this.state.heightLimit;
//   }

//   setHeightLimit(heightLimit) {
//     this.setState({heightLimit: heightLimit});
//     console.log("HeightLimit: " + this.state.heightLimit);
//   }

//   parseData = (data) => {
//     if(!data) {
//       return null;
//     }
//     const parsedData = JSON.parse(data);
    
//     let instructorArray = {};
//     for(let i = 0; i < parsedData.length; i++) {
//         const key = parsedData[i].username;

//         let instructor;
//         // Check if instructor is already in the object
//         if(instructorArray[key]) {
//           instructor = instructorArray[key];
//         } else {
//           instructor = {};
//           instructor.timeblocks = [];
//           instructor.name = parsedData[i].first_name + " " + parsedData[i].last_name;
//           instructor.key = key;
//           instructorArray[key] = instructor;
//         }
//         // Check if there are any valid courses associated with the instructor
//         if(parsedData[i].start_date != null && parsedData[i].end_date != null) {
//           instructor.timeblocks.push({
//             start: new Date(parsedData[i].start_date), 
//             end: new Date(parsedData[i].end_date), 
//             name: parsedData[i].title + " " + parsedData[i].course_num, 
//             courseNum: parsedData[i].course_num,
//             userId: parsedData[i].username});  
//         }
//     }
//     instructorArray = Object.values(instructorArray);

//     this.setState({instructors: instructorArray, heightLimit: (instructorArray.length + 1) * 2})
//     this.setState({loaded: true})
//   }

//   retrieveInstructorDataFromDatabase = () => {
//       fetch(END_POINT_ROOT + INSTRUCTORS_RESOURCE)
//       .then(response => {
//           return response.text();
//       })
//       .then(data => {
//           this.parseData(data)
//       });
//   }

//   componentDidMount() {
//     this.retrieveInstructorDataFromDatabase();
//   }

//   removeElement(el) {
//     console.log(el);
//   }

//   renderApp() {
//     return (
//       <div className="App">
//           {(this.state.error !== "") ?
//             <div className="error-modal">
//               <h1>Error:</h1>
//               <p>{this.state.error}</p>
//               <button style={{position:"absolute", top:0, right:0}} onClick={() => {this.setState({error: ""})}}>
//                 <p>X</p>
//               </button>
//             </div>
//             :
//             undefined
//           }

//           <Timeline socket={socket} heightLimit={{get: () => this.getHeightLimit(), set: (limit) => this.setHeightLimit(limit)}}
//           instructorArray={this.state.instructors} />
//       </div>
import Vacation from "./vacation-form/Vacation"
import Schedule from "./Schedule"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import VacationApproval from "./vacation-approval/VacationApproval";
import { useState } from "react"

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route exact path="/" element={<Schedule />} />
                    <Route exact path="/vacation" element={<Vacation />} />
                    <Route exact path="/vacationApproval" element={<VacationApproval />} />
                </Routes>
            </div>
        </Router>
    );
}

//   render() {
//     // Remove this later on and add a real feedback message, this is just for development purposes
//     socket.on('error', (err) => {
//       console.log(err);
//       this.setState({error: err})
//     });

//     return (
//       this.state.loaded ? 
//         this.renderApp() 
//         :
//         <span>Loading data...</span>
//     );
//   }
// }
export default App;
