import Link from 'next/link'

const LandingPage = ({ currentUser, tickets }) => {
  const ticketRows = tickets.map((ticket) => {
   return <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="/tickets/[ticketId]"
       as={`/tickets/${ticket.id}`}>View</Link>
       </td>
    </tr>;
  });
  return (
    <div>
      <h2>tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketRows}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
