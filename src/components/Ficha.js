import React, {Component} from 'react';
import appState from '../state/AppState';


import '../css/main.css';
import Modal from "./Modal";
import $ from "jquery";

class Ficha extends Component{
    constructor(props)
    {
        super(props);
        this.state={
            content: [],
            details: {},
            show: false
        }
    }


    async show_modal_info (id) {
        appState.modal_details = {};
        await fetch("https://itunes.apple.com/lookup?id="+id)
            .then((response) => response.json())
            .then(data => {
                if (data !== undefined){
                    this.setState({ details: data });
                    appState.modal_details = data;
                    this.showModal(id, data);
                } else {
                    alert("No ha sido posible cargar la información");
                }
            });
    };

    showModal = (id, data) => {

        $(this).addClass('display-none');
        $(this).removeClass('display-block');

        $('.modal').each(function(){
            if ($(this).attr("data-info") == "modal_details_" + id){
                $(this).removeClass('display-none');
                $(this).addClass('display-block');
            }
        })
    };

    hideModal = () => {
        $('.modal').removeClass('display-block');
        $('.modal').addClass('display-none');
    };

    render()
    {

        let order = this.props.order;
        let ficha = this.props.ficha;

        const podcast_selected = appState.filter.podcast_selected;

        return(
            <div className={"wrapper-card col-md-3 wrapper-card-"+order} key={order} data-order={order} data-category={ficha.category.attributes.label}>
                <div className="card" onClick={() => {this.show_modal_info(ficha.id.attributes["im:id"]);}}>
                    <img src={ficha["im:image"][2].label} className="card-image" alt="..."></img>
                    <div className="card-body">
                        <h5 className="card-title">{order+1}. {ficha.title.label}</h5>
                    </div>
                </div>
                <Modal key_order_num={order} details_id={'modal_details_'+ficha.id.attributes["im:id"]} show={this.state.show} details={appState.modal_details} handleClose={this.hideModal}>
                    <p>Modal</p>
                </Modal>
            </div>
        )
    }

}

export default Ficha;