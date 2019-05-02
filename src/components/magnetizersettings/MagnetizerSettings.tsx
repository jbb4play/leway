import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import React from "react";
import { IMagnetProduct } from "../../models/IMagnetProduct";
import { IProduct } from "../../models/IProduct";
import MagnetService, { IMagnetService } from "../../services/MagnetService";
import SearchService, { ISearchService } from "../../services/SearchService";
import MagnetizedProducts from "../magnetizedproducts/MagnetizedProduct";
import styles from "./MagnetizerSettings.module.scss";

export interface IMagnetizerSettingsState {
    spinner: boolean;
    allProducts: IProduct[];
    magneticProducts: IMagnetProduct[]
}

export default class MagnetizerSettings extends React.Component<{}, IMagnetizerSettingsState> {
    private searchService: ISearchService = new SearchService();
    private magnetService: IMagnetService = new MagnetService();
    constructor(props: any) {
        super(props);
        this.state = {
            spinner: true,
            allProducts: [],
            magneticProducts: []
        };
    }

    render() {
        const { allProducts, magneticProducts } = this.state;
        let view: JSX.Element = this.state.spinner ? <Spinner size={SpinnerSize.large} /> : <span />;

        if (allProducts && allProducts.length > 0 && magneticProducts && !this.state.spinner) {
            view = <MagnetizedProducts products={allProducts} magneticProducts={this.state.magneticProducts} />
        }

        return (
            <div className={styles.magnetizerSettingsContainer}>
                {view}
            </div>
        );
    }

    public async componentDidMount() {
        this.setState({
            allProducts: await this.searchService.getProduct("a"),
            magneticProducts: await this.magnetService.getAllProducts(),
            spinner: false
        });
        await this.syncDatabases();
    }

    private syncDatabases = async () => {
        const { allProducts } = this.state;

        for (let i = 0; i < allProducts.length; i++) {
            try {
                await this.magnetService.getProduct(allProducts[i].id);
            } catch (e) {
                await this.magnetService.addProduct({ guid: allProducts[i].id, Name: allProducts[i].name, isMagnetized: false });
            }
        }
    }
}