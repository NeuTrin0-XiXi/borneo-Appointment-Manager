import React, { useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material';

interface props {
    loginUser: (user: string, name: string) => void
}
const LoginPage: React.FC<props> = ({ loginUser }) => {
    const [formValues, setFormValues] = useState({
        email: '',
        name: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginUser(formValues.email, formValues.name)
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100vh' }}>
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: { xs: '20px', md: '40px' }, 
                }}
            >
                <img
                    src="./einstein.svg"
                    alt="Albert Einstein"
                    style={{ width: '75%', height: 'auto', borderRadius: '10px' }}
                />
                <Typography
                    variant="body1"
                    sx={{
                        width: { xs: '90%', md: '75%' }, 
                        textAlign: 'center',
                    }}
                >
                    "The important thing is not to stop questioning. Curiosity has its own reason for existing."
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Schedule an Appointment Now! with Albert Einstein
                </Typography>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: { xs: '20px', md: '40px' }, 
                }}
            >
                <Box mb={2}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}
                >
                    <Typography variant="h3" gutterBottom sx={{ textAlign: 'center' }}>
                        Knowledge I/O with Einstein
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Powered By
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            sx={{
                                color: 'white',
                                backgroundColor: 'rgba(34,37,50,255)',
                                height: '30px',
                                alignContent: 'center',
                                padding: '8px',
                                borderRadius: '20px',
                                textAlign: 'center', 
                            }}
                        >
                            borneo.io Appointments™
                        </Typography>
                    </Box>
                </Box>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                >
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        required
                        value={formValues.email}
                        onChange={handleChange}
                        fullWidth 
                        sx={{ maxWidth: '400px' }} 
                    />
                    <TextField
                        label="Name"
                        name="name"
                        type="text"
                        required
                        value={formValues.name}
                        onChange={handleChange}
                        fullWidth 
                        sx={{ maxWidth: '400px' }} 
                    />

                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        required
                        value={formValues.password}
                        onChange={handleChange}
                        fullWidth 
                        sx={{ maxWidth: '400px' }} 
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ width: { xs: '100%', md: 'auto' }, maxWidth: '200px' }} 
                    >
                        Book Now!
                    </Button>
                </Box>
            </Box>
        </Box>

    )
}
export default LoginPage