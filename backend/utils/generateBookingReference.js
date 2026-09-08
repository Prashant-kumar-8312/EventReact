const generateBookingReference = () => {

    const random = Math.random().toString(36).substring(2, 8).toUpperCase();

    return `EVT-${Date.now()}-${random}`;
};

export default generateBookingReference;