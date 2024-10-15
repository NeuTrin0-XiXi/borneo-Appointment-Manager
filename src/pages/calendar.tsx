import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer, Event, Views, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '../styles/calendar.css'
import { Button, Box, Typography } from '@mui/material'
import BookAMeet from '../components/modal'
import {
  weekFlag, slotStyle, generateRandomString,
  isOverlapping, getBookingLimits, slotForDate, getDateStart
} from '../components/handlers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns'
import { notifyBooking } from '../components/tsx_handlers'

const localizer = momentLocalizer(moment)
const today = new Date()

// global declaration of Slot Class for better abstraction
declare global {
  interface Slot extends Event {
    slotID: string
    email: string;
    start: Date;
    end: Date;
    isEditable: boolean;
  }
}

// type reference for passable props
interface props {
  user: { email: string, name: string }
}

const { bookingStart, bookingEnd } = getBookingLimits(today)

const AppointmentCalendar: React.FC<props> = ({ user }) => {
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState<Date>(new Date());
  const [modalForEdit, setModalForEdit] = useState<boolean>(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot>(slotForDate(new Date(), user.email))

  // to manually trigger slot refresh
  const [refreshCount, refresh] = useState<number>(0)


  useEffect(() => {
    if (weekFlag(date) === 'current') {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      setSelectedSlot(slotForDate(tomorrow, user.email))
      return
    }
    if (weekFlag(date))
      setSelectedSlot(slotForDate(date, user.email))
  }, [date, refreshCount, user.email])

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const openModal = (): void =>
    setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setModalForEdit(false)
    refresh(prev => prev + 1)
  }

// dummy data - represents slots booked by you or others
  const [events, setEvents] = useState<Slot[]>([
    {
      slotID: '1',
      email: 'someotheruser@borneo.io',
      start: new Date(2024, 9, 15, 10, 0),
      end: new Date(2024, 9, 15, 11, 0),
      isEditable: true
    },
    {
      slotID: '6',
      email: 'someotheruser@borneo.io',
      start: new Date(2024, 9, 15, 11, 0),
      end: new Date(2024, 9, 15, 11, 30),
      isEditable: true
    },
    {
      slotID: '2',
      email: 'someotheruser2@borneo.io',
      start: new Date(2024, 9, 16, 12, 0),
      end: new Date(2024, 9, 16, 13, 0),
      isEditable: false
    },
  ]);


// editing an already booked slot - if posted by you
  const handleEditSlot = (slot: Slot): any => {
    if (!slot.isEditable) return

    if (getDateStart(slot.start) <= getDateStart(today))
      return toast.error("You can only modify time slots for future dates :(")
    console.log(slot)
    setSelectedSlot(slot)
    setModalForEdit(true)
    setModalOpen(true)
  }

// controller for drag selection of slots
  const handleSlotSelection = ({ start, end }: { start: Date, end: Date }) => {
    if (view === Views.MONTH) {
      setDate(start)
      setView(Views.WEEK)
      return
    }

    if (getDateStart(start) < getDateStart(today)) return

    if (getDateStart(start) === getDateStart(today)) {
      toast.warning('Bookings must be made at least one day in advance!', {
        position: 'top-center'
      })
      return
    }

    if (isOverlapping(events, start, end)) {
      toast.error('The selected period overlaps with a schedule!', {
        position: 'top-center'
      })
      return
    }
    setSelectedSlot({
      'slotID': generateRandomString(8),
      'email': user.email,
      'start': start,
      'end': end,
      'isEditable': false
    })
    setModalOpen(true)

  }

// slot addition/editing/deletion handler - changes data on the frontend - later, the same could be extended 
// to include passage of information to the database using API endpoints
  const scheduleMeet = (slot: Slot, mode: 'delete' | 'edit' | 'add') => {
    switch (mode) {
      case 'delete':
        setEvents(events.filter(event => event.slotID !== slot.slotID))
        break

      case 'add':
        setEvents([...events, slot])
        notifyBooking(
          user.name
          , format(slot.start, 'd MMMM')
          , format(slot.start, 'h:mm a')
          , format(slot.end, 'h:mm a')
        )
        break

      case 'edit':
        setEvents(events.map(event => event.slotID === slot.slotID ? slot : event))
        break
    }
    closeModal();
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center', color: 'white', backgroundColor: 'rgba(34,37,50,255)'
        }}
      >
        <Typography variant="h4" sx={{ textAlign: 'center', margin: '10px' }}>
          Knowledge I/O with Einstein
        </Typography>

        <Typography
          style={{
            alignContent: 'center', marginTop: '10px'
          }}
        >
          (Powered by borneo.io Appointments™)
        </Typography>
      </Box>
      <div
        className="space-time-calendar"
      >
        {
          view === Views.MONTH ?
            <Typography variant="h4" gutterBottom >
              Choose a week!
            </Typography>
            : <Typography variant="h4" gutterBottom >
              Book a slot!
            </Typography>
        }
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"

          timeslots={1}
          step={30}
          min={bookingStart}
          max={bookingEnd}
          date={date}
          view={view}
          onView={setView}
          onNavigate={setDate}

          style={{ height: 500 }}
          views={['month', 'week']}
          eventPropGetter={slotStyle}
          onSelectSlot={(slotInfo) => handleSlotSelection(slotInfo)}
          onDoubleClickEvent={handleEditSlot}
          selectable
        />
        <div style={{
          margin: '10px 0px 0px',
          textAlign: "right"
        }}
        >
          {
            view === Views.WEEK ?
              weekFlag(date) ?
                <Button variant="contained" onClick={openModal}>
                  Select Slot
                </Button>
                :
                <Button variant="contained" disabled>
                  Select Slot
                </Button>
              : null
          }
        </div>
        {
          isModalOpen ?
            <BookAMeet
              open={isModalOpen}
              modalForEdit={modalForEdit}
              selectedSlot={selectedSlot}
              allSlots={events}
              closeModal={closeModal}
              scheduleMeet={scheduleMeet}
            />
            : <></>
        }
      </div >
      <ToastContainer
        style={{ width: '30%' }}
      />
    </>
  )
}

export default AppointmentCalendar
