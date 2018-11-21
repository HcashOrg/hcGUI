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

    let stringData="";
    return new Promise((resolve, reject)=>{
        const req = https.request(options, (res) => {    
            res.setEncoding('utf8');    
            res.on('data', (chunk) => {     
                stringData=stringData+chunk; 
            });    
            res.on('end', () => {     
                const data = JSON.parse(stringData);    
                console.log(`wallet rpc request method end:${method}`,params,data);    
                if(data.error){
                    reject(data.error.message) 
                } else{
                    resolve(data.result);
                }        
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