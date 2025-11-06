import jsPDF from "jspdf"

export const generateReceiptPDF = (orderData: any) => {
  console.log("the generate pdf called")
  const doc = new jsPDF()

  let yPosition = 20
  doc.setFillColor(41, 128, 185)
  doc.rect(0, 0, 210, 35, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("bold")
  doc.text("SERVICE INVOICE", 105, 15, { align: "center" })

  doc.setFontSize(10)
  doc.setFont("normal")
  doc.text("FixMyRide Vehicle Service and Repairs", 105, 23, { align: "center" })
  doc.text("Thank you for choosing our services", 105, 29, { align: "center" })

  doc.setTextColor(0, 0, 0)
  yPosition = 45
  doc.setFillColor(245, 245, 245)
  doc.rect(10, yPosition, 190, 25, "F")
  doc.setDrawColor(200, 200, 200)
  doc.rect(10, yPosition, 190, 25, "S")

  doc.setFontSize(10)
  doc.setFont("bold")
  doc.text("Invoice Details", 15, yPosition + 7)

  doc.setFont( "normal")
  doc.setFontSize(9)
  doc.text(`Invoice #: ${orderData._id.slice(-12).toUpperCase()}`, 15, yPosition + 14)
  doc.text(
    `Date: ${new Date(orderData.orderedAt || orderData.serviceDate).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    15,
    yPosition + 20,
  )

  doc.text(`Payment Method: ${orderData.paymentMethod.toUpperCase()}`, 110, yPosition + 14)
  doc.text(`Status: ${orderData.paymentStatus.toUpperCase()}`, 110, yPosition + 20)

  yPosition += 35

  doc.setFillColor(245, 245, 245)
  doc.rect(10, yPosition, 92, 40, "F")
  doc.rect(10, yPosition, 92, 40, "S")

  doc.setFont("bold")
  doc.setFontSize(10)
  doc.text("Customer Information", 15, yPosition + 7)

  doc.setFont("normal")
  doc.setFontSize(9)
  doc.text(`Name: ${orderData.user.name}`, 15, yPosition + 14)
  doc.text(`Phone: ${orderData.user.phone}`, 15, yPosition + 20)
  doc.text(`Email: ${orderData.user.email}`, 15, yPosition + 26)

  // Address
  const address = `${orderData.address.addressLine1}${orderData.address.addressLine2 ? ", " + orderData.address.addressLine2 : ""}`
  doc.text(`Address: ${address}`, 15, yPosition + 32)
  doc.text(`${orderData.address.city}, ${orderData.address.state} - ${orderData.address.zipCode}`, 15, yPosition + 37)

  // Vehicle Information
  doc.setFillColor(245, 245, 245)
  doc.rect(108, yPosition, 92, 40, "F")
  doc.rect(108, yPosition, 92, 40, "S")

  doc.setFont("bold")
  doc.setFontSize(10)
  doc.text("Vehicle Information", 113, yPosition + 7)

  doc.setFont("normal")
  doc.setFontSize(9)
  doc.text(`Brand: ${orderData.vehicle.brandName}`, 113, yPosition + 14)
  doc.text(`Model: ${orderData.vehicle.modelName}`, 113, yPosition + 20)
  doc.text(`Fuel Type: ${orderData.services[0].fuelType.toUpperCase()}`, 113, yPosition + 26)
  doc.text(`Service Date: ${new Date(orderData.serviceDate).toLocaleDateString("en-IN")}`, 113, yPosition + 32)
  doc.text(`Time Slot: ${orderData.selectedSlot}`, 113, yPosition + 37)

  yPosition += 50

  // Services Section
  doc.setFont("bold")
  doc.setFontSize(12)
  doc.text("Service Details", 15, yPosition)
  yPosition += 8

  orderData.services.forEach((service: any, index: number) => {
    // Service Title Box
    doc.setFillColor(240, 248, 255)
    doc.rect(10, yPosition, 190, 8, "F")
    doc.setDrawColor(200, 200, 200)
    doc.rect(10, yPosition, 190, 8, "S")

    doc.setFont("bold")
    doc.setFontSize(10)
    doc.text(`${index + 1}. ${service.title}`, 15, yPosition + 5)
    yPosition += 12

    // Service Description
    doc.setFont("normal")
    doc.setFontSize(8)
    const splitDescription = doc.splitTextToSize(service.description, 180)
    doc.text(splitDescription, 15, yPosition)
    yPosition += splitDescription.length * 4 + 5

    // Parts Breakdown
    if (service.priceBreakup.parts && service.priceBreakup.parts.length > 0) {
      doc.setFont("bold")
      doc.setFontSize(9)
      doc.text("Parts & Materials:", 15, yPosition)
      yPosition += 6

      // Table Header
      doc.setFillColor(230, 230, 230)
      doc.rect(15, yPosition - 4, 170, 6, "F")
      doc.setFontSize(8)
      doc.text("Item", 20, yPosition)
      doc.text("Qty", 130, yPosition)
      doc.text("Price", 150, yPosition)
      doc.text("Total", 175, yPosition, { align: "right" })
      yPosition += 6

      doc.setFont("normal")
      service.priceBreakup.parts.forEach((part: any) => {
        doc.text(part.name, 20, yPosition)
        doc.text(part.quantity.toString(), 130, yPosition)
        doc.text(`₹${part.price.toFixed(2)}`, 150, yPosition)
        doc.text(`₹${(part.price * part.quantity).toFixed(2)}`, 185, yPosition, { align: "right" })
        yPosition += 5
      })

      yPosition += 3
    }

    // Price Breakdown
    doc.setDrawColor(200, 200, 200)
    doc.line(15, yPosition, 185, yPosition)
    yPosition += 6

    doc.setFont("normal")
    doc.setFontSize(9)

    const partsTotal =
      service.priceBreakup.parts?.reduce((sum: number, part: any) => sum + part.price * part.quantity, 0) || 0

    doc.text("Parts Total:", 130, yPosition)
    doc.text(`₹${partsTotal.toFixed(2)}`, 185, yPosition, { align: "right" })
    yPosition += 6

    doc.text("Labor Charge:", 130, yPosition)
    doc.text(`₹${service.priceBreakup.laborCharge.toFixed(2)}`, 185, yPosition, { align: "right" })
    yPosition += 6

    if (service.priceBreakup.discount > 0) {
      doc.setTextColor(0, 150, 0)
      doc.text("Discount:", 130, yPosition)
      doc.text(`-₹${service.priceBreakup.discount.toFixed(2)}`, 185, yPosition, { align: "right" })
      doc.setTextColor(0, 0, 0)
      yPosition += 6
    }

    doc.text("Tax (GST):", 130, yPosition)
    doc.text(`₹${service.priceBreakup.tax.toFixed(2)}`, 185, yPosition, { align: "right" })
    yPosition += 8

    // Service Total
    doc.setFont("bold")
    doc.setFillColor(240, 240, 240)
    doc.rect(125, yPosition - 5, 60, 8, "F")
    doc.text("Service Total:", 130, yPosition)
    doc.text(`₹${service.priceBreakup.total.toFixed(2)}`, 185, yPosition, { align: "right" })
    yPosition += 12
  })

  // Grand Total Section
  doc.setFillColor(41, 128, 185)
  doc.rect(10, yPosition, 190, 12, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFont("bold")
  doc.setFontSize(12)
  doc.text("TOTAL AMOUNT PAID:", 15, yPosition + 8)
  doc.text(`₹${orderData.finalAmount || orderData.totalAmount}`, 185, yPosition + 8, { align: "right" })

  doc.setTextColor(0, 0, 0)
  yPosition += 20

  // Payment Information
  if (orderData.razorpayPaymentId) {
    doc.setFontSize(8)
    doc.setFont("normal")
    doc.text(`Payment ID: ${orderData.razorpayPaymentId}`, 15, yPosition)
    doc.text(`Order ID: ${orderData.razorpayOrderId}`, 15, yPosition + 5)
    yPosition += 12
  }

  // Footer
  doc.setDrawColor(200, 200, 200)
  doc.line(10, yPosition, 200, yPosition)
  yPosition += 6

  doc.setFontSize(9)
  doc.setFont("italic")
  doc.text("Thank you for your business!", 105, yPosition, { align: "center" })
  yPosition += 5

  doc.setFontSize(8)
  doc.text("For any queries, please contact our customer support", 105, yPosition, { align: "center" })
  yPosition += 4
  doc.text("This is a computer-generated invoice and does not require a signature", 105, yPosition, { align: "center" })

  // Save the PDF
  const fileName = `Invoice_${orderData._id.slice(-8).toUpperCase()}_${new Date().getTime()}.pdf`
  doc.save(fileName)
}
