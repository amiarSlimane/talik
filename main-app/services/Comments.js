const axios = require('axios');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');
const util = require('util');
const amqplib = require('amqplib');


const fsexists = util.promisify(fs.exists);

const CircuitBreaker = require('../lib/CircuitBreaker');
const circuitBreaker = new CircuitBreaker();

let q = 'comments';
let ch;
(async ()=>{

 try{
  const conn = await amqplib.connect('amqp://localhost');
  ch = await conn.createChannel();
  await ch.assertQueue(q);
 }catch(error){
  console.error(error)
 }

})();

class CommentsService {
  constructor({serviceRegistryUrl, serviceVersion}) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersion = serviceVersion;
    this.cache = {};
  }

 

  async getAllcomments(query) {
    const {ip, port} = await this.getService('comments-service');

    let queryString = '';
    const queryArray = Object.entries(query);
    queryArray.forEach((item, index)=>{
      queryString = queryString + item[0]+'='+item[1]+ (index<queryArray.length-1?'&':''); 
    })

    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/comments?${queryString}`
    });
  }



  async getAllPostComments(postId, query) {
    const {ip, port} = await this.getService('comments-service');

    let queryString = '';
    const queryArray = Object.entries(query);
    queryArray.forEach((item, index)=>{
      queryString = queryString + item[0]+'='+item[1]+ (index<queryArray.length-1?'&':''); 
    })

    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/comments/post/${postId}?${queryString}`
    });
  }


  async getOneComment(commentId, query) {
    const {ip, port} = await this.getService('comments-service');

    let queryString = '';
    const queryArray = Object.entries(query);
    queryArray.forEach((item, index)=>{
      queryString = queryString + item[0]+'='+item[1]+ (index<queryArray.length-1?'&':''); 
    })

    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/comments/${commentId}?${queryString}`
    });
  }


  async createOneCommentAMQP(body, postId){
    
   
    const qm = JSON.stringify({body, postId});
    return ch.sendToQueue(q, Buffer.from(qm, 'utf8'));
  }
  
  async createOneComment(body, postId) {
    const {ip, port} = await this.getService('comments-service');
   
    const reqOptions = {
      method: 'post',
      url: `http://${ip}:${port}/comments/${postId}`,
      data: body
    }

    console.log('reqOptions ', reqOptions);

    return this.callService(reqOptions);
  }

  async createOneCommentReply(body, postId, commentId) {
    const {ip, port} = await this.getService('comments-service');
   
    const reqOptions = {
      method: 'post',
      url: `http://${ip}:${port}/comments/${postId}/comment/${commentId}`,
      data: body
    }

    console.log('reqOptions ', reqOptions);

    return this.callService(reqOptions);
  }
 

  async getService(serviceName){
    const res = await axios.get(`${this.serviceRegistryUrl}/find/${serviceName}/${this.serviceVersion}`);
    return res.data;
  }

  async callService(reqOptions){
    console.log('callService reqOptions', reqOptions)

    const servicePath = url.parse(reqOptions.url).path;
    const cacheKey = crypto.createHash('md5').update(reqOptions.method + servicePath).digest('hex');
    console.log('callService servicePath', servicePath)
    let cacheFile = null;

    if (reqOptions.responseType && reqOptions.responseType === 'stream') {
      cacheFile = `${__dirname}/../../_imagecache/${cacheKey}`;
    }

    const result = await circuitBreaker.callService(reqOptions);

    if (!result) {
      if (this.cache[cacheKey]){
        console.log('Serving from cache');
        return this.cache[cacheKey];
      } 
      if (cacheFile) {
        const exists = await fsexists(cacheFile);
        if (exists) return fs.createReadStream(cacheFile);
      }
      return false;
    }

    if (!cacheFile) {
      this.cache[cacheKey] = result;
    } else {
      const ws = fs.createWriteStream(cacheFile);
      result.pipe(ws);
    }
    return result;
  }
}

module.exports = CommentsService;
