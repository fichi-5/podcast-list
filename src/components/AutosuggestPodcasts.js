import React from 'react';
import Autosuggest from 'react-autosuggest';
import { defaultTheme } from 'react-autosuggest/dist/theme';
import theme from '../css/main.css';
import appState from '../state/AppState';

import $ from 'jquery';

class AutosuggestPodcasts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            suggestions: []
        };
    }
    onSuggestionsFetchRequested=({value})=>{
        //setPodcasts(this.filtrarPodcasts(value));
        this.setState({
            suggestions: this.filtrarPodcasts(value)
        });
    }

    filtrarPodcasts=(value)=>{
        const inputValue=value.trim().toLowerCase();
        const inputLength=inputValue.length;

        var filtrado=this.props.items.filter((podcast)=>{
            var textoCompleto=podcast.podcast + " - " +podcast.author;

            if(textoCompleto.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(inputValue)){
                return podcast;
            }
        });

        return inputLength===0 ? [] : filtrado;
    }

    onSuggestionsClearRequested = () =>{
        this.setState({
            suggestions: []
        });
        $('.wrapper-card').show();
    }

    getSuggestionValue=(suggestion)=>{
        return `${suggestion.podcast} - ${suggestion.author}`;
    }

    renderSuggestion=(suggestion)=>(
        <div className='sugerencia' onClick={()=>this.seleccionarPodcast(suggestion)}>
            {`${suggestion.podcast} - ${suggestion.author}`}
        </div>
    );

    seleccionarPodcast=(podcast)=>{
        //setPodcastSeleccionado(podcast);
        this.setState({
            suggestions: podcast
        });

    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
        $('.wrapper-card').removeClass('display-none');
    };


    eventEnter=(e, {suggestion})=>{
        let info_display = "";
        if(e.key == "Enter"){
            var split = e.target.value.split('-');
            var podcast ={
                podcast: split[0].trim(),
                author: split[1].trim(),
            };
            this.seleccionarPodcast(podcast);
            info_display = podcast;
        } else {
            this.seleccionarPodcast(suggestion);
            info_display = suggestion;
        }


        $('.wrapper-card').addClass('display-none');
        $('.wrapper-card-'+info_display.index).removeClass('display-none');
    }

    render() {
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Search...',
            value,
            onChange: this.onChange
        };

        // Finally, render it!
        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
                theme={{...defaultTheme,theme}}
                onSuggestionSelected={this.eventEnter}
            />
        );
    }
}
export default AutosuggestPodcasts;