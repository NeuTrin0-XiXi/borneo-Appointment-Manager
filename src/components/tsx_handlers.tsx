// Handlers returnign jsx/tsx
import { toast } from 'react-toastify';
import { CheckCircle } from '@mui/icons-material';

export function notifyBooking(name: string, date: string, start: string, end: string): void {
    toast(
        <div style={{ display: 'flex', alignItems: 'center', padding: '0px', width: '100%', maxWidth: '3000px' }}> {/* Widened max width */}
            <CheckCircle style={{ fontSize: '48px', color: '#4caf50' }} />
            <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0', color: '#333' }}>Congratulations {name}!</h2>
                <p >Your booking details are as follows:</p>
                <div >
                    <p><strong style={{ color: '#4caf50' }}>Date:</strong> {date}</p>
                    <p><strong style={{ color: '#4caf50' }}>Start Time:</strong> {start}</p>
                    <p><strong style={{ color: '#4caf50' }}>End Time:</strong> {end}</p>
                </div>
                <p style={{ fontStyle: 'italic', color: '#555', marginTop: '10px' }}>
                    "Imagination is more important than knowledge."
                </p>
                <button
                    onClick={() => toast.dismiss()}
                    style={{ padding: '10px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#4caf50', color: '#fff', cursor: 'pointer' }}
                >
                    Okay
                </button>
            </div>
        </div>,
        {
            position: 'top-center',
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        }
    );
};