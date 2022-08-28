import React from "react";
import "./App.css"
import { BrowserRouter as Router, Route } from "react-router-dom";
import Join from "./components/Join/Join.js";
import Chat from "./components/Chat/Chat";


function App() {

  

  return (
    <div className="App">
    <Router>
    
        <Route exact path='/' component={Join}/>
        <Route path='/chat' component={Chat}/>
        
    </Router>

    </div>

  );
}

export default App;
