import React, { useEffect, useState } from 'react';
import { format } from "date-fns"
import {
    generateStartTimeOptions, getBookingLimits,
    getCurrentWeekDays, getDateStart, generateEndTimeOptions
} from './handlers';
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
} from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface props {
    open: boolean;
    modalForEdit: boolean;
    selectedSlot: Slot;
    allSlots: Slot[];
    closeModal: () => void;
    scheduleMeet: (slot: Slot, mode: 'delete' | 'edit' | 'add') => void;
}
const BookAMeet: React.FC<props> = ({ open, closeModal, scheduleMeet, selectedSlot, modalForEdit, allSlots }) => {

    // variables for form control
    const [startTime, setStartTime] = useState<number>(selectedSlot.start.getTime());
    const [endTime, setEndTime] = useState<number>(selectedSlot.end.getTime());
    const [selectedDate, setSelectedDate] = useState<number>(getDateStart(selectedSlot.start))

    // list of days available in the form 
    const [getWeekDays,] = useState(getCurrentWeekDays(selectedSlot.start, allSlots))

    // restriction of timeslots within a given date
    const [bookingLimits, setBookingLimits] = useState(getBookingLimits(new Date(selectedDate)))
    useEffect(() => {
        setBookingLimits(getBookingLimits(new Date(selectedDate)))
    }, [selectedDate])

    // Options for start time of open slots - based on already booked ones 
    const [startTimeOptions, setStartTimeOptions] = useState<number[]>(generateStartTimeOptions(bookingLimits.bookingStart, bookingLimits.bookingEnd, allSlots))

    useEffect(() => {
        setStartTimeOptions(generateStartTimeOptions(bookingLimits.bookingStart, bookingLimits.bookingEnd, allSlots))
    }, [bookingLimits, allSlots])


    // Options for end time of open slots - based on start time and aleady booked slots
    const [endTimeOptions, setEndTimeOptions] = useState<number[]>(generateEndTimeOptions(new Date(startTime), bookingLimits.bookingEnd, allSlots))

    useEffect(() => {
        setEndTimeOptions(generateEndTimeOptions(new Date(startTime), bookingLimits.bookingEnd, allSlots))
    }, [startTime, bookingLimits, allSlots])


    // making sure that dates stay within avaible timestamps - needs better checks
    useEffect(() => {
        if (!startTimeOptions.includes(startTime))
            setStartTime(startTimeOptions[0])
    }, [startTimeOptions, startTime])

    useEffect(() => {
        if (!endTimeOptions.includes(endTime))
            setEndTime(endTimeOptions[0])
    }, [endTimeOptions, endTime])

    return (
        <Modal open={open} onClose={closeModal}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    Your scheduling requirement
                </Typography>
                <form
                    onSubmit={e => {
                        e.preventDefault()
                        scheduleMeet({
                            'slotID': selectedSlot.slotID,
                            'email': selectedSlot.email,
                            'start': new Date(startTime),
                            'end': new Date(endTime),
                            'isEditable': true
                        }, modalForEdit ? 'edit' : 'add')
                    }}
                >
                    <TextField
                        select
                        label="Date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={selectedDate}
                        onChange={e => setSelectedDate(Number(e.target.value))}
                        required
                    >
                        {getWeekDays.map((day, index) => {
                            return (
                                <MenuItem key={index} value={day}>
                                    {format(new Date(day), 'EEEE, MMM d')}
                                </MenuItem>
                            )
                        })}
                    </TextField>

                    <TextField
                        select
                        label="Start Time"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={startTime}
                        onChange={e => setStartTime(Number(e.target.value))}
                        required
                    >
                        {startTimeOptions.map((time, index) => (
                            <MenuItem key={index} value={time}>
                                {format(time, 'HH:mm')}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="End Time"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={endTime}
                        onChange={(e) => setEndTime(Number(e.target.value))}
                        required
                    >
                        {endTimeOptions.map((time, index) => (
                            <MenuItem key={index} value={time}>
                                {format(time, 'HH:mm')}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                        {
                            modalForEdit ? (
                                <Button variant="contained" color="error"
                                    onClick={() => scheduleMeet(selectedSlot, 'delete')}
                                >
                                    Delete
                                </Button>
                            )
                                : <div></div>
                        }
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default BookAMeet;
