export type UserRole = 'admin' | 'operator' | 'user';

export interface AppUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  blocked: boolean;
  createdAt: string;
}

export interface ManagedTour {
  id: number;
  name: string;
  region: string;
  category: string;
  difficulty: 'Fácil' | 'Moderado' | 'Difícil';
  price: number;
  groupPrice: number;
  duration: string;
  maxGroup: number;
  rating: number;
  reviews: number;
  shortDescription: string;
  heroImage: string;
  gallery: string[];
  description: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  meetingPoint: string;
  availableDates: { date: string; spots: number }[];
  ownerId: string;
  active: boolean;
}

export interface SaleRecord {
  id: string;
  tourName: string;
  tourDate: string;
  passenger: string;
  email: string;
  passengers: number;
  amount: number;
  status: 'Confirmada' | 'Pendiente' | 'Rechazada' | 'Cancelada';
  operator: string;
  createdAt: string;
}

export const INITIAL_USERS: AppUser[] = [
  {
    id: '1',
    email: 'admin@admin.cl',
    password: 'admin123',
    name: 'Administrador Sistema',
    role: 'admin',
    blocked: false,
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    email: 'tour@operador.cl',
    password: 'tour123',
    name: 'TourOperador Puerto Varas',
    role: 'operator',
    blocked: false,
    createdAt: '2026-02-15',
  },
  {
    id: '3',
    email: 'user@user.cl',
    password: 'user123',
    name: 'Cliente Registrado',
    role: 'user',
    blocked: false,
    createdAt: '2026-03-20',
  },
  {
    id: '4',
    email: 'ana.soto@gmail.com',
    password: 'ana123',
    name: 'Ana Soto López',
    role: 'user',
    blocked: false,
    createdAt: '2026-04-05',
  },
  {
    id: '5',
    email: 'carlos.m@outlook.com',
    password: 'carlos123',
    name: 'Carlos Muñoz Pérez',
    role: 'user',
    blocked: true,
    createdAt: '2026-04-18',
  },
];

export interface Participant {
  id: string;
  tourId: number;
  tourName: string;
  tourDate: string;
  fullName: string;
  email: string;
  phone: string;
  passengers: number;
  inscriptionDate: string;
  paymentStatus: 'Pagado' | 'Pendiente' | 'Reembolsado';
  amount: number;
}

export interface UserBooking {
  id: string;
  tourName: string;
  bookingDate: string;
  travelDate: string;
  status: 'Confirmado' | 'Pendiente' | 'Finalizado' | 'Cancelado';
  passengers: number;
  amount: number;
  tourImage: string;
  region: string;
}

