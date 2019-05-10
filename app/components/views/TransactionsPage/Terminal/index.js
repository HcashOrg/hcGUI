import { Input } from "inputs";
import child_process from "child_process";
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
            value = `${value} --rpccert ${getWalletCfgPath(this.props.isTestNet, this.props.walletName)}\\rpc.cert`;
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
            value = ` hcctl ${value}`;
        }


        // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
        let workerProcess = child_process.exec(value, { cwd: this.getCwdPath(), encoding: 'GBK' });
        let results = this.state.result ? this.state.result : [];
        if (results.length != 0) {
            results.push(`<br/><text class="terminal_resultDividingLine">========================================================</text><br/>`)
        }

        //.replace(/\n/g, "----------------")

        // results.push(`Run: ${value}`);
        // results.push(`<br/>`);

        // 打印正常的后台可执行程序输出 
        workerProcess.stdout.on('data', (data) => {
            results.push(iconv.decode(data, 'GBK'));
            //arr.push(data); 
        });
        // 打印错误的后台可执行程序输出
        workerProcess.stderr.on('data', (data) => {
            results.push(`<text class='terminal_resultErr'>${iconv.decode(data, 'GBK')}</text>`)
            this.setState({ result: results })
            this.onScrollTop();
        });

        // 退出之后的输出
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
            return "./resources/bin";
        }
    }


    componentWillMount() {

        // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
        let workerProcess = child_process.exec(`hcctl -l  --rpccert ${getWalletCfgPath(this.props.isTestNet, this.props.walletName)}\\rpc.cert `, { cwd: this.getCwdPath(), encoding: 'GBK' });

        let results = [];
        // 打印正常的后台可执行程序输出 
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
        // 打印错误的后台可执行程序输出
        workerProcess.stderr.on('data', (data) => {
            this.setState({ result: `<text class='terminal_resultErr'>${iconv.decode(data, 'GBK')}</text>` })
            //results.push(`<text class='terminal_resultErr'>${iconv.decode(data, 'GBK')}</text>`) 
        });

        // 退出之后的输出
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

        // const fristMethod = this.props.command_methods ? this.props.command_methods[0] : null;
        // this.setState({
        //     methodName: fristMethod.method,
        //     parameter: "",
        //     hasParameter: fristMethod.hasParameter,
        // })
    }





}

export default terminal(injectIntl(Index));
