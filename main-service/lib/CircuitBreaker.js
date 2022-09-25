const axios = require('axios');

class CircuitBreaker {
    constructor(){
        this.states = {};
        this.failureThreshold = 5;
        this.coolDownPeriod = 10;
        this.requestTimeout = 2;
    }

    async callService(reqOptions){
        const endpoint = `${reqOptions.method}:${reqOptions.url}`;

        if(!this.canRequest(endpoint)) return false;

        reqOptions.timeout = this.requestTimeout * 1000;

        try{
            const res = await axios(reqOptions);
            // console.log('res ', res);
            this.onSuccess(endpoint);
            return {statusCode:res.status, data:res.data};
        }catch(error){
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                this.onSuccess(endpoint);
                return {statusCode:error.response.status, data:error.response.data};
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                // console.log('error.request ',error.request);
                this.onFailure(endpoint);
                return false;
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
                this.onFailure(endpoint);
                return false;
              }
            //   console.log(error.config);

            
        }
      }

    onSuccess(endpoint) {
        this.initState(endpoint);
    }

    onFailure(endpoint){
        const state = this.states[endpoint];
        state.failures +=1;
        if(state.failures > this.failureThreshold){
            state.circuit = "OPEN";
            state.nextTry = new Date() / 1000 + this.coolDownPeriod;
            console.log(`Alert! Circuit for ${endpoint} is in state 'OPEN'`);
        }
    }

    canRequest(endpoint){
        if(!this.states[endpoint]) this.initState(endpoint);
        const state = this.states[endpoint];
        if(state.circuit === 'CLOSED') return true;
        const now = new Date() / 1000;
        if(state.nextTry <= now){
            state.circuit = "HALF";
            return true;
        }

        return false;
    }

    initState(endpoint){
        this.states[endpoint] = {
            failures: 0,
            coolDownPeriod: this.coolDownPeriod,
            circuit: "CLOSED",
            nextTry: 0
        }
    }
}

module.exports = CircuitBreaker; 