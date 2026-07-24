export const DTDC_TRACKING_PAGE = "https://www.dtdc.com/track-your-shipment/";

export function trackShipment(trackingNumber, onCopied) {
  if (trackingNumber && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(trackingNumber).then(() => onCopied?.());
  }
  window.open(DTDC_TRACKING_PAGE, "_blank");
}
