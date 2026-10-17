import { CartItem } from '@/types';

export const DEFAULT_WHATSAPP_NUMBERS = {
  primary: '919052523835',
  alternate: '917732062291',
};

/**
 * Normalizes any phone number into international digits-only format for WhatsApp (e.g. 919052523835)
 */
export function sanitizeWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export interface WhatsAppOrderPayload {
  customerName: string;
  customerLocality?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

/**
 * Builds the exact message specified in section 8 of the requirements
 */
export function buildWhatsAppOrderMessage(payload: WhatsAppOrderPayload): string {
  const { customerName, customerLocality, items, subtotal, discount, total } = payload;

  const localityText = customerLocality && customerLocality.trim().length > 0
    ? `My locality/delivery area is: ${customerLocality.trim()}.\n\n`
    : '';

  const itemListText = items
    .map((item, index) => {
      const lineTotal = item.selling_price * item.quantity;
      const potencyOrPack = item.potency ? ` (${item.potency})` : item.pack_size ? ` (${item.pack_size})` : '';
      return `${index + 1}. ${item.name}${potencyOrPack}\n   Quantity: ${item.quantity}\n   Unit Price: ₹${item.selling_price}\n   Amount: ₹${lineTotal}`;
    })
    .join('\n\n');

  const discountText = discount > 0 ? `Discount: ₹${discount}\n` : '';

  return `Hello, Dr. Praveen’s Homoeopathy clinic & Pharmacy,

My name is ${customerName.trim()}.

${localityText}I would like to enquire about the availability of the following products:

${itemListText}

Subtotal: ₹${subtotal}
${discountText}Estimated Total: ₹${total}

Are these products available? Please let me know as soon as possible.

Thank you.`;
}

/**
 * Generates the full click-to-chat URL for an order enquiry
 */
export function createWhatsAppOrderUrl(
  phoneNumber: string,
  payload: WhatsAppOrderPayload
): string {
  const cleanNumber = sanitizeWhatsAppNumber(phoneNumber || DEFAULT_WHATSAPP_NUMBERS.primary);
  const message = buildWhatsAppOrderMessage(payload);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export interface AppointmentPayload {
  patientName: string;
  phone: string;
  preferredDate: string;
  preferredTimeSlot: string;
  consultationType: 'in_clinic' | 'online';
  reason?: string;
}

/**
 * Builds the doctor appointment enquiry message
 */
export function buildAppointmentMessage(payload: AppointmentPayload): string {
  const typeLabel =
    payload.consultationType === 'in_clinic'
      ? 'In-Clinic Consultation (Bengaluru)'
      : 'Online Video Consultation';

  const reasonLine =
    payload.reason && payload.reason.trim().length > 0
      ? `\nReason / Health Notes: ${payload.reason.trim()}`
      : '';

  return `Hello Dr. Praveen’s Homoeopathy Clinic,

My name is ${payload.patientName.trim()}.
Contact Number: ${payload.phone.trim()}

I would like to enquire about booking a doctor consultation:
Preferred Date: ${payload.preferredDate}
Preferred Time: ${payload.preferredTimeSlot}
Consultation Type: ${typeLabel}${reasonLine}

Please let me know the availability and confirm the appointment.

Thank you.`;
}

/**
 * Generates the full click-to-chat URL for an appointment enquiry
 */
export function createWhatsAppAppointmentUrl(
  phoneNumber: string,
  payload: AppointmentPayload
): string {
  const cleanNumber = sanitizeWhatsAppNumber(phoneNumber || DEFAULT_WHATSAPP_NUMBERS.primary);
  const message = buildAppointmentMessage(payload);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
