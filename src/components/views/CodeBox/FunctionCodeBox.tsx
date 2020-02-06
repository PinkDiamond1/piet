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
import * as Sol from '../../../solidity-handler/SolidityHandler';
import * as Hljs from 'highlight.js';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { getFunctionAbi } from '../../../utils/AbiGenerator';
import * as jsonFormat from 'json-format';
import { spawnSync } from 'child_process';
import { BlockchainConnection, getFunctionSignature } from '../../../solidity-handler/BlockchainConnector';

export interface FunctionCodeBoxProps {
    contextContract: Sol.Contract;
    selectedFunction: Sol.ContractFunction;
    codeBoxIsShown: boolean;
    showFunctionCodeBox: Function;
    blockchainConnection: BlockchainConnection; 
    contracts: Sol.Contract[];
    codeToShow: CodeToShow;

}

export enum CodeToShow {
    Solidity,
    Abi
}

export class FunctionCodeBox extends React.Component<FunctionCodeBoxProps, {}> {

    constructor(props: FunctionCodeBoxProps) {
        super(props);

        this.hideFunctionCodeBox = this.hideFunctionCodeBox.bind(this);
    }

    componentDidMount(): void {

        Hljs.initHighlightingOnLoad();

    }

    hideFunctionCodeBox(): void {
        this.props.showFunctionCodeBox(false);
    }

    render(): JSX.Element {
        if (!this.props.selectedFunction) {
            return null;
        } 

        let abi: any;
        let abiError: string = null;
        try {
            abi = getFunctionAbi(this.props.selectedFunction, this.props.contracts, this.props.contextContract)[0];
        } catch (e) {
            abiError = e.message;
        }
            
        return  <div 
                    className={'codeModal modal fade' + (this.props.codeBoxIsShown ? ' show force-show' : '')} 
                    role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
                    <div className='modal-dialog modal-lg' role='document'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>
                                    {this.props.selectedFunction.name}() 
                                </h5>
                                <button type='button' onClick={this.hideFunctionCodeBox} 
                                    className='close' data-dismiss='modal' aria-label='Close'>
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </div>
                            <div className='modal-body code-modal-body '>
                                <small>
                                
                                    {this.props.codeToShow === CodeToShow.Solidity &&
                                        <SyntaxHighlighter language='javascript' style={docco}>
                                            {'    ' + this.props.selectedFunction.source}
                                        </SyntaxHighlighter>
                                    }
                                    {!abiError && this.props.codeToShow === CodeToShow.Abi &&
                                        <SyntaxHighlighter language='json' style={docco}>
                                            {jsonFormat(abi) }
                                        </SyntaxHighlighter>
                                        
                                    }
                                    {abiError && this.props.codeToShow === CodeToShow.Abi && 
                                        <span>{abiError}</span> 
                                    }
                                </small>
                            </div>
                            <div className='modal-body code-modal-body code-modal-signature'>
                                {abiError === null && 
                                    <small>
                                        <small className='text-muted'>
                                            Signature: {getFunctionSignature(this.props.blockchainConnection, abi)}
                                        </small>
                                    </small>
                                }                                
                            </div>

                            <div className='modal-footer'>
                            
                                <button type='button' onClick={this.hideFunctionCodeBox} 
                                    className='btn btn-secondary' data-dismiss='modal'>
                                    Close
                                </button>
                        
                            </div>
                        </div>
                    </div>
                </div>;

    }

}