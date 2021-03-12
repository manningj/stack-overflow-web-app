import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals'; 

var result = [];
function createQueryAddress(sortType, tag){
  var date = Math.round(Date.now() / 1000)
  var weekAgo = date - 604800;
  return 'https://api.stackexchange.com/2.2/search?fromdate=' + 
                                                            weekAgo + '&order=desc&sort='+
                                                            sortType+ '&tagged='+ 
                                                            tag+ '&site=stackoverflow&filter=!)rTkraPXxg*xgr03n8Uq';
}

class InputBox extends React.Component{
  constructor(props){
    super(props);
    this.state = {input: '', requestData: [], }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event){
    this.setState({input: event.target.value});
  }

  handleSubmit(event){
    this.makeRequest(createQueryAddress('votes', this.state.input));
    event.preventDefault();
  }

  makeRequest(addr){
      fetch(addr)
          .then(response => response.json())
          .then(data => {
            for(var i = 0; i < 10; i++ ){
               result[result.length] = data.items[i];
            }
            this.followUpRequest(createQueryAddress('creation', this.state.input));
           });
    
  }
  followUpRequest(addr){
    fetch(addr)
      .then(response => response.json())
      .then(data => {
        for(var i = 0; i < 10; i++ ){
          result[result.length] = data.items[i];
      }
      result.sort(function(a, b){return b.creation_date - a.creation_date;})
      this.setState({requestData: result})
      result = [];
     });

  }
  render(){
    return(
      <div className = "input_box">
        <form onSubmit ={this.handleSubmit}>
          <label className = "input_label">
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
            comments = {item.comments}
            answers = {item.answers}
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
    <ul className = "post">
        <div className = "title"> <h3 dangerouslySetInnerHTML ={{__html: props.title}}></h3> </div>
        <PostData creation_date = {props.creation_date} score = {props.score}/>
        <div className = "content"><ContentToggle 
                                    body = {props.body} 
                                    answers = {props.answers} 
                                    comments = {props.comments}/>
        </div>
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
      text = <Content body = {this.props.body} answers = {this.props.answers}/>
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
  var answerArr = [];
  var commentArr = [];
  var commentString = "";
  var answerString = "";
  if(props.answers !== undefined){
    answerArr = props.answers;
    answerString = "Answers:";
  }

  if(props.comments!== undefined){
    commentArr = props.comments;
    commentString = "Comments";
  }
  return(
      <div className = "content">
        <div className = "body" dangerouslySetInnerHTML= {{__html: props.body}}/>
          <h4 className = "comment">
            {commentString}
          </h4>
        {
          commentArr.map((comment) => (
        <Comment key = {comment.comment_id} 
            creation_date = {comment.creation_date}
            score = {comment.score}
            body = {comment.body}
            />   
          )) 
        }
        <h4 className = "answer">
          {answerString}
        </h4>
        {
          answerArr.map((answer) => (
        <Answer key = {answer.answer_id} 
            creation_date = {answer.creation_date}
            score = {answer.score}
            body = {answer.body}
            comments = {answer.comments}
            />   
          )) 
        }
      </div>

  );
}
function PostData(props){
  return(
    <div className = "post_data">
      Date: <DateElement creation_date = {props.creation_date}/> Score: {props.score}
    </div>
  );
}
function Comment(props){
  return(
    <div>
    <div className = "comment" dangerouslySetInnerHTML = {{__html: props.body}}/>
    <PostData creation_date = {props.creation_date} score = {props.score}/>
    <br></br>
    </div>
  );
}
function Answer(props){
  var commentArr = [];
  var commentString = "";
  if(props.comments!== undefined){
    commentArr = props.comments;
    commentString = "Comments";
  }
  return(
    <div>
      <div className = "answer" dangerouslySetInnerHTML = {{__html: props.body}}/>
      <PostData creation_date = {props.creation_date} score = {props.score}/>
      <h5 className = "comment"> {commentString} </h5>
      {
          commentArr.map((comment) => (
        <Comment key = {comment.comment_id} 
            creation_date = {comment.creation_date}
            score = {comment.score}
            body = {comment.body}
            />   
          )) 
        }
    </div>
  );
}

function DateElement(props){
  return(
     new Date(props.creation_date * 1000).toLocaleTimeString()
  );
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
