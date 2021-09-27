// Title component
import AuthService from '../../services/AuthService'


export default () => {
  return (
    <div className="title">
      <span className="bold-title">Food-O</span>
      <button onClick={AuthService.logout} className="logout">Logout</button>
    </div>
  );
};
