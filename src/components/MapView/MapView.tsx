import '@arcgis/core/assets/esri/themes/dark/main.css';
import React, { useEffect, useRef } from 'react';

import MapView from '@arcgis/core/views/MapView';
import EsriMap from '@arcgis/core/Map';
import { when } from '@arcgis/core/core/reactiveUtils';
import { webMercatorToGeographic } from '@arcgis/core/geometry/support/webMercatorUtils';
import Extent from '@arcgis/core/geometry/Extent';

import { IExtentGeomety, IMapPointInfo } from '@typings/index';

// import { WAYBACK_LAYER_ID } from '../WaybackLayer/getWaybackLayer'
// import WMTSLayer from '@arcgis/core/layers/WMTSLayer';
// import LOD from '@arcgis/core/layers/support/LOD';

interface Props {
    initialExtent: IExtentGeomety;
    onUpdateEnd: (centerPoint: IMapPointInfo) => void;
    onExtentChange: (extent: IExtentGeomety) => void;
    children?: React.ReactNode;
}

const MapViewComponent: React.FC<Props> = ({
    initialExtent,
    onUpdateEnd,
    onExtentChange,
    children,
}: Props) => {
    // const stringifiedMapExtentRef = useRef<string>();

    const mapDivRef = React.useRef<HTMLDivElement>();

    const [mapView, setMapView] = React.useState<MapView>(null);

    const initMapView = () => {
        const view = new MapView({
            container: mapDivRef.current,
            map: new EsriMap(),
            extent: new Extent({
                ...initialExtent,
            }),
        });

        view.ui.remove(['zoom']);

        setMapView(view);

        view.when(() => {
            initWatchUtils(view);
        });
    };

    const initWatchUtils = async (view: MapView) => {
        // whenTrue(mapView, 'stationary', mapViewUpdateEndHandler);
        when(
            () => view.stationary === true,
            () => {
                const center = view?.center;

                if (!center) {
                    return;
                }

                const extent = webMercatorToGeographic(view.extent);

                // console.log('mapview update ended', center);

                const mapViewCenterPointInfo: IMapPointInfo = {
                    latitude: center.latitude,
                    longitude: center.longitude,
                    zoom: view.zoom, //getCurrZoomLevel(mapView),
                    geometry: center.toJSON(),
                };

                onUpdateEnd(mapViewCenterPointInfo);

                onExtentChange(extent.toJSON());
            }
        );
    };

    // const mapViewUpdateEndHandler = async () => {
    //     const center = mapView.center;

    //     if (!center) {
    //         return;
    //     }

    //     const extent = webMercatorToGeographic(mapView.extent);

    //     // console.log('mapview update ended', center);

    //     const mapViewCenterPointInfo: IMapPointInfo = {
    //         latitude: center.latitude,
    //         longitude: center.longitude,
    //         zoom: mapView.zoom, //getCurrZoomLevel(mapView),
    //         geometry: center.toJSON(),
    //     };

    //     onUpdateEnd(mapViewCenterPointInfo);

    //     onExtentChange(extent.toJSON());
    // };

    useEffect(() => {
        // loadCss();
        initMapView();
    }, []);

    // useEffect(() => {
    //     if (mapView) {
    //         initWatchUtils();
    //     }
    // }, [mapView]);

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
                ref={mapDivRef}
            ></div>

            {mapView
                ? React.Children.map(children, (child) => {
                      return React.cloneElement(
                          child as React.ReactElement<any>,
                          {
                              mapView,
                          }
                      );
                  })
                : null}
        </>
    );
};

// // calculate current zoom level using current map scale and tile infos from Wayback WMTS layer
// export const getCurrZoomLevel = (mapView:MapView):number =>{

//     const mapScale = mapView.scale;

//     // get active sublayer from wayback WMTS layer
//     const { activeLayer } = mapView.map.findLayerById(WAYBACK_LAYER_ID) as WMTSLayer;

//     // A TileLayer has a number of LODs (Levels of Detail).
//     // Each LOD corresponds to a map at a given scale or resolution.
//     const LODS = activeLayer.tileMatrixSets.getItemAt(0).tileInfo.lods as LOD[];

//     for(let LOD of LODS){
//         const { level, scale } = LOD;

//         if(scale < (mapScale * Math.sqrt(2)) && scale > (mapScale / Math.sqrt(2))){
//             return level;
//         }
//     }

//     return -1;
// }

export default MapViewComponent;
