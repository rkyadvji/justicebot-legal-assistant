import { Link } from 'react-router-dom';

export default function ChatFAB() {
  return (
    <Link to="/chatbot" className="chat-fab" title="Open JusticeBot">
      💬
      <span className="chat-fab-tooltip">Ask JusticeBot</span>
    </Link>
  );
}
