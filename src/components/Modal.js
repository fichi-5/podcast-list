import '../css/main.css';
import React, {Component} from "react";
import appState from '../state/AppState';
import ReactAudioPlayer from 'react-audio-player';

import $ from 'jquery';

class Modal extends Component{
    constructor(props)
    {
        super(props);
        this.state={
            show: false,
            details: this.props.details
        }
    }

    closeModal(){
        $('.modal').removeClass('display-block');
        $('.modal').addClass('display-none');
        appState.show_modal = false;
    }

    render(){
        const showHideClassName= appState.show_modal ? "display-block" : "display-none";
        const details = (this.props.details.results && this.props.details.results[0]) || {};

        return (
            <div className={"modal " + showHideClassName} tabIndex="-1" data-info={this.props.details_id}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{ details.trackName }</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.closeModal}></button>
                        </div>
                        <div className="modal-body">
                            <img src={ details.artworkUrl600 } className="card-image" alt="..."></img>
                            <p>{JSON.parse(localStorage.getItem('total_podcast_info')).data[this.props.key_order_num].summary.label}</p>
                            <ReactAudioPlayer
                                src={details.trackViewUrl}
                                autoPlay
                                controls
                            />
                        </div>
                        <div className="modal-footer">
                            <p>{ details.artistName }</p>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Modal;