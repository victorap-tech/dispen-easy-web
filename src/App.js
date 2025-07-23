{qrOpen && (
  <div className="qr-modal-bg">
    <div className="qr-modal-card">
      <QRCodeCanvas id="qr-to-print" value={qrValue} size={250} />
      <p style={{ marginTop: 10 }}>{qrValue}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
        {/* Botón descargar */}
        <button
          style={{ background: "#3EAD5C" }}
          onClick={() => {
            // Descargar imagen PNG
            const canvas = document.getElementById('qr-to-print');
            const url = canvas.querySelector('canvas').toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'qr-dispen-easy.png';
            link.href = url;
            link.click();
          }}
        >
          Descargar QR
        </button>
        {/* Botón imprimir */}
        <button
          style={{ background: "#2673C3" }}
          onClick={() => {
            // Solo imprime el QR, no toda la página
            const qrContainer = document.getElementById('qr-to-print');
            const qrImgData = qrContainer.querySelector('canvas').toDataURL('image/png');
            const w = window.open('');
            w.document.write(`<img src="${qrImgData}" style="width:300px;display:block;margin:auto;" />`);
            w.print();
            w.close();
          }}
        >
          Imprimir QR
        </button>
      </div>
      <button
        style={{ marginTop: 18, padding: '7px 20px', background: '#E44C4C' }}
        onClick={() => setQROpen(false)}>
        Cerrar
      </button>
    </div>
  </div>
)}
