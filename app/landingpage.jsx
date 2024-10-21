import Link from 'next/link';
import './landing.css'; // Global CSS

export default function LandingPage() {
  return (
    <div className="container">
      <div className="content">
        <h1>Welcome to the Management System</h1>
        <p>Your solution for managing teams and projects efficiently.</p>
        <div className="buttons">
          <Link href="/signin">
            <button className="loginButton">Login</button>
          </Link>
          <Link href="/signup">
            <button className="signupButton">Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
