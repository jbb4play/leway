import React from "react";
import TwoDimensionalMap from "../2dmap/TwoDimensionalMap";
import ThreeDimensionalMap from "../3dmap/ThreeDimensionalMap";
import { Toggle, Spinner } from "office-ui-fabric-react";
import styles from "./MapSelector.module.scss";
import MapService, { IMapService } from "../../services/MapService";
import FakeMapService from "../../services/FakeMapService";
import { IMapModel } from "../../models/MapModel";


export interface IMapSelectorProps {
    fakeData?: boolean;
    unit?: boolean;
}

export interface IMapSelectorState {
    twoDimensions: boolean;
    mapData: IMapModel;
    dataReady: boolean;
}

export default class MapSelector extends React.Component<IMapSelectorProps, IMapSelectorState>{
    private mapService: IMapService;
    constructor(props: any) {
        super(props);
        this.state = {
            mapData: {
                innerPolygon: [],
                outerPolygon: { polygon: [] },
            },
            twoDimensions: true,
            dataReady: false
        };
        this.mapService = this.props.fakeData ? new FakeMapService() : new MapService();
    }

    public render(): JSX.Element {
        let map: JSX.Element = this.state.twoDimensions ? <TwoDimensionalMap polygonData={this.state.mapData} onEditMap={this.onEditMap} unit={this.props.unit} /> : <ThreeDimensionalMap />;
        let toggle: JSX.Element = <Toggle
            onText={"3D Map"}
            offText={"2D Map"}
            // disabled={true}
            onClick={this.onToggleClick} />;
        return (
            <div className={styles.mapSelectorContainer}>
                {toggle}
                {this.state.dataReady ? map : <Spinner />}
            </div>
        );
    }

    private onToggleClick = () => {
        this.setState({ twoDimensions: !this.state.twoDimensions });
    }

    public async componentDidMount() {
        let data = await this.mapService.getMapData();
        if (data) {
            this.setState({ mapData: data, dataReady: true });
        }
    }

    private onEditMap = (data: IMapModel) => {
        console.log("Map has been edited");
    }
}
