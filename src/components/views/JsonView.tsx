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
import JSONTree from 'react-json-tree';
import SplitPane from 'react-split-pane';
import { BlockchainConnection } from '../../solidity-handler/BlockchainConnector';

interface JsonViewProps {
    blockchainConnection: BlockchainConnection;
    content: any;
    viewId: number;
    tabId: number;
    isLoading: boolean;

}

interface JsonViewState {
    raw: boolean;

}

export class JsonView extends React.Component<JsonViewProps, JsonViewState> {

    constructor(props: JsonViewProps) {
        super(props);
        this.state = {
            raw: false
        };
        this.toogleRaw = this.toogleRaw.bind(this);
    }

    toogleRaw(): void {
        this.setState((prevState: JsonViewState) => ({raw: !prevState.raw}));
    }


    render(): JSX.Element {
        
        const theme: any = {
            base00: '#232323',
            base01: '#383830',
            base02: '#49483e',
            base03: '#75715e',
            base04: '#a59f85',
            base05: '#f8f8f2',
            base06: '#f5f4f1',
            base07: '#f9f8f5',
            base08: '#f92672',
            base09: '#fd971f',
            base0A: '#f4bf75',
            base0B: '#a6e22e',
            base0C: '#a1efe4',
            base0D: '#66d9ef',
            base0E: '#ae81ff',
            base0F: '#cc6633'
        };

        return <SplitPane className='scrollable hide-resizer' split='horizontal'  defaultSize={40} allowResize={false} >
                    <div className='h-100 w-100 toolbar'>
                        <button 
                            className={'btn btn-sm btn' + (this.state.raw ? '' : '-outline') + '-info'} 
                            onClick={this.toogleRaw}
                            title='Raw JSON'
                        >
                            <i className='fas fa-file-code'></i>
                        </button>
                  
                        {this.props.isLoading && <i className='fas fa-spinner fa-spin'></i>}
                    </div>
                    <SplitPane 
                        className='scrollable hide-resizer empty-first-pane'
                        split='horizontal'
                        defaultSize={1}
                        allowResize={false}
                    >
                        <div></div>
                        <div className='container-fluid'>
                            <div className='row'>
                                <div className='col-12'>
                                    <small className='events-json-container'>
                                        {this.props.content && !this.state.raw &&
                                            <JSONTree data={this.props.content} theme={theme} invertTheme={false}/>
                                        }
                                        {this.props.content && this.state.raw &&
                                            <pre className='markdown-code'>
                                                {JSON.stringify(this.props.content, null, 2)}
                                            </pre>
                                        }
                                    </small>
                                </div>
                            </div>
                        </div>
                    </SplitPane>
                </SplitPane>;
               
    }
    
}