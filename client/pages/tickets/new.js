import {useState} from 'react'
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'

const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const {doRequest, errors} = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title, price
    },
    onSuccess: ticket => Router.push('/')
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    doRequest();
  }
  const handleBlur = () => {
    const value = parseFloat(price)
    if(isNaN(value)){
      return
    }

    setPrice(value.toFixed(2));
  }
  return (
    <div>
      <h1>Creating a ticket</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control "/>
        </div>
        <div className="form-group">
          <label>price</label>
          <input value={price}
          onBlur={handleBlur} onChange={(e) => setPrice(e.target.value)} className="form-control "/>
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
