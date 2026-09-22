import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import Button from "../components/Button";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="font-mono text-xs text-muted tracking-wider mb-3">
          <span className="text-amber">//</span> new_user
        </div>
        <h1 className="font-mono text-3xl font-bold text-cream mb-2">
          $ register
        </h1>
        <p className="text-muted text-sm mb-8 font-mono">
          create your account to start coding
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            placeholder="min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="confirm_password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" loading={loading}>
            create_account_ →
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-line font-mono text-xs text-muted">
          already have an account?{" "}
          <Link to="/login" className="text-amber hover:text-amber-bright transition-colors">
            [ login ]
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
