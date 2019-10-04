import './style.scss';
import * as React from 'react';

import WaybackManager from '../../core/WaybackManager';

import Gutter from '../Gutter';
import Map from '../Map';
import Modal from '../ModalAboutApp';
import ListView from '../ListView';

import { IWaybackItem } from '../../types';

interface IWaybackItemsReleaseNum2IndexLookup {
    [key:number]:number
};

interface IProps {

}

interface IState {
    waybackItems:Array<IWaybackItem>
    waybackItemsReleaseNum2IndexLookup:IWaybackItemsReleaseNum2IndexLookup
    activeWaybackItem:IWaybackItem
    shouldOnlyShowItemsWithLocalChange:boolean
}

class App extends React.PureComponent<IProps, IState> {

    private waybackManager = new WaybackManager();

    constructor(props:IProps){
        super(props);

        this.state = {
            waybackItems: [],
            waybackItemsReleaseNum2IndexLookup: null,
            activeWaybackItem: null,
            shouldOnlyShowItemsWithLocalChange:false
        }

        this.setActiveWaybackItem = this.setActiveWaybackItem.bind(this);
        this.toggleSelectWaybackItem = this.toggleSelectWaybackItem.bind(this);
    }

    async setWaybackItems(waybackItems:Array<IWaybackItem>){

        // always show the most recent release by default
        const activeWaybackItem = waybackItems[0];

        // use the lookup table to quickly locate the wayback item from waybackItems by looking up the release number
        const waybackItemsReleaseNum2IndexLookup = {};

        waybackItems.forEach((d,i)=>{
            const key = d.releaseNum;
            waybackItemsReleaseNum2IndexLookup[key] = i;
        })

        this.setState({
            waybackItems,
            waybackItemsReleaseNum2IndexLookup,
            activeWaybackItem
        }, ()=>{
            console.log('waybackItems is ready', waybackItemsReleaseNum2IndexLookup);
        })
    }

    setActiveWaybackItem(releaseNum:number){

        const { waybackItems, waybackItemsReleaseNum2IndexLookup } = this.state;

        const activeWaybackItemIndex = waybackItemsReleaseNum2IndexLookup[releaseNum];

        const activeWaybackItem = waybackItems[activeWaybackItemIndex];

        this.setState({
            activeWaybackItem
        });
    }

    toggleSelectWaybackItem(releaseNum:number){
        console.log(releaseNum)
    }

    async componentDidMount(){

        try {
            const waybackData2InitApp = await this.waybackManager.init();
            // console.log(waybackData2InitApp);
            this.setWaybackItems(waybackData2InitApp.waybackItems);
            
        } catch(err){
            console.error('failed to get waybackData2InitApp');
        }
    }

    render(){

        const { waybackItems, activeWaybackItem, shouldOnlyShowItemsWithLocalChange } = this.state;

        return(
            <div className='app-content'>
                <Gutter />

                <div className='sidebar'>

                    <div className='content-wrap leader-half trailer-half'>
                        <div className='app-title-text text-center'>
                            <span className='font-size-2 avenir-light'>World Imagery <span className='text-white'>Wayback</span></span>
                        </div>
                    </div>

                    <div className='y-scroll-visible x-scroll-hide fancy-scrollbar'>
                        <div className='content-wrap'>
                            <ListView 
                                waybackItems={waybackItems}
                                activeWaybackItem={activeWaybackItem}
                                shouldOnlyShowItemsWithLocalChange={shouldOnlyShowItemsWithLocalChange}

                                onClick={this.setActiveWaybackItem}
                                toggleSelect={this.toggleSelectWaybackItem}
                            />
                        </div>
                    </div>

                </div>

                <div className='map-container'>
                    <Map />
                </div>

                <Modal/>
            </div>
        );
    }

};

export default App;