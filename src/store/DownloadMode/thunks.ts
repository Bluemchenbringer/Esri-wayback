import { IExtent } from '@esri/arcgis-rest-request';
import { StoreDispatch, StoreGetState } from '../configureStore';
import { batch } from 'react-redux';
import {
    DownloadJob,
    downloadJobCreated,
    isDownloadDialogOpenToggled,
} from './reducer';
import { generate } from 'shortid';
import { getTileEstimationsInOutputBundle } from '@services/export-wayback-bundle/getTileEstimationsInOutputBundle';

type AddToDownloadListParams = {
    /**
     * user selected wayback release number
     */
    releaseNum: number;
    /**
     * current map zoom level
     */
    zoomLevel: number;
    /**
     * current map extent
     */
    extent: IExtent;
};

export const addToDownloadList =
    ({ releaseNum, zoomLevel, extent }: AddToDownloadListParams) =>
    (dispatch: StoreDispatch, getState: StoreGetState) => {
        // console.log(waybackItem, zoomLevel, extent);

        const { WaybackItems } = getState();

        const { byReleaseNumber } = WaybackItems;

        const tileEstimations = getTileEstimationsInOutputBundle(
            extent,
            zoomLevel
        );

        // const totalTiles = tileEstimations.reduce((total, curr)=>{
        //     return total + curr.count
        // }, 0)

        const maxZoomLevel = tileEstimations[tileEstimations.length - 1].level;

        const downloadJob: DownloadJob = {
            id: generate(),
            waybackItem: byReleaseNumber[releaseNum],
            minZoomLevel: zoomLevel,
            maxZoomLevel,
            tileEstimations,
            // totalTiles,
            levels: [zoomLevel, maxZoomLevel],
            extent,
            status: 'not started',
            createdTime: new Date().getTime(),
        };

        batch(() => {
            dispatch(downloadJobCreated(downloadJob));
            dispatch(isDownloadDialogOpenToggled());
        });
    };
