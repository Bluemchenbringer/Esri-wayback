import React, {useCallback} from 'react';

import { IWaybackItem } from '../../types';

import {
    LayerSelector
} from '../'

type Props = {
    waybackItems: IWaybackItem[];
    rNum4AnimationFrames: number[];
    rNum2Exclude: number[];
    activeItem: IWaybackItem;
    onSelect: (data: IWaybackItem) => void;
    toggleFrame: (rNum:number) => void;
};

const FramesSeletor:React.FC<Props> = ({
    waybackItems,
    rNum4AnimationFrames,
    rNum2Exclude,
    activeItem,
    onSelect,
    toggleFrame
}:Props) => {

    const getList = () => {
        const items = waybackItems
            .filter((d) => {
                return (
                    rNum4AnimationFrames.indexOf(d.releaseNum) > -1
                );
            })
            .map((d) => {
                const { releaseDateLabel, itemID, releaseNum } = d;
                const isSelected =
                    activeItem && activeItem.itemID === itemID;

                const isExcluded = rNum2Exclude.indexOf(releaseNum) > -1;

                const checkbox = isExcluded 
                    ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16">
                            <path d="M14.071 15a.929.929 0 0 0 .929-.929V2.93a.929.929 0 0 0-.929-.93H2.93a.929.929 0 0 0-.93.929V14.07a.929.929 0 0 0 .929.929zM3 3h11v11H3z" fill="#fff"/><path fill="none" d="M0 0h16v16H0z"/>
                        </svg>
                    )
                    : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16">
                            <path d="M14.071 15a.929.929 0 0 0 .929-.929V2.93a.929.929 0 0 0-.929-.93H2.93a.929.929 0 0 0-.93.929V14.07a.929.929 0 0 0 .929.929zM3 3h11v11H3zm9.262 2l.738.738-5.443 5.43-2.822-2.822.738-.738 2.084 2.088z" fill="#fff"/><path fill="none" d="M0 0h16v16H0z"/>
                        </svg>
                    )

                return (
                    <LayerSelector
                        // className={classNames}
                        key={itemID}
                        isSelected={isSelected}
                        onClick={onSelect.bind(this, d)}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <div className='margin-right-half'
                                style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                onClick={(evt)=>{
                                    evt.stopPropagation();
                                    toggleFrame(releaseNum)
                                }}
                            >
                                { checkbox }
                            </div>
                            
                            <span>{releaseDateLabel}</span>
                        </div>
                        
                    </LayerSelector>
                );
            });

        return (
            <div
                style={{
                    width: '100%',
                }}
            >
                <div>
                    <span className="font-size--2">
                        Animation Frames
                    </span>
                </div>
                {items}
            </div>
        );
    };

    return getList()
}

export default FramesSeletor
