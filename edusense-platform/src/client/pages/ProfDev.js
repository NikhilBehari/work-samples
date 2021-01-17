import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Markdown from 'markdown-to-jsx';
import { Link, Element, Events, animateScroll } from 'react-scroll'

// Styling
import styles from '../styles/pdStyles';

// Material-UI Components
import Button from '@material-ui/core/Button';

// PD Components 
const SectionElement = ({children, ...props}) => (
  <Element
    name={children}
  >
    <h3>{children}</h3>
  </Element>
);
const Sections = ["Introduction", "Research", "Recommendations", "Set Goals"];

class ProfDev extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      pdProgress: 0, 
      pdModule: " ",
      frameData: '',

    }
  }

  async componentDidMount(){
    
    await fetch('/api/getPDModules')
    .then(res => res.json())
    .then(pd_data => this.setState({ pdModule: (pd_data) }));

    // GET: Frame data (here as an example)
    // fetch('/api/getFrameData')
    // .then(res => res.json())
    // .then(frameObj => {
    //   // console.log(users);
    //   console.log("Storing frame object");
    //   this.setState({ frameData: frameObj });
    // });
  }

  progressForward = () => {
    this.setState({ pdProgress: this.state.pdProgress+1 });
  }

  progressBack = () => {
    this.setState({ pdProgress: this.state.pdProgress-1 });
  }

  render(){
    
    const { course, classes } = this.props;

    return(
      <div style={{height: '600px'}}>
        {/* <ReactMarkdown source={this.state.pdModule} /> */}
        {/* <Markdown>{this.state.pdModule}</Markdown> */}

        <h1>{course}</h1>
        {Sections.map((section) => (
          <Button variant="contained" color="primary" style={{marginRight: '10px'}}>
            <Link
              activeClass="active"
              to={section}
              spy={true}
              smooth={true}
              duration={200}
              containerId="containerElement"
            >
              {section}
            </Link>
          </Button>
        ))}

        <Element
          name="test7"
          className="element"
          id="containerElement"
          style={{
            position: "relative",
            height: "100%",
            overflow: "scroll",
            marginBottom: "100px"
          }}
        >
          <Markdown
            options={{
                overrides: {
                  h3: {
                    component: SectionElement
                  }
                },
            }}
          
          >{this.state.pdModule[0][course] || "Loading..." }</Markdown>

        </Element>

      </div>
      );
    }
  }
export default withStyles(styles)(ProfDev);
