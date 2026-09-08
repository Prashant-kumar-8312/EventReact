import QRcode from 'qrcode';

const generateQR = async (data) => {
     
    try{
        const qrCode = await QRcode.toDataURL(data);

        return qrCode;
    }
    catch(error){
        console.error("Error generating QR code:", error);
        throw error;
    }
}

export default generateQR;

