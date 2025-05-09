import axios from 'axios';


export default ({req}) => {
  if(typeof window === 'undefined'){
    //must be on the server
    return axios.create({
      baseURL: 'http://www.master-ticketing.com/',
      headers: req.headers
    });
  }else{
    //must be on the browser
    return axios.create({
      baseURL: '/',
    });
  }
}

//http://ingress-nginx-controller.ingress-nginx.svc.cluster.local