type ToastProps = {
  message: string;
  visible: boolean;
};

export default function Toast({ message, visible }: ToastProps) {
  return (
    <div className={`toast${visible ? ' show' : ''}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
