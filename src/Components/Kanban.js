import React from "react";
import projectList from "./../projectList";

/*
 * The Kanban React component
 */
export default class Kanban extends React.Component {
  render() {
    const style = {
      padding: "30px",
      paddingTop: "5px"
    };

    return (
      <div style={style}>
        <h1 style={{ textAlign: "center" }}>Kanban</h1>
        <KanbanBoard />
      </div>
    );
  }
}

/*
 * The Kanban Board React component
 */
class KanbanBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      projects: [],
      draggedOverCol: 0
    };
    this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
    this.columns = [
      { name: "Todo", stage: 1 },
      { name: "Next Up", stage: 2 },
      { name: "In progress", stage: 3 },
      { name: "Done", stage: 4 },
      { name: "Archived", stage: 5 }
    ];
  }

  componentDidMount() {
    this.setState({ projects: projectList, isLoading: false });
  }

  //this is called when a Kanban card is dragged over a column (called by column)
  handleOnDragEnter(e, stageValue) {
    this.setState({ draggedOverCol: stageValue });
  }

  //this is called when a Kanban card dropped over a column (called by card)
  handleOnDragEnd(e, project) {
    const updatedProjects = this.state.projects.slice(0);
    updatedProjects.find(projectObject => {
      return projectObject.name === project.name;
    }).project_stage = this.state.draggedOverCol;
    this.setState({ projects: updatedProjects });
    console.log(projectList);
  }

  render() {
    if (this.state.isLoading) {
      return <h3>Loading...</h3>;
    }

    return (
      <div>
        {this.columns.map(column => {
          return (
            <KanbanColumn
              name={column.name}
              stage={column.stage}
              projects={this.state.projects.filter(project => {
                return parseInt(project.project_stage, 10) === column.stage;
              })}
              onDragEnter={this.handleOnDragEnter}
              onDragEnd={this.handleOnDragEnd}
              key={column.stage}
            />
          );
        })}
      </div>
    );
  }
}

/*
 * The Kanban Board Column React component
 */
class KanbanColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mouseIsHovering: false };
  }

  componentWillReceiveProps(nextProps) {
    this.state = { mouseIsHovering: false };
  }

  generateKanbanCards() {
    return this.props.projects.slice(0).map(project => {
      return (
        <KanbanCard
          project={project}
          key={project.name}
          onDragEnd={this.props.onDragEnd}
        />
      );
    });
  }

  render() {
    const columnStyle = {
      display: "inline-block",
      verticalAlign: "top",
      marginRight: "5px",
      marginBottom: "5px",
      paddingLeft: "5px",
      paddingTop: "0px",
      width: "230px",
      textAlign: "center",
      backgroundColor: this.state.mouseIsHovering ? "#d3d3d3" : "#f0eeee"
    };
    return (
      <div
        style={columnStyle}
        onDragEnter={e => {
          this.setState({ mouseIsHovering: true });
          this.props.onDragEnter(e, this.props.stage);
        }}
        onDragExit={e => {
          this.setState({ mouseIsHovering: false });
        }}
      >
        <h4>
          {this.props.stage}. {this.props.name} ({this.props.projects.length})
        </h4>
        {this.generateKanbanCards()}
        <br />
        <KabanInput stage={this.props.stage} />
      </div>
    );
  }
}

/*
 * The Kaban Board Card Input component
 */
class KabanInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projects: [] };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ projects: projectList });
  }

  handleSubmit() {
    projects.push({
      description: this.state.value,
      project_stage: this.props.stage
    });
    event.preventDefault();
  }

  render() {
    const inputStyle = {
      borderRadius: "4px"
    };
    const formStyle = {
      padding: "4px",
      width: "100%"
    };
    return (
      <form style={formStyle}>
        <input style={inputStyle} type="text" />
        <input type="submit" value="Envoyer" />
      </form>
    );
  }
}

/*
 * The Kanban Board Card component
 */
class KanbanCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cardStyle = {
      backgroundColor: "#f9f7f7",
      paddingLeft: "0px",
      paddingTop: "5px",
      paddingBottom: "5px",
      marginLeft: "0px",
      marginRight: "5px",
      marginBottom: "5px"
    };

    return (
      <div
        style={cardStyle}
        draggable={true}
        onDragEnd={e => {
          this.props.onDragEnd(e, this.props.project);
        }}
      >
        <div>{this.props.project.description}</div>
        <div>
          <img src="e" height="10px" />
        </div>
      </div>
    );
  }
}
