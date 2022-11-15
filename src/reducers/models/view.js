import { viewState as viewStateCore } from "_core/reducers/models/view";

export const viewState = viewStateCore.mergeDeep({
    layerMenuOpen: false,
    layerManager: {
        isOpen: false,
        filter: ""
    }
});
