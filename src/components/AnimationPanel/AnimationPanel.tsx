import React, { useCallback, useEffect, useRef, useState } from 'react';

import MapView from '@arcgis/core/views/MapView';

import { FrameData, generateFrames } from './generateFrames4GIF';

import Resizable from './Resizable';
import ImageAutoPlay from './ImageAutoPlay';
import LoadingIndicator from './LoadingIndicator';

import { whenTrue, whenFalse } from '@arcgis/core/core/watchUtils';
import { IWaybackItem } from '../../types';

// import shortid from 'shortid'

type Props = {
    waybackItems4Animation: IWaybackItem[]
    mapView?: MapView;
};

// import gifshot from 'gifshot';

type CreateGIFCallBack = (response: {
    // image - Base 64 image
    image: string;
    // error - Boolean that determines if an error occurred
    error: boolean;
    // errorCode - Helpful error label
    errorCode: string;
    // errorMsg - Helpful error message
    errorMsg: string;
}) => void;

type GetFramesParams = {
    releaseNums:number[], 
    container: HTMLDivElement, 
    mapView: MapView,
}

// width of Gutter and Side Bar, need to calculate this dynamically
export const PARENT_CONTAINER_LEFT_OFFSET = 350;

const getFrames = async ({
    releaseNums, 
    container, 
    mapView
}:GetFramesParams):Promise<FrameData[]> => {

    const elemRect = container.getBoundingClientRect();
    // console.log(elemRect)

    const { offsetHeight, offsetWidth } = container;

    const frameData = await generateFrames({
        frameRect: {
            screenX: elemRect.left - PARENT_CONTAINER_LEFT_OFFSET,
            screenY: elemRect.top,
            width: offsetWidth,
            height: offsetHeight,
        },
        mapView,
        releaseNums
    });

    return frameData;
};

const containerRef = React.createRef<HTMLDivElement>();

const AnimationPanel: React.FC<Props> = ({ waybackItems4Animation, mapView }: Props) => {

    // array of frame images as dataURI string 
    const [frames, setFrames] = useState<FrameData[]>();

    const loadingWaybackItems4AnimationRef = useRef<boolean>(false);

    const getAnimationFramesDelay = useRef<NodeJS.Timeout>();

    const waybackItems4AnimationRef = useRef<IWaybackItem[]>();

    const getAnimationFrames = useCallback(
        () => {
            // in milliseconds
            const DELAY_TIME = 1500;

            clearTimeout(getAnimationFramesDelay.current)

            const waybackItems = waybackItems4AnimationRef.current;

            if(!waybackItems || !waybackItems.length || loadingWaybackItems4AnimationRef.current){
                return;
            }

            getAnimationFramesDelay.current = setTimeout(async()=>{

                try {
                    const releaseNums = waybackItems.map(d=>d.releaseNum)

                    const frameData = await getFrames({
                        releaseNums,
                        container: containerRef.current,
                        mapView,
                    });
    
                    setFrames(frameData);

                } catch(err){
                    console.error(err);
                }

            }, DELAY_TIME)
        },
        [waybackItems4Animation],
    );

    const resizableOnChange = useCallback(()=>{
        
        setFrames(null);

        getAnimationFrames()
    }, []);

    useEffect(() => {
        waybackItems4AnimationRef.current = waybackItems4Animation;

        loadingWaybackItems4AnimationRef.current = false;

        getAnimationFrames()

    }, [waybackItems4Animation]);
    
    useEffect(()=>{
        const onUpdating = whenFalse(mapView, 'stationary', ()=>{
            loadingWaybackItems4AnimationRef.current = true;
            setFrames(null);
        })

        return ()=>{
            // onStationary.remove();
            onUpdating.remove();
        }
    }, []);

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: "rgba(0,0,0,.25)",
                    pointerEvents: 'none'
                }}
            >
            </div>

            <Resizable
                onChange={resizableOnChange}
                containerRef={containerRef}
            >
                {
                    frames && frames.length 
                    ?  (
                        <ImageAutoPlay 
                            frames={frames}
                        />
                    ) 
                    : (
                        <LoadingIndicator />
                    )
                }
            </Resizable>
        </>
    );
};

export default AnimationPanel;
