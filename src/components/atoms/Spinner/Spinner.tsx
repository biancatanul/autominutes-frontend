import "./Spinner.css";

type SpinnerProps = {
  size?: number;
  color?: string;
};

function Spinner({ size = 20, color }: SpinnerProps) {
  return (
    <div
      className="spinner"
      style={{ width: size, height: size, color: color ?? "var(--primary)" }}
      role="status"
      aria-label="Loading"
    />
  );
}

export default Spinner;