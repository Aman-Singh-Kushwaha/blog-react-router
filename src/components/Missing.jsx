import {Link} from 'react-router-dom'

const Missing = () => {
  return (
    <main className='Missing'>
      <h2>404 Page Not Found</h2>
      <p>Well that's Disapponting.</p>
      <p>
        <Link to="/">
          Visit Out HomePage
        </Link>
      </p>
    </main>
  )
}

export default Missing