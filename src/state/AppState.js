import React from 'react';
import { makeObservable, observable } from 'mobx'

class AppState {
    filter = {
        category_selected: "",
        podcast_selected: ""
    }

    show_modal= false;
    modal_details=[];

    constructor() {
    }
}

export default new AppState();