export const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'INS-001', tourId: 1, tourName: 'Saltos del Petrohué', tourDate: '2026-06-20', fullName: 'María González Ruiz', email: 'mgonzalez@gmail.com', phone: '+56 9 8123 4567', passengers: 2, inscriptionDate: '2026-06-10', paymentStatus: 'Pagado', amount: 70000 },
  { id: 'INS-002', tourId: 1, tourName: 'Saltos del Petrohué', tourDate: '2026-06-20', fullName: 'Carlos Muñoz Pérez', email: 'cmuñoz@outlook.com', phone: '+56 9 7234 5678', passengers: 1, inscriptionDate: '2026-06-11', paymentStatus: 'Pagado', amount: 35000 },
  { id: 'INS-003', tourId: 1, tourName: 'Saltos del Petrohué', tourDate: '2026-06-20', fullName: 'Ana Soto López', email: 'asoto@gmail.com', phone: '+56 9 6345 6789', passengers: 3, inscriptionDate: '2026-06-12', paymentStatus: 'Pendiente', amount: 105000 },
  { id: 'INS-004', tourId: 1, tourName: 'Saltos del Petrohué', tourDate: '2026-07-04', fullName: 'Roberto Díaz Vera', email: 'rdiaz@gmail.com', phone: '+56 9 5456 7890', passengers: 2, inscriptionDate: '2026-06-20', paymentStatus: 'Pagado', amount: 70000 },
  { id: 'INS-005', tourId: 1, tourName: 'Saltos del Petrohué', tourDate: '2026-07-04', fullName: 'Sofía Cárdenas', email: 'scardenas@gmail.com', phone: '+56 9 4111 2233', passengers: 1, inscriptionDate: '2026-06-21', paymentStatus: 'Pagado', amount: 35000 },
  { id: 'INS-006', tourId: 2, tourName: 'Volcán Osorno', tourDate: '2026-07-01', fullName: 'Valentina Rojas Acuña', email: 'vrojas@gmail.com', phone: '+56 9 4567 8901', passengers: 1, inscriptionDate: '2026-06-14', paymentStatus: 'Pagado', amount: 89000 },
  { id: 'INS-007', tourId: 2, tourName: 'Volcán Osorno', tourDate: '2026-07-01', fullName: 'Felipe Morales Ibáñez', email: 'fmorales@gmail.com', phone: '+56 9 3678 9012', passengers: 2, inscriptionDate: '2026-06-15', paymentStatus: 'Pagado', amount: 178000 },
  { id: 'INS-008', tourId: 2, tourName: 'Volcán Osorno', tourDate: '2026-07-15', fullName: 'Daniela Vega Ríos', email: 'dvega@gmail.com', phone: '+56 9 2789 0123', passengers: 1, inscriptionDate: '2026-06-15', paymentStatus: 'Reembolsado', amount: 89000 },
  { id: 'INS-009', tourId: 2, tourName: 'Volcán Osorno', tourDate: '2026-07-15', fullName: 'Andrés Pinto Leiva', email: 'apinto@gmail.com', phone: '+56 9 1234 5555', passengers: 2, inscriptionDate: '2026-06-22', paymentStatus: 'Pagado', amount: 178000 },
  { id: 'INS-010', tourId: 3, tourName: 'Termas de Puyehue', tourDate: '2026-06-21', fullName: 'Matías Fernández Osses', email: 'mfernandez@gmail.com', phone: '+56 9 1890 1234', passengers: 5, inscriptionDate: '2026-06-16', paymentStatus: 'Pagado', amount: 275000 },
  { id: 'INS-011', tourId: 3, tourName: 'Termas de Puyehue', tourDate: '2026-06-28', fullName: 'Camila Torres Saldaña', email: 'ctorres@gmail.com', phone: '+56 9 0901 2345', passengers: 2, inscriptionDate: '2026-06-17', paymentStatus: 'Pagado', amount: 110000 },
  { id: 'INS-012', tourId: 3, tourName: 'Termas de Puyehue', tourDate: '2026-07-05', fullName: 'Pablo Herrera Contreras', email: 'pherrera@gmail.com', phone: '+56 9 9012 3456', passengers: 3, inscriptionDate: '2026-06-18', paymentStatus: 'Pendiente', amount: 165000 },
  { id: 'INS-013', tourId: 3, tourName: 'Termas de Puyehue', tourDate: '2026-07-05', fullName: 'Isidora Fuentes Mora', email: 'ifuentes@gmail.com', phone: '+56 9 8888 1122', passengers: 1, inscriptionDate: '2026-06-20', paymentStatus: 'Pagado', amount: 55000 },
];

export const USER_MOCK_BOOKINGS: UserBooking[] = [
  { id: 'VMT-202606-0003', tourName: 'Termas de Puyehue', bookingDate: '2026-06-12', travelDate: '2026-06-21', status: 'Finalizado', passengers: 3, amount: 165000, tourImage: 'https://images.unsplash.com/photo-1759089572780-461b7202761b?w=300&h=180&fit=crop&auto=format&q=80', region: 'Los Lagos' },
  { id: 'VMT-202606-0006', tourName: 'Lago Todos los Santos', bookingDate: '2026-06-14', travelDate: '2026-06-26', status: 'Finalizado', passengers: 2, amount: 84000, tourImage: 'https://images.unsplash.com/photo-1758409571024-20dcf43d52bf?w=300&h=180&fit=crop&auto=format&q=80', region: 'Los Lagos' },
  { id: 'VMT-202606-0012', tourName: 'Volcán Osorno', bookingDate: '2026-06-22', travelDate: '2026-07-15', status: 'Confirmado', passengers: 2, amount: 178000, tourImage: 'https://images.unsplash.com/photo-1578704399126-38975ba256d7?w=300&h=180&fit=crop&auto=format&q=80', region: 'Los Lagos' },
  { id: 'VMT-202606-0015', tourName: 'Isla de Chiloé', bookingDate: '2026-06-25', travelDate: '2026-07-20', status: 'Pendiente', passengers: 1, amount: 68000, tourImage: 'https://images.unsplash.com/photo-1780903244920-0d808b6a509d?w=300&h=180&fit=crop&auto=format&q=80', region: 'Los Lagos' },
  { id: 'VMT-202606-0018', tourName: 'Saltos del Petrohué', bookingDate: '2026-06-28', travelDate: '2026-07-27', status: 'Confirmado', passengers: 4, amount: 140000, tourImage: 'https://images.unsplash.com/photo-1712921674876-83cda22594ec?w=300&h=180&fit=crop&auto=format&q=80', region: 'Los Lagos' },
];

