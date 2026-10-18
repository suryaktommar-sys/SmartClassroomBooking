export const summaryStats = {
  totalClassrooms: 12,
  availableClassrooms: 7,
  pendingBookings: 4,
  approvedBookings: 9,
}

export const classrooms = [
  { id: 1, name: 'A-101 Lecture Hall', building: 'Arts Block', capacity: 80, type: 'Lecture', status: 'Available' },
  { id: 2, name: 'B-204 Computer Lab', building: 'Science Block', capacity: 40, type: 'Lab', status: 'Occupied' },
  { id: 3, name: 'C-310 Seminar Room', building: 'Admin Block', capacity: 24, type: 'Seminar', status: 'Available' },
  { id: 4, name: 'A-215 Classroom', building: 'Arts Block', capacity: 50, type: 'Classroom', status: 'Available' },
  { id: 5, name: 'D-102 Auditorium', building: 'Main Block', capacity: 180, type: 'Auditorium', status: 'Occupied' },
  { id: 6, name: 'B-118 Physics Lab', building: 'Science Block', capacity: 30, type: 'Lab', status: 'Maintenance' },
  { id: 7, name: 'C-205 Smart Classroom', building: 'Admin Block', capacity: 45, type: 'Classroom', status: 'Available' },
  { id: 8, name: 'A-302 Tutorial Room', building: 'Arts Block', capacity: 20, type: 'Tutorial', status: 'Available' },
]

export const bookings = [
  { id: 1, room: 'A-101 Lecture Hall', faculty: 'Dr. Meera Sharma', date: '13 Oct 2026', time: '09:00 – 11:00', purpose: 'Guest lecture', status: 'Approved' },
  { id: 2, room: 'B-204 Computer Lab', faculty: 'Prof. Arjun Patel', date: '13 Oct 2026', time: '11:30 – 13:30', purpose: 'Programming lab', status: 'Pending' },
  { id: 3, room: 'C-310 Seminar Room', faculty: 'Dr. Kavita Nair', date: '14 Oct 2026', time: '10:00 – 12:00', purpose: 'Department meeting', status: 'Approved' },
  { id: 4, room: 'D-102 Auditorium', faculty: 'Prof. Rohan Iyer', date: '14 Oct 2026', time: '14:00 – 16:00', purpose: 'Orientation', status: 'Rejected' },
  { id: 5, room: 'C-205 Smart Classroom', faculty: 'Dr. Ananya Gupta', date: '15 Oct 2026', time: '09:30 – 11:00', purpose: 'Workshop', status: 'Pending' },
  { id: 6, room: 'A-215 Classroom', faculty: 'Prof. Vikram Singh', date: '15 Oct 2026', time: '13:00 – 15:00', purpose: 'Tutorial session', status: 'Approved' },
]

export const myBookings = [
  { id: 2, room: 'B-204 Computer Lab', date: '13 Oct 2026', time: '11:30 – 13:30', purpose: 'Programming lab', status: 'Pending' },
  { id: 6, room: 'A-215 Classroom', date: '15 Oct 2026', time: '13:00 – 15:00', purpose: 'Tutorial session', status: 'Approved' },
  { id: 7, room: 'A-302 Tutorial Room', date: '16 Oct 2026', time: '10:00 – 11:00', purpose: 'Doubt clearing', status: 'Pending' },
]
