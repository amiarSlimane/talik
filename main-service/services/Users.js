const axios = require('axios');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');
const util = require('util');
const amqplib = require('amqplib');


const fsexists = util.promisify(fs.exists);

const CircuitBreaker = require('../lib/CircuitBreaker');
const circuitBreaker = new CircuitBreaker();

const rabbitmqHost = process.env.NODE_ENV=='production'?'rabbitmq-service':'localhost';

let q = 'users';
let ch;
(async ()=>{

 try{
  const conn = await amqplib.connect(`amqp://${rabbitmqHost}`);
  ch = await conn.createChannel();
  await ch.assertQueue(q);
 }catch(error){
  console.error(error)
 }

})();

class UsersService {
  constructor({serviceRegistryUrl, serviceVersion}) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersion = serviceVersion;
    this.cache = {};
  }

  async getAllusers(req) {

    const {ip, port} = await this.getService('users-service');
    const {headers} = req;
    let queryString = '';
    const queryArray = Object.entries(req.query);
    queryArray.forEach((item, index)=>{
      queryString = queryString + item[0]+'='+item[1]+ (index<queryArray.length-1?'&':''); 
    })

    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/users?${queryString}`,
      headers: headers,
    });

  }




  async getOneUser(req, userId) {
    const {ip, port} = await this.getService('users-service');

    const {headers} = req;
    

    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/users/${userId}`,
      headers:headers,
    });
  }


  async createOneUserAMQP(body, postId){
    
   
    const qm = JSON.stringify({body, postId});
    return ch.sendToQueue(q, Buffer.from(qm, 'utf8'));
  }
  
  async signup(req) {
    const {ip, port} = await this.getService('users-service');
    const {body} = req;

    const reqOptions = {
      method: 'post',
      url: `http://${ip}:${port}/users/signup`,
      data: body
    }

    return this.callService(reqOptions);
  }


  async login(req) {
    const {ip, port} = await this.getService('users-service');
    const {body} = req;

    const reqOptions = {
      method: 'post',
      url: `http://${ip}:${port}/users/login`,
      data: body
    }

    return this.callService(reqOptions);
  }



  async logout(req) {
    const {ip, port} = await this.getService('users-service');
    const {body} = req;

    const reqOptions = {
      method: 'post',
      url: `http://${ip}:${port}/users/logout`,
      data: body
    }

    return this.callService(reqOptions);
  }


  async forgotPassword(req) {
    const {ip, port} = await this.getService('users-service');
    const {body} = req;

    const reqOptions = {
      method: 'post',
      url: `http://${ip}:${port}/users/forgotPassword`,
      data: body
    }

    return this.callService(reqOptions);
  }

  async resetPassword(req) {
    const {ip, port} = await this.getService('users-service');
    const {body} = req;

    const reqOptions = {
      method: 'patch',
      url: `http://${ip}:${port}/users/resetPassword`,
      data: body
    }

    return this.callService(reqOptions);
  }


  async updateMe(req) {
    const {ip, port} = await this.getService('users-service');
    const {body} = req;
    const reqOptions = {
      method: 'patch',
      url: `http://${ip}:${port}/users/updateMe`,
      data: body
    }

    return this.callService(reqOptions);
  }




  async deleteMe(req) {
    const {ip, port} = await this.getService('users-service');
    const { headers } = req;
    const reqOptions = {
      method: 'delete',
      url: `http://${ip}:${port}/users/deleteMe`,
      headers:headers,
    }

    return this.callService(reqOptions);
  }



  async deleteOneUser(req) {
    const {ip, port} = await this.getService('users-service');

    const { userId } = req.params;
    const { headers } = req;
    
    const reqOptions = {
      method: 'delete',
      url: `http://${ip}:${port}/users/${userId}`,
      headers:headers,
    }

    return this.callService(reqOptions);
  }



  async updateMyPassword(req) {
    const {body} = req;
    const {ip, port} = await this.getService('users-service');

    const reqOptions = {
      method: 'patch',
      url: `http://${ip}:${port}/users/updateMyPassword`,
      data: body
    }

    return this.callService(reqOptions);
  }
   
 

  async getService(serviceName){
    const res = await axios.get(`${this.serviceRegistryUrl}/find/${serviceName}/${this.serviceVersion}`);
    return res.data;
  }

  async callService(reqOptions){
    // console.log('callService reqOptions', reqOptions)

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

module.exports = UsersService;