export const MOCK_SALES: SaleRecord[] = [
  { id: 'VMT-202606-0001', tourName: 'Saltos del Petrohué', tourDate: '2026-06-20', passenger: 'María González', email: 'mgonzalez@gmail.com', passengers: 2, amount: 70000, status: 'Confirmada', operator: 'PUERTOTOURS', createdAt: '2026-06-10' },
  { id: 'VMT-202606-0002', tourName: 'Volcán Osorno', tourDate: '2026-07-01', passenger: 'Carlos Muñoz', email: 'cmuñoz@outlook.com', passengers: 1, amount: 89000, status: 'Confirmada', operator: 'TURISMOPTOMONTT', createdAt: '2026-06-11' },
  { id: 'VMT-202606-0003', tourName: 'Termas de Puyehue', tourDate: '2026-06-21', passenger: 'Ana Soto López', email: 'asoto@gmail.com', passengers: 3, amount: 165000, status: 'Confirmada', operator: 'PUERTOTOURS', createdAt: '2026-06-12' },
  { id: 'VMT-202606-0004', tourName: 'Isla de Chiloé', tourDate: '2026-06-22', passenger: 'Roberto Díaz', email: 'rdiaz@gmail.com', passengers: 2, amount: 136000, status: 'Pendiente', operator: 'TURISMONTT', createdAt: '2026-06-13' },
  { id: 'VMT-202606-0005', tourName: 'Valle de Cochamó', tourDate: '2026-07-02', passenger: 'Valentina Rojas', email: 'vrojas@gmail.com', passengers: 4, amount: 300000, status: 'Confirmada', operator: 'TREKKINGMONTT', createdAt: '2026-06-14' },
  { id: 'VMT-202606-0006', tourName: 'Lago Todos los Santos', tourDate: '2026-06-26', passenger: 'Felipe Morales', email: 'fmorales@gmail.com', passengers: 2, amount: 84000, status: 'Confirmada', operator: 'PUERTOTOURS', createdAt: '2026-06-14' },
  { id: 'VMT-202606-0007', tourName: 'Volcán Osorno', tourDate: '2026-07-15', passenger: 'Daniela Vega', email: 'dvega@gmail.com', passengers: 1, amount: 89000, status: 'Rechazada', operator: 'TURISMOPTOMONTT', createdAt: '2026-06-15' },
  { id: 'VMT-202606-0008', tourName: 'Saltos del Petrohué', tourDate: '2026-07-04', passenger: 'Matías Fernández', email: 'mfernandez@gmail.com', passengers: 5, amount: 175000, status: 'Confirmada', operator: 'PUERTOTOURS', createdAt: '2026-06-16' },
  { id: 'VMT-202606-0009', tourName: 'Isla de Chiloé', tourDate: '2026-07-06', passenger: 'Camila Torres', email: 'ctorres@gmail.com', passengers: 2, amount: 136000, status: 'Cancelada', operator: 'TURISMONTT', createdAt: '2026-06-17' },
  { id: 'VMT-202606-0010', tourName: 'Valle de Cochamó', tourDate: '2026-07-16', passenger: 'Pablo Herrera', email: 'pherrera@gmail.com', passengers: 3, amount: 225000, status: 'Confirmada', operator: 'TREKKINGMONTT', createdAt: '2026-06-18' },
];
