const today = new Date()
today.setHours(0, 0, 0, 0)

export function getWeekStartDate(date: Date): Date {
    const weekStart = new Date(date);
    const dayOfWeek = weekStart.getDay();
    const diff = weekStart.getDate() - dayOfWeek;
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
}
export function getDateStart(date: Date): number {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    return start.getTime()
}

export function isOverlapping(events: Slot[], start: Date, end: Date, flag: boolean): boolean;
export function isOverlapping(events: Slot[], start: Date, end: Date): boolean;
export function isOverlapping(events: Slot[], start: Date,): boolean;

export function isOverlapping(events: Slot[], start: Date, end?: Date, date?: boolean): boolean {
    if (date) {
        if (end)
            return events.some(
                event =>
                    (event.start > start && end > event.start)
            )
    }

    if (end) {
        return events.some(
            event =>
                (start >= event.start && start < event.end)
                || (end > event.start && end <= event.end)
                || (start <= event.start && end >= event.end)
        );
    }

    return events.some(
        event => (start >= event.start && start < event.end)
    )

}

function addDays(date: Date, i: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + i)
    return newDate
}

// function checkBusyDay(slots: Slot[]): boolean {
//     let slots_ = slots.sort((a, b) => a.start.getTime() - b.start.getTime())
//     let hashMap: number[] = Array(16).fill(0)
//     let flag: boolean = false
//     slots_.forEach((slot, i) => {
//         let s = slot.start.getHours() * 2 + slot.start.getMinutes() / 30 - 20
//         let e = slot.start.getHours() * 2 + slot.start.getMinutes() / 30 - 20
//         hashMap[s] = 1
//         hashMap[e] = -1
//     })
//     let sum = hashMap[0]
//     if (sum === 0) flag = true
//     for (let i = 1; i < 16; i++) {
//         if (sum === 0 && hashMap[i] === 0) {
//             flag = true
//             break
//         }
//         sum += hashMap[i]
//     }
//     return flag
// }
// function removeNulls(array: (number | null)[]): number[] {
//     let narray: any[] = []
//     narray = array.filter(item => item !== null)
//     return narray
// }

export function getCurrentWeekDays(selectedDate: Date, allSlots: Slot[]): number[] {
    const selectedWeek = getWeekStartDate(selectedDate)
    if (weekFlag(selectedDate) === 'current') {
        const tomorrow = new Date(getDateStart(new Date()))
        tomorrow.setDate(tomorrow.getDate() + 1)

        return Array.from({ length: 6 - today.getDay() },
            (_, i) => addDays(tomorrow, i).getTime()
        ).filter(item => item !== null)
    }
    return Array.from({ length: 7 }, (_, i) => addDays(selectedWeek, i).getTime());
};

function addMinutes(time: Date, i: number): Date {
    const newTime = new Date(time);
    newTime.setTime(newTime.getTime() + i * 1e3 * 60)
    return newTime
}

export function getBookingLimits(date: Date): { bookingStart: Date, bookingEnd: Date } {
    const st = new Date(date)
    const nd = new Date(date)
    st.setHours(10, 0, 0, 0)
    nd.setHours(18, 0, 0, 0)
    return ({ 'bookingStart': st, 'bookingEnd': nd })
}
export function generateStartTimeOptions(min: Date, max: Date, allSlots: Slot[]): number[] {
    const options: number[] = [];
    let current = min;
    while (current < max) {
        if (!isOverlapping(allSlots, current))
            options.push(current.getTime());
        current = addMinutes(current, 30);
    }
    return options;
};

export function generateEndTimeOptions(min: Date, max: Date, allSlots: Slot[]): number[] {
    const options: number[] = [];
    let current = addMinutes(min, 30);
    while (current <= max) {
        if (!isOverlapping(allSlots, min, current, true))
            options.push(current.getTime());
        current = addMinutes(current, 30);
    }
    return options;
};

export function slotForDate(date: Date, email: string): Slot {
    const { bookingStart, bookingEnd } = getBookingLimits(date)
    return {
        slotID: generateRandomString(8),
        email: email,
        start: bookingStart,
        end: bookingEnd,
        isEditable: false
    }
}
export function weekFlag(givenDate: Date): (boolean | 'current') {
    const currentWeekStart = getWeekStartDate(today)
    const givenWeekStart = getWeekStartDate(givenDate)

    if (givenWeekStart.getTime() === currentWeekStart.getTime()) return 'current'
    return !(givenWeekStart < currentWeekStart)
};

export function slotStyle(slot: Slot) {
    const style = {
        backgroundColor: slot.isEditable ? 'purple' : 'white',
        borderRadius: '5px',
        opacity: slot.isEditable ? 0.9 : 0.4,
        color: 'black',
        border: '0px',
        display: 'block',
    }
    return { style }
}

export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

// export function generateSlotsInTheWeek(date: Date, bookedSlots: Slot[]) {
//     let today = new Date()
//     today.setHours(0, 0, 0, 0)
//     let slots: number[] = Array(7 * 16).fill(0)
//     if (weekFlag(date) === 'current') {
//         let day_num = today.getDay()
//         let i = 7 * 16
//         while (i >= (day_num + 1) * 16) {
//             slots[i - 1] = 1
//             i--
//         }
//     }
//     else {
//         let i = 7 * 16
//         while (i--) slots[i - 1] = 1
//     }
//     console.log(slots)
// }