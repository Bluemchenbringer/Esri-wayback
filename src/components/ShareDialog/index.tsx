/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import './style.css';
import React from 'react';
import config from './config';

interface IProps {
    currentUrl: string;
    onClose: () => void;
}

interface IState {
    copyBtnLabel: string;
}

class ShareDialog extends React.PureComponent<IProps, IState> {
    private textInputRef = React.createRef<HTMLInputElement>();

    constructor(props: IProps) {
        super(props);

        this.state = {
            copyBtnLabel: 'Copy',
        };

        this.copyToClipboard = this.copyToClipboard.bind(this);
    }

    copyToClipboard() {
        const textInput = this.textInputRef.current;
        textInput.select();
        document.execCommand('copy');

        this.updateCopyBtnLabel('Copied');
    }

    updateCopyBtnLabel(label = 'Copy') {
        this.setState({
            copyBtnLabel: label,
        });

        if (label === 'Copied') {
            setTimeout(() => {
                this.updateCopyBtnLabel('Copy');
            }, 1500);
        }
    }

    componentDidMount() {
        // modal();
    }

    render() {
        const { currentUrl, onClose } = this.props;

        const { copyBtnLabel } = this.state;

        const share2TwitterLink = `https://arcgis.com/home/socialnetwork.html?t=${config.title}&n=tw&u=${currentUrl}`;
        const share2facebookLink = `https://arcgis.com/home/socialnetwork.html?t=${config.title}&n=fb&u=${currentUrl}`;
        const share2LinkedInLink = `https://www.linkedin.com/shareArticle?url=${currentUrl}&title=${config.title}&summary=${config.description}?mini=true&source=livingatlas.arcgis.com`;

        return (
            <div
                className="modal-overlay customized-modal is-active"
                // data-modal={config['modal-id']}
            >
                <div
                    className="modal-content column-7"
                    role="dialog"
                    aria-labelledby="modal"
                >
                    <div className="trailer-1">
                        <span
                            className="cursor-pointer right"
                            aria-label="close-modal"
                            onClick={onClose}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="21"
                                viewBox="0 0 32 32"
                                className="svg-icon"
                            >
                                <path d="M18.404 16l9.9 9.9-2.404 2.404-9.9-9.9-9.9 9.9L3.696 25.9l9.9-9.9-9.9-9.898L6.1 3.698l9.9 9.899 9.9-9.9 2.404 2.406-9.9 9.898z" />
                            </svg>
                        </span>

                        <h4 className="text-xl text-center">
                            Share World Imagery Wayback
                        </h4>
                    </div>

                    <div className="input-2-copy-url trailer-half">
                        <div className="input-group">
                            <input
                                className="input-group-input"
                                ref={this.textInputRef}
                                readOnly
                                type="text"
                                value={currentUrl}
                            />
                            <span className="input-group-button">
                                <button
                                    className="btn"
                                    onClick={this.copyToClipboard}
                                >
                                    {copyBtnLabel}
                                </button>
                            </span>
                        </div>
                    </div>

                    <div className="trailer-half social-media-icons">
                        <a
                            className="icon-social-twitter cursor-pointer"
                            href={share2TwitterLink}
                            target="_blank"
                            aria-label="Twitter"
                            rel="noopener noreferrer"
                        ></a>
                        <a
                            className="icon-social-linkedin cursor-pointer"
                            href={share2LinkedInLink}
                            target="_blank"
                            aria-label="LinkedIn"
                            rel="noopener noreferrer"
                        ></a>
                        <a
                            className="icon-social-facebook cursor-pointer"
                            href={share2facebookLink}
                            target="_blank"
                            aria-label="Facebook"
                            rel="noopener noreferrer"
                        ></a>
                        {/* <a
                            className="icon-social-github cursor-pointer"
                            href={config['github-repo-url']}
                            target="_blank"
                            aria-label="github"
                            rel="noopener noreferrer"
                        ></a> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default ShareDialog;
