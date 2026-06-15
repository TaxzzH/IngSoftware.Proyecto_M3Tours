import React, { useState } from 'react';
import { Tour } from './data/tours';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { CatalogScreen } from './components/CatalogScreen';
import { TourDetailScreen } from './components/TourDetailScreen';
import { BookingScreen } from './components/BookingScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { ConfirmationScreen } from './components/ConfirmationScreen';

export type Screen = 'login' | 'home' | 'catalog' | 'detail' | 'booking' | 'payment' | 'confirmation';

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

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);
  const [searchParams, setSearchParams] = useState<{ destination: string; date: string; travelers: number } | null>(null);

  const navigate = (s: Screen) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {screen === 'login' && (
        <LoginScreen onLogin={() => navigate('home')} />
      )}
      {screen === 'home' && (
        <HomeScreen
          onNavigateCatalog={(params) => {
            setSearchParams(params ?? null);
            navigate('catalog');
          }}
          onSelectTour={(tour) => {
            setSelectedTour(tour);
            navigate('detail');
          }}
        />
      )}
      {screen === 'catalog' && (
        <CatalogScreen
          initialSearch={searchParams?.destination ?? ''}
          onSelectTour={(tour) => {
            setSelectedTour(tour);
            navigate('detail');
          }}
          onBack={() => navigate('home')}
        />
      )}
      {screen === 'detail' && selectedTour && (
        <TourDetailScreen
          tour={selectedTour}
          onBook={(data) => {
            setBookingData(data);
            navigate('booking');
          }}
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
          onComplete={(success) => {
            setPaymentSuccess(success);
            navigate('confirmation');
          }}
          onBack={() => navigate('booking')}
        />
      )}
      {screen === 'confirmation' && bookingData && paymentSuccess !== null && (
        <ConfirmationScreen
          bookingData={bookingData}
          paymentSuccess={paymentSuccess}
          onHome={() => {
            navigate('home');
            setBookingData(null);
            setPaymentSuccess(null);
          }}
          onRetry={() => navigate('payment')}
        />
      )}
    </div>
  );
}
