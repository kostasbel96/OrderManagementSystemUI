import { useEffect, useState } from "react";
import {
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

const DEFAULT_API = import.meta.env.VITE_API_URL;

export default function MySettings() {
    const [apiUrl, setApiUrl] = useState("");
    const [error, setError] = useState("");

    // 🔹 Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("apiUrl");
        setApiUrl(saved || DEFAULT_API);
    }, []);

    // 🔹 Simple validation
    const validate = (url: string) => {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            return "Must start with http:// or https://";
        }
        return "";
    };

    // 🔹 Save handler
    const handleSave = () => {
        const err = validate(apiUrl);
        if (err) {
            setError(err);
            return;
        }

        localStorage.setItem("apiUrl", apiUrl);
        setError("");

        alert("Saved! Restart or reload app.");
    };

    return (
        <Paper
            sx={{
                p: 2,
                maxWidth: 400,
                margin: "0 auto",
                borderRadius: 2,
            }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                Settings
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Backend URL"
                    size="small"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    error={Boolean(error)}
                    helperText={error || "e.g. http://192.168.1.10:8080"}
                    fullWidth
                />

                <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{ textTransform: "none" }}
                >
                    Save
                </Button>
            </Stack>
        </Paper>
    );
}