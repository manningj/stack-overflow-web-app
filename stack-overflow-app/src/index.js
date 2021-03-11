import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals'; 

var queryAddress = '';
var result = [];
function createQueryAddress(sortType, tag){
  return 'https://api.stackexchange.com/2.2/search?order=desc&sort='+sortType+ '&tagged='+ tag+ '&site=stackoverflow&filter=!--1nZwQ5_Sz)';
}

class InputBox extends React.Component{
  constructor(props){
    super(props);
    this.state = {input: '', requestData: []}

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event){
    this.setState({input: event.target.value});
  }

  handleSubmit(event){
    queryAddress = createQueryAddress('votes', this.state.input);
    this.makeRequest();
    queryAddress = createQueryAddress('creation', this.state.input);
    this.makeRequest();
    this.setState({requestData: result})
    result = [];

    event.preventDefault();
  }
  makeRequest(){
      fetch(queryAddress)
          .then(response => response.json())
          .then(data => {
            for(var i = 0; i< 10; i++ ){
               result[result.length] = data.items[i];
            }
           });
  }
  render(){
    return(
      <div>
        <form onSubmit ={this.handleSubmit}>
          <label>
            Input a Tag to search for:
            <input type = "text" value = {this.state.value} 
              onChange = {this.handleChange}
            />
          </label>
          <input type = "submit" value = "Submit"/>
        </form>
      <ul className = "postList">
      {
       this.state.requestData.map((item) =>(
        <Post key = {item.question_id} 
            title = {item.title} 
            creation_date = {item.creation_date}
            score = {item.score}
            body = {item.body}
            />   
        ))  
      }
      </ul>
      </div>
    ); 
  }
}
function Post(props){
  return(
    <ul>
      <div className = "title"> <h3 dangerouslySetInnerHTML ={{__html: props.title}}></h3> </div>
        <div className = "creationDate" ><li >Date: {props.creation_date}</li></div>
        <div className = "votes"><li>Score: {props.score}</li></div>
        <div className = "content"><ContentToggle body = {props.body}/></div>
    </ul>
  );
}

class ContentToggle extends React.Component{
  constructor(props){
    super(props);
    this.state = {visible: false}
    this.hide = this.hide.bind(this);
    this.expand = this.expand.bind(this);
  }
  hide(){
    this.setState({visible: false})
  }
  expand(){
    this.setState({visible: true})
  }
  render(){
    const isVisible = this.state.visible;
    let button;
    let text;

    if(isVisible){
      button = <button onClick ={this.hide}> Hide Content</button>
      text = <Content body = {this.props.body}/>
    }else{
      button = <button onClick ={this.expand}> Show Content</button>
      text = null;
    }
    return(
      <div>{button}{text}</div>
    );
  }
}
function Content(props){
  return(
      <div className = "content">
        <div className = "body" dangerouslySetInnerHTML= {{__html: props.body}}/>;
      </div>

  );
}
function Answers(props){

}
function App(){
  return (
    <div className = "app">
      <h1>{titleText}</h1>
      <InputBox/>
    </div>
  );
}
const titleText = "Welcome to my Application";
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
