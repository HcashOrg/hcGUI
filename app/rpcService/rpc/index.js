import https from 'https'
import {rpcOptions} from '../../config'


export const getOmnitService = (isTestNet,host) => (method,params=[],methodType='POST')=>{

    const postData = JSON.stringify({
        "jsonrpc":rpcOptions.jsonrpc,
        "id":rpcOptions.id,
        "method":method,
        "params":params?params:[]
    });

    const options = {
        hostname: host,    
        port: rpcOptions.port(isTestNet),    
        path: '/',    
        method: methodType,    
        requestCert:true,  //请求客户端证书   
        rejectUnauthorized: false, //不拒绝不受信任的证书    
        headers: {
            'Authorization': 'Basic '+new Buffer(rpcOptions.username+':'+rpcOptions.password).toString('base64')
        }, 
    }; 

    return new Promise((resolve, reject)=>{
        const req = https.request(options, (res) => {    
            res.setEncoding('utf8');    
            res.on('data', (chunk) => {  
                const data = JSON.parse(chunk); 
                if(data.error){
                    reject(data.error) 
                } else{
                    reject(data.result);
                }     
            });    
            res.on('end', () => {     
                console.log('No more data in response.');    
            }); 
        });  
        req.on('error', (e) => {   
            reject(e.message);
            //throw new Error(`rpc problem with request: ${e.message}`);  
            console.error(`problem with request: ${e.message}`);
        });  // write data to request bodyreq.write(postData);
            
        req.write(postData);
        req.end(); 
    }); 
};