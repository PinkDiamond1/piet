/**  
 *   This file is part of Piet.
 *
 *   Copyright (C) 2019  Heiko Burkhardt <heiko@slock.it>, Slock.it GmbH
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   Permissions of this strong copyleft license are conditioned on
 *   making available complete source code of licensed works and 
 *   modifications, which include larger works using a licensed work,
 *   under the same license. Copyright and license notices must be
 *   preserved. Contributors provide an express grant of patent rights.
 *   
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as React from 'react';

import * as Sol from '../solidity-handler/SolidityHandler';
import { TabList } from './TabList';
import { InspectorContainerView } from './views/Inspector/InspectorContainerView';
import { GraphContainerView, GraphContainerViewProps } from './views/Graph/GraphContainerView';
import { CodeContainerView } from './views/CodeContainerView';
import { EventCatcherView } from './views/EventCatcherView';
import { JsonView } from './views/JsonView';
import { FileBrowserView } from './views/FileBrowserView';
import { About } from './views/About';
import { MigrationAssistent } from './views/migration-assistent/MigrationAssistent';
import SplitPane from 'react-split-pane';
import { UICreationView } from './views/ui-creation/UICreationView';
import { UICreationHandling } from './views/ui-creation/UIStructure';
import { ConfigurationView } from './views/Configuration/ConfigurationView';
import { BlockchainConnection } from '../solidity-handler/BlockchainConnector';
import { ToolsView } from './views/tools/ToolsView';
import { GraphView, GraphViewProps } from './views/Graph/GraphView';
import { Graph, GraphViewType } from './views/Graph/GraphGenerator';
import { DocGeneratorView } from './views/documentatin-generator/DocGeneratorView';
import { generateMarkdownDoc } from '../utils/DocGenerator';
import { ErrorHandling } from './shared-elements/ErrorInfoBox';
import PatternView from './views/Pattern/PatternView';
import PatternListView from './views/Pattern/PatternListView';

export enum TabEntityType {
    Structure,
    Graph,
    Code,
    EventCatcher,
    Json,
    FileBrowser,
    About,
    MigrationAssistent,
    UICreationView,
    Configuration,
    Tools, 
    TransactionHistory,
    DocGenerator,
    PatternView,
    PatternListView
}

export interface TabEntity {
    contentType: TabEntityType; 
    name: string;
    active: boolean;
    content: any;
    icon: string;
    removable: boolean;
    isLoading: boolean; 
}

interface ViewProps {
    selectedElement: Sol.NodeElement;
    changeActiveTab: Function;
    blockchainConnection: BlockchainConnection;
    contracts: Sol.Contract[];
    changeSelectedElement: Function;
    tabEntities: TabEntity[];
    activeTab: number[];
    addTabEntity: Function;
    viewId: number;
    markCode: Function;
    changeContractAddress: Function;
    getEvents: Function;
    contentChange: Function;
    submitFiles: Function;
    loading: boolean;
    removeTabEntity: Function;
    selectedContractName: string;
    removeContractToSelect: Function;
    globalErrorHandling: ErrorHandling;
    selectedTabTypeForView: TabEntityType[];
    uiCreationHandling: UICreationHandling;
    changeGraphView: Function;
    graph: Graph;
    setGraph: Function;
    graphViewType: GraphViewType;
    loadedPietFileName: string;
    setIsLoading: Function;
    isLoading: boolean;
    
}

export class View extends React.Component<ViewProps, {}> {

    // tslint:disable-next-line:cyclomatic-complexity
    render(): JSX.Element {
        if (!this.props.tabEntities) {
            return null;
        }

        const tabNames: string[] = this.props.tabEntities.map((tabEntity: TabEntity) => tabEntity.name);
        const removable: boolean[]  = this.props.tabEntities.map((tabEntity: TabEntity) => tabEntity.removable);
        const tabIcons: string[]  = this.props.tabEntities.map((tabEntity: TabEntity) => tabEntity.icon);

        const contentType: TabEntityType = this.props.activeTab[this.props.viewId] !== null ?
             this.props.tabEntities[this.props.activeTab[this.props.viewId]].contentType : null;
        let content: JSX.Element;

        const graphContainerViewProps: GraphContainerViewProps = {
            graphViewType: this.props.graphViewType,
            removeContractToSelect: this.props.removeContractToSelect,
            selectedContractName: this.props.selectedContractName,
            selectedElement: this.props.selectedElement,
            blockchainConnection: this.props.blockchainConnection,
            contracts: this.props.contracts,
            changeSelectedElement: this.props.changeSelectedElement,
            changeGraphView: this.props.changeGraphView,
            graph: this.props.graph,
            setGraph: this.props.setGraph,
            loadedPietFileName: this.props.loadedPietFileName,
        };

        switch (contentType) {

            case TabEntityType.About:
                content =   <About />;
                break;

            case TabEntityType.Graph:
                content =   <GraphContainerView
                                {...graphContainerViewProps}
                  
                            />;
                break;

            case TabEntityType.Structure:
                content =   <InspectorContainerView
                                uiCreationHandling={this.props.uiCreationHandling}
                                selectedTabTypeForView={this.props.selectedTabTypeForView}
                                contracts={this.props.contracts}
                                changeContractAddress={this.props.changeContractAddress}
                                addTabEntity={this.props.addTabEntity}
                                markCode={this.props.markCode}
                                selectedElement={this.props.selectedElement}
                                blockchainConnection={this.props.blockchainConnection}
                                getEvents={this.props.getEvents}
                            />;
                break;

            case TabEntityType.Code:
                content =   <CodeContainerView 
                                key={'codeView' + this.props.activeTab[this.props.viewId]} 
                                activeTabId={this.props.activeTab[this.props.viewId]} 
                                tabEntities={this.props.tabEntities} 
                            />;
                break;

            case TabEntityType.EventCatcher:
                const contract: Sol.Contract = this.props.tabEntities[this.props.activeTab[this.props.viewId]].content.contract;
                const event: any = this.props.tabEntities[this.props.activeTab[this.props.viewId]].content.event;
                content =   <EventCatcherView 
                                contracts={this.props.contracts}
                                key={'eventCatcher' + this.props.activeTab[this.props.viewId] }
                                viewId={this.props.viewId}
                                tabId={this.props.activeTab[this.props.viewId]}
                                content={this.props.tabEntities[this.props.activeTab[this.props.viewId]].content}
                                contentChange={this.props.contentChange}
                                blockchainConnection={this.props.blockchainConnection}
                            />;
                break;

            case TabEntityType.Tools:
                content =   <ToolsView 
                                key={'ToolsView'}
                                viewId={this.props.viewId}
                                tabId={this.props.activeTab[this.props.viewId]}
                                blockchainConnection={this.props.blockchainConnection}
                            />;
                break;
            
            case TabEntityType.Json:
            content =   <JsonView 
                            key={'eventCatcher' + this.props.activeTab[this.props.viewId] }
                            viewId={this.props.viewId}
                            tabId={this.props.activeTab[this.props.viewId]}
                            content={this.props.tabEntities[this.props.activeTab[this.props.viewId]].content}
                            blockchainConnection={this.props.blockchainConnection}
                            isLoading={false}
                        />;
            break;

            case TabEntityType.TransactionHistory:
                content =   <JsonView 
                                key={'TransactionHistory'}
                                viewId={this.props.viewId}
                                tabId={this.props.activeTab[this.props.viewId]}
                                content={this.props.blockchainConnection.transactionHistory}
                                blockchainConnection={this.props.blockchainConnection}
                                isLoading={false}
                            />;
                break;

            case TabEntityType.FileBrowser:
                content =   <FileBrowserView 
                                selectedElement={this.props.selectedElement}
                                graph={this.props.graph}
                                globalErrorHandling={this.props.globalErrorHandling}
                                key={'eventCatcher' + this.props.activeTab[this.props.viewId] }
                                viewId={this.props.viewId}
                                tabId={this.props.activeTab[this.props.viewId]}
                                content={this.props.tabEntities[this.props.activeTab[this.props.viewId]].content}
                                blockchainConnection={this.props.blockchainConnection}
                                submitFiles={this.props.submitFiles}
                                contracts={this.props.contracts}
                                loading={this.props.loading}
                                changeSelectedElement={this.props.changeSelectedElement}
                            />;
                break;

            case TabEntityType.MigrationAssistent:
                content =   <MigrationAssistent 
                                key={'Migration Assistent'}
                                viewId={this.props.viewId}
                                tabId={this.props.activeTab[this.props.viewId]}
                                content={null}
                                blockchainConnection={this.props.blockchainConnection}
                                contracts={this.props.contracts}
                            />;
                break;
            
            case TabEntityType.Configuration:
                content =   <ConfigurationView 
                                key={'ConfigurationView'}
                                viewId={this.props.viewId}
                                tabId={this.props.activeTab[this.props.viewId]}
                                content={null}
                                blockchainConnection={this.props.blockchainConnection}
                                contracts={this.props.contracts}
                                loading={this.props.loading}
                            />;
                break;
            
            case TabEntityType.UICreationView:
                content =   <UICreationView 
                                uiCreationHandling={this.props.uiCreationHandling}
                                key={'UICreationView'}
                                viewId={this.props.viewId}
                                tabId={this.props.activeTab[this.props.viewId]}
                                content={null}
                                blockchainConnection={this.props.blockchainConnection}
                                productiveMode={false}
                           
                            />;
                break;

            case TabEntityType.DocGenerator:
                content =   <DocGeneratorView 
                                key={'DocGenerator'}
                                content={this.props.selectedElement ? generateMarkdownDoc(this.props.selectedElement) : null}
                            />;
                break;

            case TabEntityType.PatternView:
                content =   <PatternView 
                                key={'PatternView'}
                                content={this.props.tabEntities[this.props.activeTab[this.props.viewId]].content}
                                graphContainerViewProps={graphContainerViewProps}
                                blockchainConnection={this.props.blockchainConnection}
                                setIsLoading={this.props.setIsLoading}
                                isLoading={this.props.isLoading}
                            />;
                break;
            
            case TabEntityType.PatternListView:
                content =   <PatternListView 
                                key={'PatternListView'}
                                addTabEntity={this.props.addTabEntity}
                            />;
                break;
                                
            default:
                content = null;
        }
        
        return  <div className='h-100 default-background'>
                    <SplitPane split='horizontal' className='hide-resizer' defaultSize={50} allowResize={false} >
                        <div className='tabs-container h-100 w-100'>
                            <TabList 
                                removable={removable} 
                                removeTabEntity={this.props.removeTabEntity} 
                                viewId={this.props.viewId} 
                                activeTabId={this.props.activeTab[this.props.viewId]}
                                tabNames={tabNames}
                                tabIcons={tabIcons}
                                changeActiveTab={this.props.changeActiveTab}
                            />
                        </div>
                        <div>
                            
                            {content}
                        </div>
                    </SplitPane>
                </div>;   
  
    }
    
}