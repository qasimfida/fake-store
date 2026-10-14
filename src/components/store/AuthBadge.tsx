import { useEffect, useState } from "react";
import { clearSession, isLoggedIn, readUser } from "../../lib/auth";

export default function AuthBadge() {
	const [username, setUsername] = useState<string | null>(null);

	useEffect(() => {
		const sync = () => {
			setUsername(isLoggedIn() ? readUser()?.username ?? null : null);
		};
		sync();
		window.addEventListener("auth-updated", sync);
		window.addEventListener("storage", sync);
		return () => {
			window.removeEventListener("auth-updated", sync);
			window.removeEventListener("storage", sync);
		};
	}, []);

	if (!username) {
		return (
			<a href="/store/checkout" className="auth-badge">
				Sign in
			</a>
		);
	}

	return (
		<span className="auth-badge auth-badge--user">
			<span>{username}</span>
			<button type="button" onClick={() => clearSession()}>
				Sign out
			</button>
		</span>
	);
}
