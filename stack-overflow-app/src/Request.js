class Request extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            queryAddr: null,
            requestData: null
        };
    }
  
    componentDidMount(){
        this.sendRequest();
    }
  
    sendRequest(){
        this.setState({queryAddr: this.props.addr});
        console.log(this.state.queryAddr);
    }
    render(){
      return(
        <div>
        <h2>{this.state.queryAddr}</h2>
        <List items = {numbers}/>
        </div>
      );
    }
  
  
  }
  
  
  class List extends React.Component{
    constructor(props){
      super(props);
      this.state = {arr: [], listItems: null};
    }
    
    onComponentDidMount(){
      updateArray();
    }
    updateArray(){
      this.setState({arr: result});
  
    }
    render(){
      return(
        <div>
          <li>{listItems}</li>
        </div>
  
      );
    }
  }
  class Item extends React.Component{
    constructor(props){
      super(props);
      this.state = {postData: props}
    }
    
    render(){
      return(
        <div>
          <ul>{this.state.postData}</ul>
        </div>
  
      );
    }
  }