import {format} from 'date-fns';
const Footer = () => {
  const year = format(new Date(), "yyyy");
  return (
    <footer className='Footer'>
      <p>
        Copyright &copy; {year}
      </p>
    </footer>
  )
}

export default Footer