import {
    ENTITY_CREATE,
    ENTITY_UPDATE,
    ENTITY_FETCH,
    SELECT_ENTITY_ITEM,
    CLEAR_ENTITY_LIST
} from '../constants/actionType';


let initialState = {
    wells: [],
    docs: [],
    selectedItem: {
        well: {},
        doc: {},
    }
};

/**
 * A reducer takes two arguments, the current state and an action.
 */
export default function (state, action) {
    let newState = state || initialState;

    switch (action.type) {
        case ENTITY_CREATE:
            newState[action.entity] = Object.assign({}, state, action.data);
            
return newState;

        case ENTITY_UPDATE:
            newState[action.entity] = Object.assign({}, state, action.data);
            
return newState;

        case ENTITY_FETCH:
            newState[action.entity] = action.data.data;

return Object.assign({}, newState);

            
        case SELECT_ENTITY_ITEM:
            newState.selectedItem[action.entity] = Object.assign({}, state, action.data);
            
return newState;

        case CLEAR_ENTITY_LIST:
            newState[action.entity] = {};
            
return newState;

        default:
            return newState;
    }
}