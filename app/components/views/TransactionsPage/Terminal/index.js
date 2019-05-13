import { Input } from "inputs";
import child_process from "child_process";
import node_process from "process";
import { validataOS } from "helpers";
import iconv from "iconv-lite";
import { TabbedHeader } from "shared";
import { InputSelect } from "inputs";
import { KeyBlueButton } from "buttons"
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { getWalletCfgPath } from "../../../../config";
import { terminal } from "connectors";

import 'style/Terminal.less';

const messages = defineMessages({
    placeholder: {
        id: "terminal.method.placeholder",
        defaultMessage: "Select method"
    },
});

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            methodAll: [],
            methodName: "",
            parameter: "",
            desc: '',
            hasParameter: false,
            result: [],
        }
    }
    onSetParameter = (e) => {
        if (e.target.value !== this.state.parameter) {
            this.setState({ parameter: e.target.value })
        }
    }
    onChangeMethod = (e) => {
        if (e && this.state.methodName != e.method) {
            this.setState({ methodName: e.method, hasParameter: e.hasParameter, desc: e.desc })
        } else if (!e) {
            this.setState({ methodName: '', hasParameter: false, desc: '' })
        }
    }
    onRun = () => {

        let value = ` ${this.state.methodName} ${this.state.parameter} `;   //" -l ";  
        if (value.indexOf("--rpccert") == -1) {
            value = `${value}  ${this.getCertPath()} `;
        }

        if (value.indexOf("--wallet") == -1) {
            value = ` --wallet ${value}`;
        }

        if (value.indexOf("-u") == -1) {
            value = ` -u admin ${value} `;
        }
        if (value.indexOf("-P") == -1) {
            value = ` -P 123 ${value}`;
        }
        if (this.props.isTestNet) {
            if (value.indexOf('--testnet') == -1) {
                value = ` --testnet ${value}`;
            }
        }

        if (value.indexOf("hcctl") == -1) {
            value = ` ${this.getHcctlPath()} ${value}`;
        }


        let workerProcess = child_process.exec(value, { cwd: this.getCwdPath(), encoding: 'GBK' });
        let results = this.state.result ? this.state.result : [];
        if (results.length != 0) {
            results.push(`<br/><text class="terminal_resultDividingLine">========================================================</text><br/>`)
        }


        // results.push(`Run: ${value}`);
        // results.push(`<br/>`); 
        workerProcess.stdout.on('data', (data) => {
            results.push(iconv.decode(data, 'GBK'));
            //arr.push(data); 
        });

        workerProcess.stderr.on('data', (data) => {
            results.push(`<text class='terminal_resultErr'>${iconv.decode(data, 'GBK')}</text>`)
            this.setState({ result: results })
            this.onScrollTop();
        });


        workerProcess.on('close', (code) => {
            this.setState({ result: results })
            this.onScrollTop();
        });
    }
    onScrollTop = () => {
        setTimeout(() => {
            document.getElementById('result').scrollTop = document.getElementById('result').scrollHeight
        }, 100)
    }

    render() {
        const routes = this.props.routes;
        const methods = this.state.methodAll;
        const hasParameter = this.state.hasParameter;
        const { formatMessage } = this.props.intl;
        return <Aux>
            <TabbedHeader {...{ routes }} />
            <div className="tabbed-page">
                <div className="tab-card" style={{ overflow: "auto" }}>
                    <div className="omni-sendForm">
                        <div className="sendForm-row">
                            <div className="sendForm-col col-4">
                                <div>
                                    <T id="terminal.method" m="Method" />
                                </div>
                                <div><InputSelect className="send-select-account-input" {...{
                                    datas: methods,
                                    labelKey: "method",
                                    valueKey: "method",
                                    onChange: this.onChangeMethod,
                                    placeholder: formatMessage(messages.placeholder)
                                }} /></div>
                            </div>
                            {hasParameter ? <div className="sendForm-col col-8">
                                <div>
                                    <T id="terminal.parameter" m="Parameters (multiple parameters separated by spaces)" />
                                </div>
                                <div>

                                    <Input
                                        value={this.state.parameter}
                                        className="send-address-hash-to"
                                        onChange={this.onSetParameter}
                                    />
                                </div>
                            </div> : null}
                            <div className="sendForm-col" style={{ minWidth: 100 }}>
                                <div>
                                    &nbsp;
                                </div>
                                <div>
                                    <KeyBlueButton
                                        disabled={!this.state.methodName}
                                        size="large"
                                        onClick={this.onRun}
                                        block={false} >
                                        <T id="terminal.button.run" m="Run" />
                                    </KeyBlueButton>
                                </div>

                            </div>
                        </div>
                        {this.state.desc ? <div className="sendForm-row">
                            <div className="sendForm-col ">
                                <div><T id="terminal.tip" m="Parametric format：" />{this.state.desc}</div>
                            </div>
                        </div> : null}


                    </div>
                    <div className="omni-sendForm">
                        <div className="sendForm-row">
                            <div className="sendForm-col col-12">
                                <div>
                                    <T id="terminal.result" m="Result" />
                                </div>
                                <div id="result" className="terminal_result" dangerouslySetInnerHTML={{
                                    __html: `<pre>${this.state.result.join('')}</pre>`
                                }}>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Aux >
    }



    getCwdPath = () => {
        if (process.env.NODE_ENV === "development") {
            return "./bin";
        } else {
            if (validataOS() == "Mac") {
                const execPath = node_process.execPath.split("Frameworks");
                if (execPath.length > 1) {
                    return execPath[0] + "resources/bin"
                }
            }
            return "./resources/bin";
        }
    }

    getCertPath = () => {
        return ` --rpccert="${getWalletCfgPath(this.props.isTestNet, this.props.walletName)}/rpc.cert" `
    }

    getHcctlPath=()=>{
        if (validataOS() == "Mac") {
            return "./hcctl"
        }
        return "hcctl"
    }

    componentWillMount() {
        let workerProcess = child_process.exec(` ${this.getHcctlPath()} -l `, { cwd: this.getCwdPath(), encoding: 'GBK' });

        let results = [];

        workerProcess.stdout.on('data', (data) => {

            const dataArr = iconv.decode(data, 'GBK').split("\n").filter((r) => {
                if (r == "" || r.charAt(r.length - 1) == ":")
                    return false;
                else
                    return true;
            })
            let afterDataArr = dataArr.map((r) => {
                const row = r.replace(" ", "~~~~").split("~~~~");
                if (row.length == 1) {
                    return {
                        method: row[0],
                        hasParameter: false,
                        desc: ''
                    }
                } else {

                    return {
                        method: row[0],
                        hasParameter: true,
                        desc: row[1]
                    }
                }
            })
            results = [...results, ...afterDataArr];
        });

        workerProcess.stderr.on('data', (data) => {
            this.setState({ result: [`<text class='terminal_resultErr'>${iconv.decode(data, 'GBK')}</text>`] })
        });


        workerProcess.on('close', (code) => {
            if (results) {
                this.setState({
                    methodAll: results,
                    methodName: results[0].method,
                    hasParameter: results[0].hasParameter,
                    desc: results[0].desc,
                })
            }
        });

    }





}

export default terminal(injectIntl(Index));
