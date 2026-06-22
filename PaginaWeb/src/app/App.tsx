import React, { useState } from 'react';
import { Tour, tours as initialTours } from './data/tours';
import { AppUser, ManagedTour, INITIAL_USERS, SaleRecord, MOCK_SALES } from './data/auth';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { HomeScreen } from './components/HomeScreen';
import { CatalogScreen } from './components/CatalogScreen';
import { TourDetailScreen } from './components/TourDetailScreen';
import { BookingScreen } from './components/BookingScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { MisViajesScreen } from './components/MisViajesScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { OperatorDashboard } from './components/OperatorDashboard';

export type Screen =
  | 'login' | 'register' | 'home' | 'catalog' | 'detail'
  | 'booking' | 'payment' | 'confirmation' | 'my-trips';

export interface BookingData {
  tour: Tour;
  date: string;
  passengers: number;
  rateType: 'individual' | 'group';
  subtotal: number;
  discountCode: string;
  discountPercent: number;
  discountAmount: number;
  total: number;
  passengerName: string;
  passengerLastName: string;
  passengerRut: string;
  passengerEmail: string;
  passengerPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  specialNeeds: string;
  bookingNumber: string;
}

const buildManagedTours = (): ManagedTour[] =>
  initialTours.map((t, i) => ({
    ...t,
    ownerId: i < 3 ? '2' : '1',
    active: true,
  }));

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [appUsers, setAppUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [managedTours, setManagedTours] = useState<ManagedTour[]>(buildManagedTours());
  const [sales] = useState<SaleRecord[]>(MOCK_SALES);

  const [screen, setScreen] = useState<Screen>('login');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);
  const [searchParams, setSearchParams] = useState<{ destination: string; date: string; travelers: number } | null>(null);

  const navigate = (s: Screen) => { setScreen(s); window.scrollTo(0, 0); };

  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
    setScreen('home');
  };

  const handleRegister = (userData: Omit<AppUser, 'id' | 'createdAt'>) => {
    const newUser: AppUser = {
      ...userData,
      id: String(Date.now()),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setAppUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setScreen('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('login');
    setSelectedTour(null);
    setBookingData(null);
    setPaymentSuccess(null);
  };

  const handleAddTour = (tour: ManagedTour) => setManagedTours((prev) => [...prev, tour]);
  const handleUpdateTour = (updated: ManagedTour) => setManagedTours((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  const handleDeleteTour = (id: number) => setManagedTours((prev) => prev.filter((t) => t.id !== id));
  const handleUpdateUser = (updated: AppUser) => setAppUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

  // ─── Not logged in ───────────────────────────────────────
  if (!currentUser) {
    if (screen === 'register') {
      return <RegisterScreen onRegister={handleRegister} onBack={() => setScreen('login')} />;
    }
    return <LoginScreen onLogin={handleLogin} onRegister={() => setScreen('register')} />;
  }

  // ─── Admin ───────────────────────────────────────────────
  if (currentUser.role === 'admin') {
    return (
      <AdminDashboard
        currentUser={currentUser}
        tours={managedTours}
        users={appUsers}
        sales={sales}
        onAddTour={handleAddTour}
        onUpdateTour={handleUpdateTour}
        onDeleteTour={handleDeleteTour}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
      />
    );
  }

  // ─── Operator ────────────────────────────────────────────
  if (currentUser.role === 'operator') {
    return (
      <OperatorDashboard
        currentUser={currentUser}
        tours={managedTours.filter((t) => t.ownerId === currentUser.id)}
        sales={sales}
        onAddTour={(t) => handleAddTour({ ...t, ownerId: currentUser.id })}
        onUpdateTour={handleUpdateTour}
        onDeleteTour={handleDeleteTour}
        onLogout={handleLogout}
      />
    );
  }

  // ─── User/client ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {screen === 'home' && (
        <HomeScreen
          currentUser={currentUser}
          onNavigateCatalog={(params) => { setSearchParams(params ?? null); navigate('catalog'); }}
          onSelectTour={(tour) => { setSelectedTour(tour); navigate('detail'); }}
          onLogout={handleLogout}
          onMyTrips={() => navigate('my-trips')}
        />
      )}
      {screen === 'my-trips' && (
        <MisViajesScreen
          currentUser={currentUser}
          onBack={() => navigate('home')}
        />
      )}
      {screen === 'catalog' && (
        <CatalogScreen
          initialSearch={searchParams?.destination ?? ''}
          onSelectTour={(tour) => { setSelectedTour(tour); navigate('detail'); }}
          onBack={() => navigate('home')}
        />
      )}
      {screen === 'detail' && selectedTour && (
        <TourDetailScreen
          tour={selectedTour}
          onBook={(data) => { setBookingData(data); navigate('booking'); }}
          onBack={() => navigate('catalog')}
          onHome={() => navigate('home')}
        />
      )}
      {screen === 'booking' && bookingData && (
        <BookingScreen
          bookingData={bookingData}
          onUpdateBooking={setBookingData}
          onPay={() => navigate('payment')}
          onBack={() => navigate('detail')}
        />
      )}
      {screen === 'payment' && bookingData && (
        <PaymentScreen
          bookingData={bookingData}
          onComplete={(success) => { setPaymentSuccess(success); navigate('confirmation'); }}
          onBack={() => navigate('booking')}
        />
      )}
      {screen === 'confirmation' && bookingData && paymentSuccess !== null && (
        <ConfirmationScreen
          bookingData={bookingData}
          paymentSuccess={paymentSuccess}
          onHome={() => { navigate('home'); setBookingData(null); setPaymentSuccess(null); }}
          onRetry={() => navigate('payment')}
        />
      )}
    </div>
  );
}
