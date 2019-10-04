import './style.scss';
import * as React from 'react';
import classnames from 'classnames';

import { IWaybackItem } from '../../types';

interface IProps {
    data:IWaybackItem
    isActive:boolean

    toggleSelect?:(releaseNum:number)=>void
    onClick?:(releaseNum:number)=>void
}

interface IState {

}

class ListViewCard extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);
    }

    render(){

        const { data, isActive, onClick, toggleSelect } = this.props;

        const cardClass = classnames('list-card trailer-half', {
            // 'is-active' indicates if is viewing this release on map
            'is-active': isActive,
            // 'is-highlighted' indicates if this release has local change
            'is-highlighted': false,
            // 'is-selected' indicates if this release is being selected
            'is-selected': false
        });

        return (
            <div className={cardClass}>
                <a className='margin-left-half link-light-gray cursor-pointer' onClick={onClick.bind(this, data.releaseNum)}>{data.releaseDateLabel}</a>

                <div className='add-to-webmap-btn inline-block cursor-pointer right' onClick={toggleSelect.bind(this, data.releaseNum)} data-tooltip-content='Add this release to an ArcGIS Online Map' data-tooltip-content-alt='Remove this release from your ArcGIS Online Map'></div>

                <div className='open-item-btn icon-ui-link-external margin-right-half inline-block cursor-pointer right link-light-gray' data-tooltip-content='Learn more about this release...'></div>
            </div>
        );
    }

};

export default ListViewCard;