/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import { activeWaybackItemSelector } from '@store/Wayback/reducer';
import { saveReleaseNum4ActiveWaybackItemInURLQueryParam } from '@utils/UrlSearchParam';

import WaybackLayer from './WaybackLayer';

// import IMapView from 'esri/views/MapView';
import MapView from '@arcgis/core/views/MapView';

type Props = {
    mapView?: MapView;
};

const WaybackLayerContainer: React.FC<Props> = ({ mapView }: Props) => {
    const activeWaybackItem = useSelector(activeWaybackItemSelector);

    useEffect(() => {
        saveReleaseNum4ActiveWaybackItemInURLQueryParam(
            activeWaybackItem.releaseNum
        );
    }, [activeWaybackItem]);

    return (
        <WaybackLayer mapView={mapView} activeWaybackItem={activeWaybackItem} />
    );
};

export default WaybackLayerContainer;
