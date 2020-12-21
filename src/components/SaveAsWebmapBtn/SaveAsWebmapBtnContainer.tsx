import React, {
    useContext,
    useEffect
} from 'react';

import {
    useSelector,
    useDispatch
} from 'react-redux';

import { isSwipeWidgetOpenSelector } from '../../store/reducers/SwipeView';

import {
    releaseNum4SelectedItemsSelector,
    releaseNum4SelectedItemsCleaned
} from '../../store/reducers/WaybackItems';

import {
    AppContext
} from '../../contexts/AppContextProvider';

import {
    setShouldOpenSaveWebMapDialog
} from '../../utils/LocalStorage';

import SaveAsWebmapBtn from './index'
import { isSaveAsWebmapDialogOpenToggled } from '../../store/reducers/UI';
import { saveReleaseNum4SelectedWaybackItemsInURLQueryParam } from '../../utils/UrlSearchParam';

const SaveAsWebmapBtnContainer = () => {

    const dispatch = useDispatch();

    const {
        userSession,
        oauthUtils
    } = useContext(AppContext);

    const rNum4SelectedWaybackItems: number[] = useSelector(releaseNum4SelectedItemsSelector);

    const isDisabled: boolean = useSelector(isSwipeWidgetOpenSelector);

    const clearAllBtnOnClick = ()=>{
        dispatch(releaseNum4SelectedItemsCleaned())
    }

    const onClickHandler = ()=>{
        if (!userSession) {
            // set the ShouldOpenSaveWebMapDialog flag in local storage as true, when the app knows to open the dialog after user is signed in
            setShouldOpenSaveWebMapDialog();

            // sign in first before opening the save as web map dialog because the userSession is required to create web map
            oauthUtils.sigIn();

        } else {
            dispatch(isSaveAsWebmapDialogOpenToggled())
        }
    }

    useEffect(()=>{
        saveReleaseNum4SelectedWaybackItemsInURLQueryParam(rNum4SelectedWaybackItems)
    }, [rNum4SelectedWaybackItems])

    return (
        <SaveAsWebmapBtn
            selectedWaybackItems={rNum4SelectedWaybackItems}
            disabled={isDisabled}
            onClick={onClickHandler}
            clearAll={clearAllBtnOnClick}
        />
    )
}

export default SaveAsWebmapBtnContainer
