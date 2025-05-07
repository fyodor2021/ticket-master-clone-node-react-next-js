import axios from 'axios';
import { useState } from 'react';
export default ({ url, method, body,onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async (props = {}) => {
    try {
      const res = await axios[method](url, 
        {...body, ...props}
      );
      if(onSuccess){
        onSuccess(res.data);
      }
      return res.data;
    } catch (e) {
        console.log(e)
        setErrors( <div className="alert alert-danger">
          <ul className="my-0">
            {e && e.response.data.errors.map((err,index) => (
              <li key={index}>{err.message}</li>
            ))}
          </ul>
        </div>)
    }
  };
  return { doRequest, errors };
};
