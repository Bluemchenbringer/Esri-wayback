import { PartialRootState } from './configureStore';

import { initialUIState, UIState } from '../store/reducers/UI';
import {
    initialWaybackItemsState,
    WaybackItemsState,
} from '../store/reducers/WaybackItems';
import {
    initialSwipeViewState,
    SwipeViewState,
} from '../store/reducers/SwipeView';
import { IURLParamData, IWaybackItem } from '../types';
import { initialMapState, MapState } from './reducers/Map';
import { decodeURLParams } from '../utils/UrlSearchParam';

import {
    // getDefaultExtent,
    // getCustomPortalUrl,
    getShouldShowUpdatesWithLocalChanges,
    getShouldOpenSaveWebMapDialog,
} from '../utils/LocalStorage';

const urlParams: IURLParamData = decodeURLParams();

const getPreloadedState4UI = (urlParams: IURLParamData): UIState => {
    const shouldOnlyShowItemsWithLocalChange =
        urlParams.shouldOnlyShowItemsWithLocalChange ||
        getShouldShowUpdatesWithLocalChanges();

    const state: UIState = {
        ...initialUIState,
        shouldOnlyShowItemsWithLocalChange,
        isSaveAsWebmapDialogOpen: getShouldOpenSaveWebMapDialog(),
    };

    return state;
};

const getPreloadedState4WaybackItems = (
    waybackItems: IWaybackItem[],
    urlParams: IURLParamData
): WaybackItemsState => {
    const { rNum4SelectedWaybackItems, rNum4ActiveWaybackItem } = urlParams;

    const byReleaseNumber: {
        [key: number]: IWaybackItem;
    } = {};

    const allReleaseNumbers: number[] = [];

    waybackItems.forEach((item) => {
        const { releaseNum } = item;
        byReleaseNumber[releaseNum] = item;
        allReleaseNumbers.push(releaseNum);
    });

    const state: WaybackItemsState = {
        ...initialWaybackItemsState,
        byReleaseNumber,
        allReleaseNumbers,
        releaseNum4SelectedItems: rNum4SelectedWaybackItems || [],
        releaseNum4ActiveWaybackItem:
            rNum4ActiveWaybackItem || allReleaseNumbers[0],
    };

    return state;
};

const getPreloadedState4SwipeView = (
    urlParams: IURLParamData,
    waybackItems: IWaybackItem[]
): SwipeViewState => {
    const {
        isSwipeWidgetOpen,
        rNum4SwipeWidgetLeadingLayer,
        rNum4SwipeWidgetTrailingLayer,
        rNum4ActiveWaybackItem,
    } = urlParams;

    const state: SwipeViewState = {
        ...initialSwipeViewState,
        isSwipeWidgetOpen,
        releaseNum4LeadingLayer:
            rNum4SwipeWidgetLeadingLayer ||
            rNum4ActiveWaybackItem ||
            waybackItems[0].releaseNum,
        releaseNum4TrailingLayer:
            rNum4SwipeWidgetTrailingLayer ||
            waybackItems[waybackItems.length - 1].releaseNum,
    };

    return state;
};

const getPreloadedState4Map = (urlParams: IURLParamData): MapState => {
    const { mapExtent } = urlParams;

    const state: MapState = {
        ...initialMapState,
        mapExtent,
    };

    return state;
};

const getPreloadedState = async (
    waybackItems: IWaybackItem[]
): Promise<PartialRootState> => {
    const uiState: UIState = getPreloadedState4UI(urlParams);
    const waybackItemsState: WaybackItemsState = getPreloadedState4WaybackItems(
        waybackItems,
        urlParams
    );
    const swipeViewState: SwipeViewState = getPreloadedState4SwipeView(
        urlParams,
        waybackItems
    );
    const mapState: MapState = getPreloadedState4Map(urlParams);

    const preloadedState = {
        UI: uiState,
        WaybackItems: waybackItemsState,
        SwipeView: swipeViewState,
        Map: mapState,
    } as PartialRootState;

    return preloadedState;
};

export default getPreloadedState;
