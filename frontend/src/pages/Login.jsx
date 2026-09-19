import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import Button from "../components/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="font-mono text-xs text-muted tracking-wider mb-3">
          <span className="text-amber">//</span> authentication
        </div>
        <h1 className="font-mono text-3xl font-bold text-cream mb-2">
          $ login
        </h1>
        <p className="text-muted text-sm mb-8 font-mono">
          welcome back to the lab
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" loading={loading}>
            sign_in_ →
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-line font-mono text-xs text-muted">
          no account?{" "}
          <Link to="/register" className="text-amber hover:text-amber-bright transition-colors">
            [ register ]
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
