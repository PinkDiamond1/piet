
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
import SplitPane from 'react-split-pane';
import * as ReactMarkdown from 'react-markdown';
import { saveAs } from 'file-saver';

interface DocGeneratorViewProps {
    content: string;
}

interface DocGeneratorViewState {
    showCode: boolean;
}

export class DocGeneratorView extends React.Component<DocGeneratorViewProps, DocGeneratorViewState> {

    constructor(props: DocGeneratorViewProps) {
        super(props);
     
        this.state = {
            showCode: false
        };
        this.togglePreview = this.togglePreview.bind(this);
        this.save = this.save.bind(this);
   
    }

    togglePreview(): void {
        this.setState((prevState: DocGeneratorViewState) => ({
            showCode: !prevState.showCode
        }));
    }

    save(): void {

        saveAs(new Blob([this.props.content], {type : 'text/plain'}), 'export' + Date.now() + '.md');

    }

    render(): JSX.Element {

        const markdown: string = this.props.content ? 
        this.props.content :
        'Select a contract in the graph view to generate its documentation.';

        return <SplitPane className='scrollable hide-resizer' split='horizontal'  defaultSize={40} allowResize={false} >
                    <div className='h-100 w-100 toolbar'>
                        <button 
                            className={'btn btn-sm btn' + (this.state.showCode ? '' : '-outline') + '-info'} 
                            onClick={this.togglePreview}
                            title='Show preview'
                        >
                            <i className='fas fa-file-code'></i>
                        </button>
                        &nbsp;
                        <button 
                            className={'btn btn-sm btn-outline-info'} 
                            onClick={this.save}
                            title='Download markdown file'

                        >
                            <i className='fas fa-download'></i>
                        </button>
                    </div>
                    <SplitPane 
                        className={'scrollable hide-resizer empty-first-pane markdown-preview'}
                        split='horizontal'
                        defaultSize={1}
                        allowResize={false}
                    >
                        <div></div>
                        <div className={'container-fluid'}>
                            <div className='row'>
                                
                                    {
                                        !this.state.showCode ?
                                        <div className='col-12 markdown-rendered' >
                                            <small><ReactMarkdown  source={markdown} /></small>
                                        </div> :
                                        <div className='col-12'>
                                            <pre className='markdown-code'>
                                                {markdown}
                                            </pre>
                                        </div>
                                       
                                    }
                                        
                                
                            </div>
                        </div>
                    </SplitPane>
                </SplitPane>;
               
    }
    
}