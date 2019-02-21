import React from "react";
import { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import TwoDimensionalMap from "../2dmap/TwoDimensionalMap";
import FakeMapService from "../../services/FakeMapService";
import { IMapService } from "../../services/MapService";
import styles from "./TwoDimensionalMap.module.scss";
import Snap from "snapsvg-cjs";

// automatically unmount and cleanup DOM after the test is finished.
configure({ adapter: new Adapter() });

describe("TwoDimensionalMap", () => {

    it("TwoDimensionalMap - Initial mapData is equal to received prop", async () => {
        let fakeService: IMapService = new FakeMapService();
        let data = await fakeService.getMapData();

        const wrapper = shallow(
            <TwoDimensionalMap polygonData={data} unitTest={true} />
        );

        expect(wrapper.state("mapData")).toEqual(data);
        wrapper.unmount();
    });

    it("TwoDimensionalMap - Renders svg element", async () => {
        let fakeService: IMapService = new FakeMapService();
        let data = await fakeService.getMapData();

        const wrapper = mount(
            <TwoDimensionalMap polygonData={data} unitTest={true} />
        );

        expect(wrapper.contains(<div className={styles.twoDimensionalMapContainer}>
            <svg className={styles.svgContainer}>
                <svg id="svg" className={styles.svgMap}>
                </svg>
            </svg>
        </div>)).toEqual(true);
        wrapper.unmount();
    });

    it("TwoDimensionalMap - Snap correctly renders polygons", async () => {
        let snap = Snap("#svg", 1);

        let dataset = [{ x: 10, y: 30 }, { x: 20, y: 40 }, { x: 30, y: 50 }];

        let polygon = "";

        dataset.forEach(coord => {
            // generate string with coordinates
            polygon += `${coord.x}, ${coord.y} `;
        });

        // create the polygon
        let expected = snap.polygon(polygon as any).toString();

        let result = `<polygon points=\"10, 30 20, 40 30, 50 \"/>`;
        expect(expected).toEqual(result);
    });

});