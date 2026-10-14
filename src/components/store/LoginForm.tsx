import { useState } from "react";
import { writeSession, type AuthUser } from "../../lib/auth";
import {
	decodeTokenUserId,
	getUser,
	getUsers,
	login,
	registerUser,
} from "../../lib/fakestore";

interface Props {
	onSuccess?: (user: AuthUser) => void;
}

type Mode = "login" | "register";

export default function LoginForm({ onSuccess }: Props) {
	const [mode, setMode] = useState<Mode>("login");
	const [username, setUsername] = useState("johnd");
	const [password, setPassword] = useState("m38rmF$");
	const [email, setEmail] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [phone, setPhone] = useState("");
	const [city, setCity] = useState("");
	const [street, setStreet] = useState("");
	const [number, setNumber] = useState("1");
	const [zipcode, setZipcode] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	async function handleLogin(e: { preventDefault(): void }) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			const { token } = await login(username.trim(), password);
			const userId = decodeTokenUserId(token);
			let user = userId ? await getUser(userId).catch(() => null) : null;
			if (!user) {
				const users = await getUsers();
				user =
					users.find((u) => u.username === username.trim()) ?? null;
			}
			if (!user) throw new Error("Logged in, but user profile was not found.");
			const sessionUser: AuthUser = {
				id: user.id,
				email: user.email,
				username: user.username,
				name: user.name,
				phone: user.phone,
				address: {
					city: user.address.city,
					street: user.address.street,
					number: user.address.number,
					zipcode: user.address.zipcode,
				},
			};
			writeSession(token, sessionUser);
			onSuccess?.(sessionUser);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Login failed. Try the demo account below.",
			);
		} finally {
			setBusy(false);
		}
	}

	async function handleRegister(e: { preventDefault(): void }) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			const created = await registerUser({
				email: email.trim(),
				username: username.trim(),
				password,
				firstname: firstname.trim(),
				lastname: lastname.trim(),
				phone: phone.trim(),
				city: city.trim(),
				street: street.trim(),
				number: Number(number) || 1,
				zipcode: zipcode.trim(),
			});
			// FakeStoreAPI signup is fake — sign in with a known demo user after register demo.
			// Prefer logging in with the credentials just submitted if the API accepts them.
			try {
				const { token } = await login(username.trim(), password);
				const userId = decodeTokenUserId(token) ?? created.id;
				const profile = await getUser(userId).catch(() => created);
				const sessionUser: AuthUser = {
					id: profile.id,
					email: profile.email || email.trim(),
					username: profile.username || username.trim(),
					name: profile.name || {
						firstname: firstname.trim(),
						lastname: lastname.trim(),
					},
					phone: profile.phone || phone.trim(),
					address: {
						city: profile.address?.city || city.trim(),
						street: profile.address?.street || street.trim(),
						number: profile.address?.number || Number(number) || 1,
						zipcode: profile.address?.zipcode || zipcode.trim(),
					},
				};
				writeSession(token, sessionUser);
				onSuccess?.(sessionUser);
			} catch {
				// Registration succeeded on the fake API but login may reject new users.
				// Keep a local session from the form so checkout can continue.
				const sessionUser: AuthUser = {
					id: created.id || 1,
					email: email.trim(),
					username: username.trim(),
					name: {
						firstname: firstname.trim(),
						lastname: lastname.trim(),
					},
					phone: phone.trim(),
					address: {
						city: city.trim(),
						street: street.trim(),
						number: Number(number) || 1,
						zipcode: zipcode.trim(),
					},
				};
				writeSession(`local-${created.id}`, sessionUser);
				onSuccess?.(sessionUser);
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Registration failed.",
			);
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="auth-panel">
			<div className="auth-tabs">
				<button
					type="button"
					className={mode === "login" ? "is-active" : ""}
					onClick={() => setMode("login")}
				>
					Sign in
				</button>
				<button
					type="button"
					className={mode === "register" ? "is-active" : ""}
					onClick={() => setMode("register")}
				>
					Register
				</button>
			</div>

			{mode === "login" ? (
				<form className="store-form" onSubmit={handleLogin}>
					<p className="store-form-hint">
						Demo: <code>johnd</code> / <code>m38rmF$</code>
					</p>
					<label>
						Username
						<input
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							autoComplete="username"
							required
						/>
					</label>
					<label>
						Password
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current-password"
							required
						/>
					</label>
					{error && <p className="store-form-error">{error}</p>}
					<button type="submit" className="store-btn" disabled={busy}>
						{busy ? "Signing in…" : "Sign in with FakeStoreAPI"}
					</button>
				</form>
			) : (
				<form className="store-form" onSubmit={handleRegister}>
					<p className="store-form-hint">
						Creates a user via <code>POST /users</code>.
					</p>
					<div className="store-form-row">
						<label>
							First name
							<input
								value={firstname}
								onChange={(e) => setFirstname(e.target.value)}
								required
							/>
						</label>
						<label>
							Last name
							<input
								value={lastname}
								onChange={(e) => setLastname(e.target.value)}
								required
							/>
						</label>
					</div>
					<label>
						Email
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</label>
					<label>
						Username
						<input
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</label>
					<label>
						Password
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</label>
					<label>
						Phone
						<input
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							required
						/>
					</label>
					<label>
						Street
						<input
							value={street}
							onChange={(e) => setStreet(e.target.value)}
							required
						/>
					</label>
					<div className="store-form-row">
						<label>
							Number
							<input
								value={number}
								onChange={(e) => setNumber(e.target.value)}
								required
							/>
						</label>
						<label>
							City
							<input
								value={city}
								onChange={(e) => setCity(e.target.value)}
								required
							/>
						</label>
						<label>
							Zip
							<input
								value={zipcode}
								onChange={(e) => setZipcode(e.target.value)}
								required
							/>
						</label>
					</div>
					{error && <p className="store-form-error">{error}</p>}
					<button type="submit" className="store-btn" disabled={busy}>
						{busy ? "Creating…" : "Create account"}
					</button>
				</form>
			)}
		</div>
	);
}
