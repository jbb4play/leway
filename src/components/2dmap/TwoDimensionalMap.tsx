import React from "react";
import styles from "./TwoDimensionalMap.module.scss";
import Snap from "snapsvg-cjs";
import { IMapModel } from "../../models/MapModel";

export interface ITwoDimensionalMapProps {
    polygonData: IMapModel;
    onEditMap?: (data: IMapModel) => void;
    unit?: boolean;
}

export interface ITwoDimensionalMapState {
    mapData: IMapModel;
}

export default class TwoDimensionalMap extends React.Component<ITwoDimensionalMapProps, ITwoDimensionalMapState> {
    constructor(props: any) {
        super(props);
        this.state = {
            mapData: this.props.polygonData as any
        };
    }

    public render(): JSX.Element {
        let map = <div className={styles.twoDimensionalMapContainer}>
            <svg className={styles.svgContainer}>
                <svg id="svg" className={styles.svgMap}>
                </svg>
            </svg>
        </div>;
        return (
            map
        );
    }

    public componentDidMount() {
        this.generateMap();
    }

    private generateMap = () => {
        if (this.state.mapData && !this.props.unit) {

            let snap: Snap.Paper = Snap("#svg");

            if (this.state.mapData.outerPolygon) {
                let polygon: string = "";
                this.state.mapData.outerPolygon.polygon.forEach(coord => {
                    polygon += `${coord.x}, ${coord.y} `;
                });
                snap.polygon(polygon as any);
            }

            if (this.state.mapData.innerPolygon) {
                let polygon: string = "";

                // Iterate all inner polygons
                this.state.mapData.innerPolygon.forEach(it => {

                    // for each inner polygon
                    it.polygon.forEach(coord => {
                        // generate string with coordinates
                        polygon += `${coord.x}, ${coord.y} `;
                    });

                    // create the polygon
                    let pol: Snap.Element = snap.polygon(polygon as any);

                    // style the polygon
                    pol.addClass(styles.polygonObject);

                    // reset the string
                    polygon = "";
                });
            }
        }
    }

    public componentWillReceiveProps(nextProps: ITwoDimensionalMapProps) {
        this.setState({ mapData: nextProps.polygonData });
        this.generateMap();
    }
}
