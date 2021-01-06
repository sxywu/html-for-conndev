/*
  Get QR Code Script 
  Defines Gets a QR code of the page's URL from http://goqr.me/api/doc/
  and makes it the source of an image tag in the page.

  created 5 Jan 2021 
  by Tom Igoe
*/

// add a QR code of the URL when the page loads
function getQrCode() {
  // set the size of the tag:
  let tagWidth = 50;
  let tagHeight = 50;
  // get the document URL:
  let tagCode = document.URL;
  // start the tag request from qrserver.com:
  let url = 'https://api.qrserver.com/v1/create-qr-code/?data=' + tagCode;
  // get the image and label:
  let img = document.getElementById('qrCode');
  let label = document.getElementById('label');
  // fill in the properties of the image and label:
  img.src = url;
  img.alt = "a QR code of the document URL";
  img.height = tagHeight;
  img.width = tagWidth;
  label.innerHTML = document.URL;
}

// on page load, call the QR code function:
document.addEventListener('DOMContentLoaded', getQrCode);