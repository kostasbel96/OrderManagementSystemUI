// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Alert,
    CircularProgress
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {loginUser} from "../services/loginService.ts";

const LoginPage = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        loginUser(username, password).then((token) => {
            login(token);
            navigate("/");
        }).catch(err => {
            console.log(err);
            setError(err.message);
        }).finally(()=>setLoading(false));
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f0f2f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: 380,
                    p: 4,
                    borderRadius: 2,
                    borderTop: "4px solid #1976d2",
                }}
            >
                {/* Header */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                    <Box
                        sx={{
                            backgroundColor: "#1976d2",
                            borderRadius: "50%",
                            p: 1,
                            mb: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <LockOutlinedIcon sx={{ color: "white", fontSize: 24 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={600} color="text.primary">
                        Login
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Order Management System
                    </Typography>
                </Box>

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <Alert severity="error" sx={{ py: 0.5 }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 1, py: 1 }}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Login"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;