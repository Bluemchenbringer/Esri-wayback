import React, { useContext } from 'react';

import {
    useSelector,
    useDispatch,
    // batch
} from 'react-redux';

import {
    releaseNum4SelectedItemsSelector,
    releaseNum4ItemsWithLocalChangesSelector,
    activeWaybackItemSelector,
    allWaybackItemsSelector,
    setPreviewWaybackItem,
    setActiveWaybackItem,
    toggleSelectWaybackItem,
} from '@store/Wayback/reducer';

import { shouldOnlyShowItemsWithLocalChangeSelector } from '@store/UI/reducer';

import ListView from './index';
import { AppContext } from '@contexts/AppContextProvider';
import { Spacing } from '../SharedUI';
import { addToDownloadList } from '@store/DownloadMode/thunks';
import { IWaybackItem } from '@typings/index';

type Props = {
    children?: React.ReactNode;
};

const ListViewWrapper: React.FC<Props> = ({ children }) => {
    return (
        <div
            className="leader-half fancy-scrollbar"
            style={{
                position: 'relative',
                flexGrow: 1,
                flexShrink: 0,
                flexBasis: 200,
                overflowX: 'hidden',
                overflowY: 'auto',
            }}
        >
            <Spacing paddingLeft="1rem" paddingRight="1rem">
                {children}
            </Spacing>
        </div>
    );
};

const ListViewContainer = () => {
    const dispatch = useDispatch();

    const { isMobile } = useContext(AppContext);

    const waybackItems: IWaybackItem[] = useSelector(allWaybackItemsSelector);
    const activeWaybackItem: IWaybackItem = useSelector(
        activeWaybackItemSelector
    );

    const rNum4SelectedWaybackItems: number[] = useSelector(
        releaseNum4SelectedItemsSelector
    );
    const rNum4WaybackItemsWithLocalChanges: number[] = useSelector(
        releaseNum4ItemsWithLocalChangesSelector
    );

    const shouldOnlyShowItemsWithLocalChange = useSelector(
        shouldOnlyShowItemsWithLocalChangeSelector
    );

    return (
        <ListViewWrapper>
            <ListView
                isMobile={isMobile}
                waybackItems={waybackItems}
                activeWaybackItem={activeWaybackItem}
                shouldOnlyShowItemsWithLocalChange={
                    shouldOnlyShowItemsWithLocalChange
                }
                rNum4SelectedWaybackItems={rNum4SelectedWaybackItems}
                rNum4WaybackItemsWithLocalChanges={
                    rNum4WaybackItemsWithLocalChanges
                }
                onClick={(releaseNum: number) => {
                    dispatch(setActiveWaybackItem(releaseNum));
                }}
                onMouseEnter={(releaseNum: number) => {
                    dispatch(setPreviewWaybackItem(releaseNum));
                }}
                onMouseOut={() => [dispatch(setPreviewWaybackItem())]}
                toggleSelect={(releaseNum: number) => {
                    dispatch(toggleSelectWaybackItem(releaseNum));
                }}
                downloadButtonOnClick={(releaseNum: number) => {
                    dispatch(
                        addToDownloadList({
                            releaseNumber: releaseNum,
                            extent: null,
                            zoomLevel: 0,
                        })
                    );
                }}
            />
        </ListViewWrapper>
    );
};

export default ListViewContainer;
