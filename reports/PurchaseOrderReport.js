let PurchaseOrderReport = {};

PurchaseOrderReport.print = () => {
    let doc = new jsPDF()
    doc.text('80 80', 80, 80)
    doc.text('30 50', 30, 50)
    doc.save('a4.pdf');
}

export default PurchaseOrderReport;
