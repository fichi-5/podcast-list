import React, {Component} from 'react';
import moment from 'moment';

import appState from './state/AppState';

import Ficha from './components/Ficha';
import AutosuggestPodcasts from './components/AutosuggestPodcasts';

import $ from 'jquery';

import './css/main.css';

class App extends Component{
    constructor(){
        super();
        this.state={
            content: [],
            categories: [],
            autosuggestPodcasts: []
        }
    }

    componentDidMount()
    {
        if (!JSON.parse(localStorage.getItem('total_podcast_info')) || moment().diff(JSON.parse(localStorage.getItem('total_podcast_info')).time, 'days') >= 1) {
            fetch('https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json')
                .then((response) => response.json())
                .then(data => {
                    /*console.log("INFO DATA");
                    console.log(data.feed.entry);*/

                    this.setState({
                        content: data.feed.entry
                    })

                    let categories = {};
                    let autosuggest_array = [];
                    /*data.feed.entry.map((item, i) => (
                        categories[item.category.attributes.label] = categories[item.category.attributes.label] ? categories[item.category.attributes.label] + 1 : 1
                    ));*/
                    data.feed.entry.map(function (item, i) {
                        categories[item.category.attributes.label] = categories[item.category.attributes.label] ? categories[item.category.attributes.label] + 1 : 1;
                        autosuggest_array[i] = {index: i, podcast: item.title.label, author: item["im:artist"].label}
                    });
                    this.setState({categories: categories});
                    this.setState({autosuggestPodcasts: autosuggest_array});

                    localStorage.setItem('total_podcast_info', JSON.stringify({
                        data: data.feed.entry,
                        time: moment(new Date())
                    }));
                });
        } else {
            this.setState({
                content: JSON.parse(localStorage.getItem('total_podcast_info')).data
            })
            /*console.log("INFO DATA");
            console.log(JSON.parse(localStorage.getItem('total_podcast_info')).data);*/
            let categories = {};
            let autosuggest_array = [];
            /*data.feed.entry.map((item, i) => (
                categories[item.category.attributes.label] = categories[item.category.attributes.label] ? categories[item.category.attributes.label] + 1 : 1
            ));*/
            JSON.parse(localStorage.getItem('total_podcast_info')).data.map(function (item, i) {
                categories[item.category.attributes.label] = categories[item.category.attributes.label] ? categories[item.category.attributes.label] + 1 : 1;
                autosuggest_array[i] = {index: i, podcast: item.title.label, author: item["im:artist"].label}
            });
            this.setState({categories: categories});
            this.setState({autosuggestPodcasts: autosuggest_array});
        }
    }

    filterCategory(item){
        $('.wrapper-card').hide();
        $('.btn-categories').removeClass('btn-selected');
        if (appState.filter.category_selected != "" && appState.filter.category_selected == item) {
            //this.state.category_selected = "";
            appState.filter.category_selected = "";
            $('.wrapper-card').show();
        } else {
            //this.state.category_selected = item;
            appState.filter.category_selected = item;
            $("div").find("[data-category='" + item + "']").each( function(){
                $(this).show();
            });
            $('.btn-'+item.replaceAll(" ", "-")).addClass('btn-selected');
        }
    }

    hideModal = () => {
        appState.show_modal = false;
        appState.modal_details = [];
    };

    render()
    {
        return(
            <div className="container mx-auto mt-4">
                <div className="mx-auto mt-4 mb-4 text-center">
                    <h1>Los PODCASTS más escuchados</h1>
                </div>
                <div className="nav-categories">
                    { Object.keys(this.state.categories).map((item, i) => (
                        <button key={i} className={"btn-categories btn-"+item.replaceAll(" ", "-")} onClick={() => this.filterCategory(item)}>{item}</button>
                    ))}
                </div>
                <div className="bar-autosuggest">
                    <p>Escriba el nombre de un podcast o un autor: </p>
                    <AutosuggestPodcasts items={this.state.autosuggestPodcasts} />
                    {/*<AutoCompletePodcasts dataSource={this.state.content}/>*/}
                </div>
                <div className="row">
                    {this.state.content.map((item, i) => (
                        <Ficha key={i} ficha={item} order={i} category={item.category.attributes.label} />
                    ))}
                </div>
            </div>
        )
    }

}

export default App;