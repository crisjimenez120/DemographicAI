import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation.js'
import Logo from './components/Logo/Logo.js'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js'
import Rank from './components/Rank/Rank.js'
import SignIn from './components/SignIn/SignIn.js'
import Register from './components/Register/Register.js'
import Particles from 'react-particles-js'
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js'
import DemographicTable from './components/DemographicTable/DemographicTable.js'

import './App.css';


const app = new Clarifai.App({
  apiKey: 'd75a3b9e9bbc4275bc9991b92cce8677'

});


const particlesOptions ={
 particles: {
    number:{
        value:30,
        density:{
          enable:true,
          value_area:800        }
    }
  }         
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box:{},
      demographicTable:{},
      route: 'signin',
      isSignedIn: false,
      user:{
          id:'',
          name:'',
          email:'',
          entries:0,
          joined: ''
      }
    }
  }


loadUser = (data) => {
  this.setState({user:{
          id: data.id,
          name:data.name,
          email:data.email,
          entries:data.entries,
          joined: data.joined
  }})
}

calculateFaceLocation = (data) =>{

 const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
 const image = document.getElementById('inputimage');
 const width = Number(image.width);
 const height = Number(image.height);
   return{
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
    }
}
calculateDemographicTable = (data) =>{
   //for predict age do top 3 and print out %   
 //concepts[0].value shows %
//TODO
  const agePredict = data.outputs[0].data.regions[0].data.face.age_appearance.concepts[0].name;
  //console.log(agePredict);
  const genderPredict = data.outputs[0].data.regions[0].data.face.gender_appearance.concepts[0].name;
  //console.log(genderPredict);
  const culturePredict = data.outputs[0].data.regions[0].data.face.multicultural_appearance.concepts[0].name;
  //console.log(culturePredict);
  return{
    age: agePredict,
    gender: genderPredict,
    culture: culturePredict,
  }
}

displayDemographicTable =(demographicTable) =>{
  this.setState({demographicTable: demographicTable})
}



displayFaceBox = (box) =>{
  this.setState({box:box})
}


onInputChange = (event) =>{
  this.setState({input: event.target.value});
}

onButtonSubmit = () =>{
  this.setState({imageUrl: this.state.input})
  app.models
    .predict( 
     Clarifai.DEMOGRAPHICS_MODEL,
     this.state.input)
    .then(response => {
      if(response){
        fetch('http://localhost:3000/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body:JSON.stringify({
            id:this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries :count}))
          })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  app.models
    .predict( 
     Clarifai.DEMOGRAPHICS_MODEL,
     this.state.input)
    .then(response => this.displayDemographicTable(this.calculateDemographicTable(response)))
    .catch(err => console.log(err));
}

onRouteChange = (route) =>{
  if(route === 'signout'){
    this.setState({isSignedIn:false})
  }else if(route === 'home'){
    this.setState({isSignedIn:true})
  }
  this.setState({route: route})
}



  render() {
    return (
      <div className="App">
        <Particles  className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn = {this.state.isSignedIn}onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' 
          ? <div>
             <Logo/>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>       
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={this.state.box}imageUrl={this.state.imageUrl} />
            <DemographicTable demographicTable={this.state.demographicTable}/>
          </div>
          :(
            this.state.route === 'signin' ?  <SignIn loadUser ={this.loadUser} onRouteChange={this.onRouteChange}/>
                                          :  <Register loadUser ={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
         
         
       }

      </div>
    );
  }
}

export default App;


      // console.log(response.outputs[0].data.regions[0].data.face.age_appearance);
      // console.log(response.outputs[0].data.regions[0].data.face.gender_appearance);
      // console.log(response.outputs[0].data.regions[0].data.face.multicultural_appearance);
      // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
