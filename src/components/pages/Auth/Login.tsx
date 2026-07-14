type LoginProps = {
    onLogin: () => void;
};

function Login({ onLogin }: LoginProps) {
    return (
        <div className="login-page">
            

            <button onClick={onLogin}>
                Login
            </button>
        </div>
    );
}

export default Login;