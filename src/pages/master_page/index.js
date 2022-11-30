import fetchApi from "../../util/fetchApi";
import React from "react";
import Teams from "../../components/teams";
import Features from "../../components/features";
import Cards from "../../components/cards";
import Games from "../../components/games";
import Sets from "../../components/sets";
import Varieties from "../../components/varieties";
import "./style.css"




export default class MasterPage extends React.Component {

    constructor (props) {
        super(props);
        
        this.state = {
            inFlight: null,
            activeView: 'view',
            activePage: this.props.target,
            resultData: null
        }

        this.handleDelete =  this.handleDelete.bind(this)
        
    }

    componentDidMount () {
        this.fetchResources();
    }

    componentDidUpdate () {
    }

    drawHeader (title)
    {
        return (
            <>
                <div className="header_master">
                    <div />
                    <span>{title}</span>
                </div>
            </>
        )
    }

    

    async fetchResources () {
        try {
            this.setState({
                inFlight: 'fetching',
                resultData: await fetchApi('get', `/v1/${this.state.activePage}`),
                inFlight: 'done'
            })
        } catch (error) {
            this.setState({
                inFlight: 'error'
            })
        }
        
    }

    async handleDelete (id) {
        try {
            await fetchApi('delete', `/v1/games/${id}`);
            await this.fetchResources();
        } catch (error) {
            console.log(error)
        } 
    }  

    render () {
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
            {console.log("draw")}
            switch(this.state.activePage) {
                case "cards":
                    return (
                        <>
                            { this.drawHeader("Cards") }
                            <Cards />
                        </>
  
                    ) 
                break;

                case "features":
                    return (
                        <>
                            { this.drawHeader("Features") }
                            <Features />
                        </>
                    ) 
                break;
                case "games":
                    return (
                        <>
                            { this.drawHeader("Games") }
                        
                            <Games 
                                data = {this.state.resultData}
                                handleDelete = {this.handleDelete}
                            />
                        </>
                       
                    ) 
                break;
                case "sets":
                    return (
                        <>
                            { this.drawHeader("Sets") }
                            <Sets />
                        </>
                    ) 
                break;

                case "teams":
                    return (
                        <>
                            { this.drawHeader("Teams") }
                            <Teams />
                        </>    
                    ) 
                break;
                case "varieties":
                    return (
                        <>
                            { this.drawHeader("Varieties") }
                            <Varieties />
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