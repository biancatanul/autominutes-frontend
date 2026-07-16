function forgotPassword() {
  return (
    <div className = "forgot-password-page">
      <h1>Forgot Password</h1>
      <p>Please enter your email address to reset your password.</p>
      <input type = "email" placeholder = "Email" />
      <button>Reset Password</button>
    </div>
  );
}

export default forgotPassword;