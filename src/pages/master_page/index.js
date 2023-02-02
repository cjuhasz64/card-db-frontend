import fetchApi from "../../util/fetchApi";
import React from "react";
import Teams from "../../components/teams";
import Features from "../../components/features";
import Cards from "../../components/cards";
import Games from "../../components/games";
import Sets from "../../components/sets";
import Varieties from "../../components/varieties";
import "./style.css"
import { v4 } from 'uuid';
import logger from '../../util/logger';

const foreignKeys = {
  'teams':['games'],
  'sets':['games'],
  'varieties':['sets'],
  'features':['teams'],
  'cards':['features','varieties', 'features_link', 'games', 'sets', 'teams']
}

export default class MasterPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      inFlight: null,
      activeView: 'view',
      activePage: this.props.target,
      resultData: null,
      foreignData: {}
    }

    this.handleDelete = this.handleDelete.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
  }

  componentDidMount() {
    this.fetchResources();
  }

  componentDidUpdate() {
  }

  drawHeader(title) {
    return (
      <>
        <div className="header_master">
          <div />
          <span>{title}</span>
        </div>
      </>
    )
  }

  async fetchResources() {
    try {
      this.setState({
        inFlight: 'fetching',
      })
      this.setState({
        resultData: await fetchApi('get', `/v1/${this.state.activePage}`),
      })
      if (Object.keys(foreignKeys).includes(this.state.activePage))
      {
        foreignKeys[this.state.activePage].forEach( async element => {
          let current = await fetchApi('get', `/v1/${element}`);
          if (foreignKeys[this.state.activePage].length > 1)
          {
            this.setState( prev => ({
              foreignData: {...prev.foreignData, [`${element}`]:current}
            }))
          } else {
            this.setState({
              foreignData: {[`${element}`]:current}
            })
          } 
        });
      }
      
      this.setState({
        inFlight: 'done'
      })
      logger('success', 'Fetch Resources')

    } catch (error) {
      logger('error', 'Fetch Resources')
      this.setState({
        inFlight: 'error'
      })
    }
  }

  async handleDelete(id) {
    try {
      await fetchApi('delete', `/v1/${this.state.activePage}/${id}`);
      logger('success', 'Delete')
      await this.fetchResources();
    } catch (error) {
      logger('error', `Delete ${error}`)
    }
  }

  async handleCreate(data, endpoint) {
    if (endpoint) {
      try {
        await fetchApi('post', `/v1/${endpoint}`, data);
        logger('success', 'Create')
        await this.fetchResources();
      } catch (error) {
        logger('error', `Create ${error}`)
      }
    } else {
      try {
        await fetchApi('post', `/v1/${this.state.activePage}`, data);
        logger('success', 'Create')
        await this.fetchResources();
      } catch (error) {
        logger('error', `Create ${error}`)
      }
    }
    
  }

  async handleCreateLink (linkData, primaryLinkId, primaryLinkTable) {
    try {
      Object.keys(linkData).forEach(table => {
        var preparedData = {[`${primaryLinkTable}_id`]:`${primaryLinkId}`};
        linkData[table].forEach(element => {
          preparedData[`${table}_id`] = element.value;
          this.handleCreate(preparedData, `${table}_link`)
        });  
      });
      logger('success', 'Link')
    } catch (error) {
      logger('error', `Link - ${error}`)
    }
  }

  async handleUpdate(data, recreate, linkData, primaryTable) {
    var temp = {...data};
    temp['id'] = v4();
    if (recreate) {
      try {
        await fetchApi('delete', `/v1/${this.state.activePage}/${data['id']}`, data);
        await fetchApi('post', `/v1/${this.state.activePage}`, temp);
        if (linkData) await this.handleCreateLink(linkData, temp['id'], primaryTable)
        await this.fetchResources();
      } catch (error) {
        logger('error', `Update ${error}`)
      }
    } else {
      try {
        await fetchApi('put', `/v1/${this.state.activePage}/${data['id']}`, data);
        await this.fetchResources();
      } catch (error) {
        logger('error', `Update ${error}`)
      }
    }
  }

  render() {
    if (this.state.inFlight === 'fetching') {
      return (
        <div>fetching lol..</div>
      )
    }

    if (this.state.inFlight === 'error') {
      return (
        <div>error fetching lol..</div>
      )
    }

    if (this.state.inFlight === 'done') {
      switch (this.state.activePage) {
        case "cards":
          return (
            <>
              {this.drawHeader("Cards")}
              <Cards 
                data={this.state.resultData}
                foreignData={this.state.foreignData}
                handleDelete={this.handleDelete}
                handleUpdate={this.handleUpdate}
                handleCreate={this.handleCreate}
                handleCreateLink={this.handleCreateLink}
              />
            </>
          )
          break;

        case "features":
          return (
            <>
              {this.drawHeader("Features")}
              <Features 
                data={this.state.resultData}
                foreignData={this.state.foreignData}
                handleDelete={this.handleDelete}
                handleUpdate={this.handleUpdate}
                handleCreate={this.handleCreate}
              />
            </>
          )
          break;
        case "games":
          return (
            <>
              {this.drawHeader("Games")}
              <Games
                data={this.state.resultData}
                handleDelete={this.handleDelete}
                handleUpdate={this.handleUpdate}
                handleCreate={this.handleCreate}
              />
            </>

          )
          break;
        case "sets":
          return (
            <>
              {this.drawHeader("Sets")}
              <Sets 
                data={this.state.resultData}
                foreignData={this.state.foreignData}
                handleDelete={this.handleDelete}
                handleUpdate={this.handleUpdate}
                handleCreate={this.handleCreate}
              />
            </>
          )
          break;

        case "teams":
          return (
            <>
              {this.drawHeader("Teams")}
              <Teams
                data={this.state.resultData}
                foreignData={this.state.foreignData}
                handleDelete={this.handleDelete}
                handleUpdate={this.handleUpdate}
                handleCreate={this.handleCreate}
              />
            </>
          )
          break;
        case "varieties":
          return (
            <>
              {this.drawHeader("Varieties")}
              <Varieties 
                data={this.state.resultData}
                foreignData={this.state.foreignData}
                handleDelete={this.handleDelete}
                handleUpdate={this.handleUpdate}
                handleCreate={this.handleCreate}
              />
            </>
          )
          break;
      }
      return (
        // view page by default
        <div></div>
      )
    }


  }



}   