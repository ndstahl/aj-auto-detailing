export interface Translations {
  common: {
    bookNow: string
    getQuote: string
    backToHome: string
    phone: string
    loading: string
  }

  nav: {
    services: string
    packages: string
    gallery: string
    getFreeQuote: string
    bookNow: string
  }

  footer: {
    tagline: string
    navigate: string
    services: string
    contact: string
    allRightsReserved: string
    servicesList: string[]
    navLinks: Array<{ label: string }>
  }

  home: {
    hero: {
      location: string
      title: string
      titleAccent: string
      subtitle: string
      bookAppointment: string
      getFreeQuote: string
      stats: Array<{ value: string; label: string }>
    }
    work: {
      sectionLabel: string
      heading: string
      viewGallery: string
    }
    services: {
      sectionLabel: string
      heading: string
      description: string
      servicesPricing: string
      bookService: string
      biohazardFees: string
      biohazardDisclaimer: string
      items: Array<{ name: string; price: string }>
      biohazardItems: Array<{ description: string; price: string }>
    }
    packages: {
      sectionLabel: string
      heading: string
      description: string
      bookNow: string
      getFreeQuote: string
      miscTitle: string
      miscSubtitle: string
      items: Array<{
        name: string
        price: string
        tag: string | null
        desc: string
        features: string[]
        glow: string
        featured: boolean
      }>
      miscServices: Array<{ name: string; price: string }>
    }
    why: {
      sectionLabel: string
      heading: string
      paragraph1: string
      paragraph2: string
      paragraph3: string
      serviceArea: string
      serviceAreaLabel: string
      serviceAreaRadius: string
      serviceAreaDescription: string
      travelFee: string
      withinMiles: string
      noCharge: string
      beyondMiles: string
      flatFee: string
      travelFeeDescription: string
    }
    mission: {
      sectionLabel: string
      statement: string
      paragraph1: string
      paragraph2: string
      quote: string
      attribution: string
    }
    cta: {
      heading: string
      subheading: string
      bookNow: string
      getFreeQuote: string
    }
  }

  booking: {
    sectionLabel: string
    heading: string
    description: string
    availableTimes: string
    selectDate: string
    loadingSlots: string
    noSlots: string
    continue: string
    yourInfo: string
    fullName: string
    email: string
    phone: string
    vehicle: string
    service: string
    notes: string
    selectService: string
    notesPlaceholder: string
    confirmBooking: string
    booking: string
    successHeading: string
    successMessage: string
    at: string
    services: string[]
  }

  quote: {
    sectionLabel: string
    heading: string
    description: string
    yourInformation: string
    fullName: string
    phoneNumber: string
    email: string
    address: string
    vehicleInformation: string
    year: string
    make: string
    model: string
    serviceDetails: string
    serviceRequested: string
    additionalNotes: string
    selectYear: string
    selectService: string
    notesPlaceholder: string
    requestQuote: string
    sending: string
    successHeading: string
    successMessage: string
    backToHome: string
    bookNow: string
    services: string[]
  }

  gallery: {
    sectionLabel: string
    heading: string
    description: string
    bookYourDetail: string
  }
}
