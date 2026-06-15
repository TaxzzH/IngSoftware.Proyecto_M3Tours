export interface Tour {
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
}

export const DISCOUNT_CODES: Record<string, number> = {
  MATIASTENORIO25: 25,
  TOMAS15: 15,
  MATI10: 10,
  MAXIPIRI15: 15,
};

export const tours: Tour[] = [
  {
    id: 1,
    name: 'Saltos del Petrohué',
    region: 'Los Lagos',
    category: 'Naturaleza',
    difficulty: 'Fácil',
    price: 35000,
    groupPrice: 28000,
    duration: '1 día',
    maxGroup: 12,
    rating: 4.9,
    reviews: 234,
    shortDescription:
      'Cataratas volcánicas de aguas turquesas en el corazón del Parque Nacional Vicente Pérez Rosales.',
    heroImage:
      'https://images.unsplash.com/photo-1712921674876-83cda22594ec?w=1200&h=800&fit=crop&auto=format&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1712921674876-83cda22594ec?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1758409571145-b1f545707b14?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1759322437317-d89deaef8caa?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1578704399126-38975ba256d7?w=1200&h=800&fit=crop&auto=format&q=85',
    ],
    description:
      'Los Saltos del Petrohué son una serie de rápidos y cataratas formadas por la lava del Volcán Osorno que canalizó el río Petrohué. Sus aguas de un intenso color turquesa contrastan con la roca volcánica negra, creando un paisaje único en el mundo. El sendero es apto para toda la familia y ofrece vistas espectaculares al Volcán Osorno y el lago Todos los Santos.',
    highlights: [
      'Cataratas de aguas turquesas únicas en el mundo',
      'Vistas directas al cono perfecto del Volcán Osorno',
      'Sendero interpretativo de naturaleza volcánica',
      'Fauna nativa: patos correntinos y martines pescadores',
      'Mirador panorámico con vista al lago Todos los Santos',
    ],
    includes: [
      'Guía certificado SERNATUR',
      'Transporte ida y vuelta desde Puerto Varas',
      'Entrada al Parque Nacional Vicente Pérez Rosales',
      'Almuerzo tipo picnic con productos locales',
      'Bastones de trekking',
    ],
    excludes: [
      'Bebidas alcohólicas',
      'Propinas al guía',
      'Seguro de viaje personal',
      'Compras de souvenirs',
    ],
    meetingPoint: 'Hotel Campanario del Lago, Puerto Varas — 08:00 hrs',
    availableDates: [
      { date: '2026-06-20', spots: 8 },
      { date: '2026-06-27', spots: 4 },
      { date: '2026-07-04', spots: 12 },
      { date: '2026-07-11', spots: 6 },
      { date: '2026-07-18', spots: 10 },
    ],
  },
  {
    id: 2,
    name: 'Volcán Osorno',
    region: 'Los Lagos',
    category: 'Aventura',
    difficulty: 'Difícil',
    price: 89000,
    groupPrice: 72000,
    duration: '2 días',
    maxGroup: 8,
    rating: 4.8,
    reviews: 156,
    shortDescription:
      'Ascenso guiado al cono perfecto del volcán más emblemático de la Patagonia chilena a 2.652 m.s.n.m.',
    heroImage:
      'https://images.unsplash.com/photo-1578704399126-38975ba256d7?w=1200&h=800&fit=crop&auto=format&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1578704399126-38975ba256d7?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1578704410892-86dbdab9b4e8?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1562967688-0bff5e64548a?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1758409571145-b1f545707b14?w=1200&h=800&fit=crop&auto=format&q=85',
    ],
    description:
      'El Volcán Osorno (2.652 m.s.n.m.) es el ícono de la Región de Los Lagos. Su silueta perfectamente cónica, cubierta de glaciares perpetuos, domina el paisaje de Puerto Varas y el lago Llanquihue. La ascensión requiere equipamiento de alta montaña y buen estado físico, pero recompensa con vistas panorámicas 360° únicas de la Patagonia chilena y argentina.',
    highlights: [
      'Cumbre a 2.652 metros sobre el nivel del mar',
      'Glaciares y campos de hielo eternos',
      'Vista 360° de lagos, volcanes y Patagonia argentina',
      'Experiencia real de alta montaña con guías de elite',
      'Fotografía de naturaleza en condiciones extremas',
    ],
    includes: [
      'Guía alpinista certificado SERNATUR y UIAGM',
      'Equipo técnico completo (piolet, crampones, arnés, casco)',
      'Transporte ida y vuelta desde Puerto Varas',
      'Alimentación durante 2 días (4 comidas)',
      'Alojamiento en refugio de montaña certificado',
      'Seguro de rescate en montaña',
    ],
    excludes: [
      'Ropa personal de alta montaña (capa base, polar, Gore-Tex)',
      'Mochila técnica personal',
      'Propinas al guía',
      'Gastos adicionales en refugio (bar, lavandería)',
    ],
    meetingPoint: 'Centro de Ski Volcán Osorno — 06:00 hrs',
    availableDates: [
      { date: '2026-07-01', spots: 4 },
      { date: '2026-07-15', spots: 6 },
      { date: '2026-08-01', spots: 8 },
      { date: '2026-08-15', spots: 2 },
    ],
  },
  {
    id: 3,
    name: 'Termas de Puyehue',
    region: 'Los Lagos',
    category: 'Bienestar',
    difficulty: 'Fácil',
    price: 55000,
    groupPrice: 45000,
    duration: '1 día',
    maxGroup: 15,
    rating: 4.7,
    reviews: 312,
    shortDescription:
      'Relájate en las aguas termales geotérmicas del Parque Nacional Puyehue, rodeado de bosque nativo valdiviano.',
    heroImage:
      'https://images.unsplash.com/photo-1759089572780-461b7202761b?w=1200&h=800&fit=crop&auto=format&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1759089572780-461b7202761b?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1705987835862-d6030f293a36?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1758409571024-20dcf43d52bf?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1759322437317-d89deaef8caa?w=1200&h=800&fit=crop&auto=format&q=85',
    ],
    description:
      'Las Termas de Puyehue son reconocidas internacionalmente por sus aguas minerales de origen volcánico con propiedades terapéuticas únicas. Ubicadas dentro del Parque Nacional Puyehue, a orillas del lago del mismo nombre, ofrecen un entorno natural privilegiado donde la selva valdiviana se une con las aguas humeantes. Un día de completa desconexión y bienestar en la naturaleza patagónica.',
    highlights: [
      'Aguas termales geotérmicas entre 38°C y 42°C',
      'Piscinas naturales al aire libre en bosque nativo',
      'Barro volcánico con propiedades minerales curativas',
      'Sendero al río termomedicinal secreto',
      'Vistas al Cordón Caulle y Volcán Puyehue',
    ],
    includes: [
      'Guía naturalista certificado SERNATUR',
      'Transporte ida y vuelta desde Osorno',
      'Entrada al parque y acceso a termas',
      'Almuerzo buffet en restaurante termal',
      'Toallas y bata de baño',
    ],
    excludes: [
      'Tratamientos de spa adicionales (masajes, barro)',
      'Bebidas y snacks',
      'Propinas',
    ],
    meetingPoint: 'Plaza de Armas de Osorno — 07:30 hrs',
    availableDates: [
      { date: '2026-06-21', spots: 12 },
      { date: '2026-06-28', spots: 8 },
      { date: '2026-07-05', spots: 15 },
      { date: '2026-07-12', spots: 5 },
      { date: '2026-07-19', spots: 10 },
    ],
  },
  {
    id: 4,
    name: 'Isla de Chiloé',
    region: 'Los Lagos',
    category: 'Cultural',
    difficulty: 'Fácil',
    price: 68000,
    groupPrice: 54000,
    duration: '2 días',
    maxGroup: 14,
    rating: 4.9,
    reviews: 189,
    shortDescription:
      'Sumérgete en la magia de Chiloé: palafitos, iglesias UNESCO, mitología chilota y gastronomía única.',
    heroImage:
      'https://images.unsplash.com/photo-1490782300182-697b80ad4293?w=1200&h=800&fit=crop&auto=format&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1490782300182-697b80ad4293?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1617173205830-95d15d469996?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1758409571024-20dcf43d52bf?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1759322437317-d89deaef8caa?w=1200&h=800&fit=crop&auto=format&q=85',
    ],
    description:
      'Chiloé es un mundo aparte dentro de Chile. Sus iglesias de madera declaradas Patrimonio de la Humanidad por la UNESCO, sus coloridos palafitos sobre el mar, su rica mitología (el Trauco, la Pincoya, el Caleuche) y su incomparable gastronomía basada en el curanto hacen de la isla un destino que marca para siempre. Un viaje al alma más profunda y auténtica de Chile.',
    highlights: [
      'Iglesias patrimoniales UNESCO de Castro y Dalcahue',
      'Palafitos coloridos de la costanera de Castro',
      'Curanto al hoyo, el plato emblemático de Chiloé',
      'Feria artesanal con tejidos en lana natural de oveja',
      'Cruce en ferri con vistas al archipiélago al atardecer',
      'Relatos de mitología chilota con habitantes locales',
    ],
    includes: [
      'Guía histórico-cultural certificado SERNATUR',
      'Transporte desde Puerto Montt',
      'Pasaje de ferri ida y vuelta',
      'Alojamiento en hostal boutique de Castro (1 noche)',
      'Desayuno, almuerzo curanto y cena típica',
    ],
    excludes: [
      'Compras personales en ferias y tiendas',
      'Bebidas extras fuera de las incluidas',
      'Propinas',
    ],
    meetingPoint: 'Terminal de Buses Puerto Montt — 07:00 hrs',
    availableDates: [
      { date: '2026-06-22', spots: 10 },
      { date: '2026-07-06', spots: 14 },
      { date: '2026-07-20', spots: 6 },
      { date: '2026-08-03', spots: 12 },
    ],
  },
  {
    id: 5,
    name: 'Valle de Cochamó',
    region: 'Los Lagos',
    category: 'Trekking',
    difficulty: 'Moderado',
    price: 75000,
    groupPrice: 62000,
    duration: '3 días',
    maxGroup: 10,
    rating: 4.8,
    reviews: 97,
    shortDescription:
      'Trekking por el "Yosemite de Sudamérica": paredes de granito, selva valdiviana virgen y cóndores andinos.',
    heroImage:
      'https://images.unsplash.com/photo-1759322437317-d89deaef8caa?w=1200&h=800&fit=crop&auto=format&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1759322437317-d89deaef8caa?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1765212174674-0550cabc7551?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1767708235743-85177b5ea93e?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1758409571145-b1f545707b14?w=1200&h=800&fit=crop&auto=format&q=85',
    ],
    description:
      'El Valle de Cochamó es uno de los secretos mejor guardados de la Patagonia. Conocido como el "Yosemite de Sudamérica" por sus imponentes paredes de granito que emergen de la selva valdiviana, es el paraíso del montañismo y el trekking de expedición. El acceso a caballo hasta el campo base, atravesando bosques de arrayán y bosques milenarios, es ya una experiencia transformadora.',
    highlights: [
      'Paredes de granito de hasta 1.000 metros de altura',
      'Acceso a caballo por sendero ancestral de arrieros',
      'Avistamiento de cóndores andinos en su hábitat',
      'Camping bajo los monolitos con cielo despejado',
      'Cruce de ríos cristalinos de deshielo cordillerano',
      'Selva valdiviana declarada Patrimonio Biósfera UNESCO',
    ],
    includes: [
      'Guía de montaña certificado SERNATUR',
      'Transporte desde Puerto Montt',
      'Arriero con caballos de carga para equipaje',
      'Alimentación completa 3 días (6 comidas)',
      'Equipo de camping completo (carpa, estera, cocina)',
      'Kit de primeros auxilios y radio de emergencia',
    ],
    excludes: [
      'Bolsa de dormir personal (arriendo disponible)',
      'Ropa técnica de trekking',
      'Propinas al guía y arriero',
    ],
    meetingPoint: 'Puerto de Cochamó — 08:00 hrs',
    availableDates: [
      { date: '2026-07-02', spots: 6 },
      { date: '2026-07-16', spots: 8 },
      { date: '2026-07-30', spots: 4 },
      { date: '2026-08-13', spots: 10 },
    ],
  },
  {
    id: 6,
    name: 'Lago Todos los Santos',
    region: 'Los Lagos',
    category: 'Naturaleza',
    difficulty: 'Fácil',
    price: 42000,
    groupPrice: 34000,
    duration: '1 día',
    maxGroup: 16,
    rating: 4.7,
    reviews: 278,
    shortDescription:
      'Navegación lacustre por el esmeralda Lago Todos los Santos con vistas al Volcán Osorno y la Cordillera.',
    heroImage:
      'https://images.unsplash.com/photo-1758409571024-20dcf43d52bf?w=1200&h=800&fit=crop&auto=format&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1758409571024-20dcf43d52bf?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1758409571145-b1f545707b14?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1578704399126-38975ba256d7?w=1200&h=800&fit=crop&auto=format&q=85',
      'https://images.unsplash.com/photo-1712921674876-83cda22594ec?w=1200&h=800&fit=crop&auto=format&q=85',
    ],
    description:
      'El Lago Todos los Santos, conocido como "el Esmeralda" por el intenso color verde-esmeralda de sus aguas, es uno de los paisajes más espectaculares de la Patagonia chilena. Rodeado de volcanes nevados, cascadas y bosques milenarios, la navegación en catamarán ofrece vistas imposibles de describir. Al fondo, el imponente Volcán Osorno refleja su perfecta silueta cónica en las aguas espejadas.',
    highlights: [
      'Navegación en catamarán por aguas esmeralda únicas',
      'Vistas al Volcán Osorno y Cordillera Pelada nevada',
      'Parada en Peulla con cascadas naturales',
      'Fauna acuática nativa: hualas y patos cabeza canela',
      'Degustación de kuchen alemán y mate a bordo',
    ],
    includes: [
      'Guía naturalista certificado SERNATUR',
      'Transporte ida y vuelta desde Puerto Varas',
      'Pasaje en catamarán lacustre',
      'Almuerzo en Hostería de Peulla',
      'Seguro de navegación y chaleco salvavidas',
    ],
    excludes: [
      'Bebidas extras a bordo',
      'Propinas al guía',
    ],
    meetingPoint: 'Muelle de Petrohué — 09:00 hrs',
    availableDates: [
      { date: '2026-06-19', spots: 14 },
      { date: '2026-06-26', spots: 8 },
      { date: '2026-07-03', spots: 16 },
      { date: '2026-07-10', spots: 6 },
      { date: '2026-07-17', spots: 12 },
    ],
  },
];
